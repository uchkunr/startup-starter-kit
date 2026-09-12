import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getAllUsersController, getUserByIdController } from "./user.controller.js";

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get("/", getAllUsersController);
userRouter.get("/:id", getUserByIdController);
