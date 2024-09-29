import { Router } from "express";

import {
  createPost,
  deletePostById,
  getAllPosts,
  getPostById,
  putPostById,
} from "../controllers/post.controller";

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.delete("/:id", deletePostById);
postRouter.put("/:id", putPostById);
postRouter.post("/create", createPost);

export default postRouter;
