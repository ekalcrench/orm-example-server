import { Router } from "express";

import {
  createSession,
  removeSession,
} from "../controllers/session.controller";

const sessionRouter = Router();

sessionRouter.post("/login", createSession);
sessionRouter.post("/logout", removeSession);

export default sessionRouter;
