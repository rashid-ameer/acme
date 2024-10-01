import express from "express";

// importing routes
import postsRouter from "./routes/posts.routes";
import userRouter from "./routes/user.routes";
// create express app
const app = express();

// middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// defining routes
app.use("/posts", postsRouter);
app.use("/user", userRouter);

export { app };
