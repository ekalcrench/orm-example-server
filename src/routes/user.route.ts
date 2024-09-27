import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/register", createUser);
userRouter.put("/update", updateUser);

export default userRouter;
