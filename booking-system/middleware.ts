import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./token";
import type { role } from "./generated/prisma/enums";
import { resolve } from "bun";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "token not found",
      });
    }

    const bearerToken = token.split("Bearer ")[1];

    if (!bearerToken) {
      return res.status(401).json({
        message: "invalid format",
      });
    }

    const decoded = verifyToken(bearerToken);
    req.user = decoded;
    next();
  } catch (e) {
    console.log("error in auth middlware ", e);
    return res.status(401).json({
      message: "something went wronga",
    });
  }
};

export const rbac = (role: role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        message: `${req.user.role} is not authorized for this route`,
      });
    }
    next();
  };
};
