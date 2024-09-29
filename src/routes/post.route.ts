import { Router } from "express";

import {
  createPost,
  getAllPosts,
  getPostById,
} from "../controllers/post.controller";

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.post("/create", createPost);

export default postRouter;
