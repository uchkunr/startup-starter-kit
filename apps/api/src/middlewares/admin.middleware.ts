import type { NextFunction, Request, Response } from "express";
import { AppError } from "./error.middleware.js";

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== "ADMIN") {
    next(new AppError("Forbidden: Admin access required", 403));
    return;
  }
  next();
}
