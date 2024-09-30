import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/posts.controller";

// creating a router
const router = Router();

// defining the route
router.post("/create", createPost);
router.delete("/delete/:postId", deletePost);
router.patch("/update/:postId", updatePost);
router.get("/", getPosts);
router.get("/:postId", getPost);

// exporting the router
export default router;
