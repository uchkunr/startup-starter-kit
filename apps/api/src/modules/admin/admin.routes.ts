import { Router } from "express";
import { requireAdmin } from "../../middlewares/admin.middleware.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createUserController,
  deleteUserController,
  getSessionsController,
  getUserByIdController,
  getUsersController,
  revokeSessionController,
  revokeUserSessionsController,
  updateUserController,
} from "./admin.controller.js";
import {
  createUserSchema,
  listSessionsQuerySchema,
  listUsersQuerySchema,
  updateUserSchema,
} from "./admin.schema.js";

export const adminRouter = Router();

// Secure all admin routes with requireAuth & requireAdmin
adminRouter.use(requireAuth, requireAdmin);

// User CRUD
adminRouter.get("/users", validate({ query: listUsersQuerySchema }), getUsersController);
adminRouter.post("/users", validate({ body: createUserSchema }), createUserController);
adminRouter.get("/users/:id", getUserByIdController);
adminRouter.patch(
  "/users/:id",
  validate({ body: updateUserSchema }),
  updateUserController
);
adminRouter.delete("/users/:id", deleteUserController);

// Sessions Management
adminRouter.get(
  "/sessions",
  validate({ query: listSessionsQuerySchema }),
  getSessionsController
);
adminRouter.delete("/sessions/:id", revokeSessionController);
adminRouter.delete("/users/:userId/sessions", revokeUserSessionsController);
