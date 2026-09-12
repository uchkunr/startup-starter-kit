import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  getMeController,
  getSessionsController,
  loginController,
  logoutController,
  oauthLoginController,
  registerController,
  revokeSessionController,
  telegramLoginController,
} from "./auth.controller.js";
import {
  loginSchema,
  oauthSchema,
  registerSchema,
  telegramAuthSchema,
} from "./auth.schema.js";

export const authRouter = Router();

authRouter.post("/register", validate({ body: registerSchema }), registerController);
authRouter.post("/login", validate({ body: loginSchema }), loginController);
authRouter.post("/oauth", validate({ body: oauthSchema }), oauthLoginController);
authRouter.post(
  "/telegram",
  validate({ body: telegramAuthSchema }),
  telegramLoginController
);

// Authenticated routes
authRouter.use(requireAuth);
authRouter.get("/me", getMeController);
authRouter.post("/logout", logoutController);
authRouter.get("/sessions", getSessionsController);
authRouter.delete("/sessions/:id", revokeSessionController);
