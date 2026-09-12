import crypto from "node:crypto";
import { hashPassword, verifyPassword } from "../../lib/hash.js";
import { signAccessToken } from "../../lib/jwt.js";
import { prisma } from "../../lib/prisma.js";
import { verifyTelegramAuth } from "../../lib/telegram.js";
import { AppError } from "../../middlewares/error.middleware.js";
import type {
  LoginInput,
  OAuthInput,
  RegisterInput,
  TelegramAuthInput,
} from "./auth.schema.js";

interface SessionMeta {
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService {
  private async createSession(userId: string, meta: SessionMeta) {
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return prisma.session.create({
      data: {
        userId,
        token: sessionToken,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        expiresAt,
      },
    });
  }

  async register(input: RegisterInput, meta: SessionMeta = {}) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingEmail) {
      throw new AppError("Email is already registered", 409);
    }

    if (input.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: input.username },
      });
      if (existingUsername) {
        throw new AppError("Username is already taken", 409);
      }
    }

    const passwordHash = await hashPassword(input.password);

    // If first user, make ADMIN
    const count = await prisma.user.count();
    const role = count === 0 ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username || null,
        name: input.name || null,
        passwordHash,
        role,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    });

    const session = await this.createSession(user.id, meta);

    const token = await signAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      sessionId: session.id,
    });

    return { user, token };
  }

  async login(input: LoginInput, meta: SessionMeta = {}) {
    const isEmail = input.identifier.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail ? { email: input.identifier } : { username: input.identifier },
    });

    if (!user || !user.passwordHash) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.status === "SUSPENDED") {
      throw new AppError("Your account has been suspended. Please contact support.", 403);
    }

    const isValid = await verifyPassword(user.passwordHash, input.password);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const session = await this.createSession(user.id, meta);

    const token = await signAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      sessionId: session.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async loginOAuth(input: OAuthInput, meta: SessionMeta = {}) {
    let user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      // Generate unique username from email
      const baseUsername = input.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      const count = await prisma.user.count();
      const role = count === 0 ? "ADMIN" : "USER";

      user = await prisma.user.create({
        data: {
          email: input.email,
          username: `${baseUsername}_${crypto.randomBytes(3).toString("hex")}`,
          name: input.name || baseUsername,
          avatar: input.avatar || null,
          role,
        },
      });
    }

    if (user.status === "SUSPENDED") {
      throw new AppError("Account is suspended", 403);
    }

    // Link Account
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: input.provider,
          providerAccountId: input.providerAccountId,
        },
      },
      update: {
        metadata: JSON.stringify({ lastLogin: new Date().toISOString() }),
      },
      create: {
        userId: user.id,
        provider: input.provider,
        providerAccountId: input.providerAccountId,
        metadata: JSON.stringify({ connectedAt: new Date().toISOString() }),
      },
    });

    const session = await this.createSession(user.id, meta);

    const token = await signAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      sessionId: session.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async loginTelegram(input: TelegramAuthInput, meta: SessionMeta = {}) {
    const isValid = verifyTelegramAuth(input);
    if (!isValid) {
      throw new AppError("Invalid Telegram authentication signature", 401);
    }

    const tgId = String(input.id);
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "telegram",
          providerAccountId: tgId,
        },
      },
      include: { user: true },
    });

    let user = existingAccount?.user;

    if (!user) {
      const email = `tg_${tgId}@telegram.auth`;
      const fullName = [input.first_name, input.last_name].filter(Boolean).join(" ");
      const username = input.username || `tg_${tgId}`;

      const count = await prisma.user.count();
      const role = count === 0 ? "ADMIN" : "USER";

      user = await prisma.user.create({
        data: {
          email,
          username,
          name: fullName || username,
          avatar: input.photo_url || null,
          role,
        },
      });

      await prisma.account.create({
        data: {
          userId: user.id,
          provider: "telegram",
          providerAccountId: tgId,
          metadata: JSON.stringify(input),
        },
      });
    }

    if (user.status === "SUSPENDED") {
      throw new AppError("Account is suspended", 403);
    }

    const session = await this.createSession(user.id, meta);

    const token = await signAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      sessionId: session.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        accounts: {
          select: { provider: true, createdAt: true },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async logout(sessionId?: string) {
    if (sessionId) {
      await prisma.session.deleteMany({
        where: { id: sessionId },
      });
    }
  }

  async getUserSessions(userId: string) {
    return prisma.session.findMany({
      where: { userId },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async revokeSession(userId: string, sessionId: string) {
    await prisma.session.deleteMany({
      where: { id: sessionId, userId },
    });
  }
}

export const authService = new AuthService();
