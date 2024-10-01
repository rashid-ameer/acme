import express from "express";
import cookieParser from "cookie-parser";

// importing routes
import postsRouter from "./routes/posts.routes";
import userRouter from "./routes/user.routes";
// create express app
const app = express();

// middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// defining routes
app.use("/user", userRouter);
app.use("/posts", postsRouter);

export { app };
