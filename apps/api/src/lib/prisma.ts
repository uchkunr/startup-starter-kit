import path from "node:path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { env } from "../config/env.js";
import { PrismaClient } from "../generated/client/client.js";

function resolveDbUrl(rawUrl: string): string {
  if (rawUrl.startsWith("file:")) {
    const rawPath = rawUrl.replace("file:", "");
    const absolutePath = path.isAbsolute(rawPath)
      ? rawPath
      : path.resolve(process.cwd(), rawPath);
    return `file:${absolutePath}`;
  }
  return rawUrl;
}

const adapter = new PrismaLibSql({
  url: resolveDbUrl(env.DATABASE_URL),
});

declare global {
  // eslint-disable-next-line no-var
  var globalPrisma: PrismaClient | undefined;
}

export const prisma = globalThis.globalPrisma ?? new PrismaClient({ adapter });

if (env.NODE_ENV !== "production") {
  globalThis.globalPrisma = prisma;
}
