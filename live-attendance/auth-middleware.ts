import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./token";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  // const bearerToken = token.split("Bearer ")[1];

  // if (!bearerToken) {
  //   return res.status(401).json({
  //     success: false,
  //     error: "Unauthorized, token missing or invalid",
  //   });
  // }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (e) {
    console.log("error while verifying token ", e);
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  req.user = decoded;
  next();
};
