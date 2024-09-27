import express from "express";
import cors from "cors";

import userRouter from "./routes/user.route";
import sessionRouter from "./routes/session.route";
import postRouter from "./routes/post.route";

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS for all origins (not recommended for production)
app.use(cors());

app.use(express.json());

app.use("/users", userRouter);
app.use("/auth", sessionRouter);
app.use("/posts", postRouter);

app.listen(port, () => {
  console.log("App listening in this port : ", port);
});
