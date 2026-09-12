import type {
  SessionWhereInput,
  UserUpdateInput,
  UserWhereInput,
} from "../../generated/client/models.js";
import { hashPassword } from "../../lib/hash.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middlewares/error.middleware.js";
import type {
  CreateUserInput,
  ListSessionsQuery,
  ListUsersQuery,
  UpdateUserInput,
} from "./admin.schema.js";

export class AdminService {
  async getUsers(query: ListUsersQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: UserWhereInput = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { email: { contains: query.search } },
        { username: { contains: query.search } },
        { name: { contains: query.search } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          avatar: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          accounts: {
            select: {
              id: true,
              provider: true,
              createdAt: true,
            },
          },
          _count: {
            select: { sessions: true },
          },
        },
      }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        accounts: true,
        sessions: {
          select: {
            id: true,
            ipAddress: true,
            userAgent: true,
            expiresAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async createUser(input: CreateUserInput) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingEmail) {
      throw new AppError("Email already in use", 409);
    }

    if (input.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: input.username },
      });
      if (existingUsername) {
        throw new AppError("Username already in use", 409);
      }
    }

    const passwordHash = await hashPassword(input.password);

    return prisma.user.create({
      data: {
        email: input.email,
        username: input.username || null,
        name: input.name || null,
        passwordHash,
        role: input.role || "USER",
        status: input.status || "ACTIVE",
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async updateUser(id: string, input: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (input.email && input.email !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existingEmail) {
        throw new AppError("Email already in use", 409);
      }
    }

    if (input.username && input.username !== user.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: input.username },
      });
      if (existingUsername) {
        throw new AppError("Username already in use", 409);
      }
    }

    const data: UserUpdateInput = {};
    if (input.email !== undefined) data.email = input.email;
    if (input.username !== undefined) data.username = input.username;
    if (input.name !== undefined) data.name = input.name;
    if (input.role !== undefined) data.role = input.role;
    if (input.status !== undefined) data.status = input.status;
    if (input.password) {
      data.passwordHash = await hashPassword(input.password);
    }

    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await prisma.user.delete({ where: { id } });
    return { success: true };
  }

  async getSessions(query: ListSessionsQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: SessionWhereInput = {};
    if (query.userId) {
      where.userId = query.userId;
    }

    const [total, sessions] = await Promise.all([
      prisma.session.count({ where }),
      prisma.session.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          userId: true,
          ipAddress: true,
          userAgent: true,
          expiresAt: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              name: true,
              avatar: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async revokeSession(sessionId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new AppError("Session not found", 404);
    }

    await prisma.session.delete({ where: { id: sessionId } });
    return { success: true };
  }

  async revokeAllUserSessions(userId: string) {
    await prisma.session.deleteMany({ where: { userId } });
    return { success: true };
  }
}

export const adminService = new AdminService();
