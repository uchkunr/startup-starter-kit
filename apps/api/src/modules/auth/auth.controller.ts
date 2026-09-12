import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error.middleware.js";
import { authService } from "./auth.service.js";

function getMeta(req: Request) {
  return {
    ipAddress:
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "127.0.0.1",
    userAgent: req.headers["user-agent"] || "unknown",
  };
}

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.register(req.body, getMeta(req));
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.login(req.body, getMeta(req));
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function oauthLoginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.loginOAuth(req.body, getMeta(req));
    res.status(200).json({
      success: true,
      message: `${req.body.provider} authentication successful`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function telegramLoginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.loginTelegram(req.body, getMeta(req));
    res.status(200).json({
      success: true,
      message: "Telegram authentication successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", 401);
    }
    const user = await authService.getMe(req.user.userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await authService.logout(req.user?.sessionId);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getSessionsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", 401);
    }
    const sessions = await authService.getUserSessions(req.user.userId);
    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
}

export async function revokeSessionController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!sessionId || !req.user?.userId) {
      throw new AppError("Invalid session", 400);
    }
    await authService.revokeSession(req.user.userId, sessionId);
    res.status(200).json({
      success: true,
      message: "Session revoked",
    });
  } catch (error) {
    next(error);
  }
}
