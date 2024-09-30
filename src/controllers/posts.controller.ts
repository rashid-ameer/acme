import { NextFunction, Request, Response } from "express";
import { asyncHanlder } from "../lib/async-handler";
import { Posts } from "../models/posts.models";
import { ApiResponse } from "../lib/api-response";
import { ApiError } from "../lib/api-error";

// creating a post
const createPost = asyncHanlder(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  const post = await Posts.create({
    title,
    content,
  });

  if (!post) {
    throw new ApiError(500, "Post not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(post, "Post created successfully"));
});

// deleting a post
const deletePost = asyncHanlder(async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!postId.trim()) {
    throw new ApiError(400, "Post id is required");
  }

  await Posts.deleteOne({ _id: postId });

  return res.status(204).send();
});

// updating a post
const updatePost = asyncHanlder(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  if (!postId.trim()) {
    throw new ApiError(400, "Post id is required");
  }

  // find the post
  const post = await Posts.findById({ _id: postId });

  // if post does not exists
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // update the post
  post.title = title || post.title;
  post.content = content || post.content;

  // saving the post
  const newPost = await post.save();

  return res
    .status(200)
    .json(new ApiResponse(newPost, "Post updated successfully"));
});

// get all posts
const getPosts = asyncHanlder(async (req: Request, res: Response) => {
  const posts = await Posts.find().sort({ createdAt: -1 }).exec();

  return res
    .status(200)
    .json(new ApiResponse(posts, "Posts fetched successfully"));
});

export { createPost, deletePost, updatePost, getPosts };
