import { Request, Response } from "express";
import { asyncHanlder } from "../lib/async-handler";
import { ApiError } from "../lib/api-error";
import { User } from "../models/user.models";
import { ApiResponse } from "../lib/api-response";

const register = asyncHanlder(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  //   checking required fields
  if (!username || !email || !password) {
    throw new ApiError(401, "Missing required field");
  }

  // check if the user already exist
  const foundUser = await User.findOne({ email });

  if (foundUser) {
    throw new ApiError(401, "User already exist");
  }

  // creating new user
  const newUser = await User.create({ username, email, password });

  // if the user is not created
  if (!newUser) {
    throw new ApiError(500, "Error in creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(null, "User created successfully"));
});

const login = asyncHanlder(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //   if all fields are present
  if (!email || !password) {
    throw new ApiError(401, "Missing required fields");
  }

  // find the user
  const user = await User.findOne({ email });

  //   if user is not present
  if (!user) {
    throw new ApiError(404, "Incorrect email or password");
  }

  // check if password is valid
  const isPasswordValid = await user.isPasswordValid(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect email or password");
  }

  const userDTO = {
    username: user.username,
    email: user.email,
  };

  return res
    .status(200)
    .json(new ApiResponse(userDTO, "User logged in successfully"));
});

export { register, login };
