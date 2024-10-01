import { NextFunction, Request, Response } from "express";
import { ApiError } from "./api-error";

export const asyncHanlder =
  (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      // TODO: REMOVE CONSOLE LOG LATER
      console.error(error);

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: error.success,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
