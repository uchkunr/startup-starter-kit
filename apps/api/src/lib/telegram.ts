import crypto from "node:crypto";
import { env } from "../config/env.js";

export function verifyTelegramAuth(data: Record<string, unknown>): boolean {
  if (!env.TELEGRAM_BOT_TOKEN) {
    // In local dev without bot token, allow if hash is provided
    return Boolean(data.hash && data.id);
  }

  const { hash, ...rest } = data;
  if (!hash) return false;

  const checkString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(env.TELEGRAM_BOT_TOKEN).digest();

  const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

  return hmac === hash;
}
