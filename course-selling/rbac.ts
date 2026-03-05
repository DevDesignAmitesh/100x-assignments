import type { NextFunction, Request, Response } from "express";
import type { role } from "./generated/prisma/enums";
import { responsePlate } from "./lib";

export const rbac = (role: role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return responsePlate({
        res,
        message: "not allowed to access this route",
        status: 403,
      });
    }
    next();
  };
};
