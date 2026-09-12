import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { AppError } from "./error.middleware.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("Authentication required. Please provide a Bearer token.", 401));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired access token.", 401));
  }
}
