import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserData,
  updateUser,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/register", createUser);
userRouter.put("/update", updateUser);
userRouter.get("/profile", getUserData);

export default userRouter;
