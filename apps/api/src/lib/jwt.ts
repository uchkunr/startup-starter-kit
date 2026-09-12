import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export interface AuthJwtPayload {
  userId: string;
  email: string;
  username?: string | null;
  role: string;
  sessionId?: string;
}

export async function signAccessToken(payload: AuthJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secret);
}

export async function verifyAccessToken(token: string): Promise<AuthJwtPayload> {
  const { payload } = await jwtVerify(token, secret);
  return {
    userId: payload.userId as string,
    email: payload.email as string,
    username: payload.username as string | undefined,
    role: payload.role as string,
    sessionId: payload.sessionId as string | undefined,
  };
}
