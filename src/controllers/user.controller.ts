import { CookieOptions, Request, Response } from "express";
import { asyncHanlder } from "../lib/async-handler";
import { ApiError } from "../lib/api-error";
import { User } from "../models/user.models";
import { ApiResponse } from "../lib/api-response";
import { generateAccessToken, generateRefreshToken } from "../lib/utils";
import { SRequest } from "../lib/types";

const register = asyncHanlder(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  //   checking required fields
  if (!username || !email || !password) {
    throw new ApiError(400, "Missing required field");
  }

  // check if the user already exist
  const foundUser = await User.findOne({ email });

  if (foundUser) {
    throw new ApiError(409, "User already exist");
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
    throw new ApiError(400, "Missing required fields");
  }

  // find the user
  const user = await User.findOne({ email });

  //   if user is not present
  if (!user) {
    throw new ApiError(401, "Incorrect email or password");
  }

  // check if password is valid
  const isPasswordValid = await user.isPasswordValid(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect email or password");
  }

  //   generate access token
  const accessToken = generateAccessToken(user.id, user.username, user.email);
  // generate refresh token
  const refreshToken = generateRefreshToken(user.id);

  //   store refresh token
  user.refreshToken = refreshToken;

  await user.save();

  const userDTO = {
    id: user.id,
    username: user.username,
    email: user.email,
    accessToken,
  };

  // cookie options
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.mode === "production",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(userDTO, "User logged in successfully"));
});

const logout = asyncHanlder(async (req: SRequest, res: Response) => {
  // check if the cookies has refresh token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(204);
  }

  // get the user
  const user = await User.findOne({ refreshToken });

  // cookie options
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.mode === "production",
  };

  if (!user) {
    res.clearCookie("refreshToken", cookieOptions);
    return res.sendStatus(204);
  }

  // clear the refresh token
  user.refreshToken = "";
  await user.save();

  res.clearCookie("refreshToken", cookieOptions);
  return res.sendStatus(204);
});

export { register, login, logout };
