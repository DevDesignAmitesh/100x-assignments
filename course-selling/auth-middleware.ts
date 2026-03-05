import type { NextFunction, Request, Response } from "express";
import { responsePlate } from "./lib";
import { verifyToken } from "./token";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    return responsePlate({
      res,
      message: "token not found",
      status: 401,
    });
  }

  const bearerToken = token.split("Bearer ")[1];

  if (!bearerToken) {
    return responsePlate({
      res,
      message: "invalid token format",
      status: 401,
    });
  }

  let payload;

  try {
    payload = verifyToken(bearerToken);
  } catch (e) {
    console.log("error while token verification ", e);
    return responsePlate({
      res,
      message: "invalid/expired token",
      status: 401,
    });
  }

  req.user = payload;
  next();
};
