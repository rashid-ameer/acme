import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/posts.controller";
import { verifyJWT } from "../middlewares/jwt.middleware";

// creating a router
const router = Router();

// protected routes
// middleware for authorization
router.use(verifyJWT);
// middleware for authorization
router.post("/create", createPost);
router.delete("/delete/:postId", deletePost);
router.patch("/update/:postId", updatePost);
router.get("/", getPosts);
router.get("/:postId", getPost);

// exporting the router
export default router;
