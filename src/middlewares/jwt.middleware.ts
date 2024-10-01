import { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import jwt from "jsonwebtoken";
import { SRequest, SUser } from "../lib/types";
import { asyncHanlder } from "../lib/async-handler";

export const verifyJWT = asyncHanlder(
  (req: SRequest, _: Response, next: NextFunction) => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      );

      req.user = decodedToken as SUser;
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }
  }
);
