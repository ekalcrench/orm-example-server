import { Router } from "express";

import { createSession } from "../controllers/session.controller";

const sessionRouter = Router();

sessionRouter.post("/login", createSession);

export default sessionRouter;
