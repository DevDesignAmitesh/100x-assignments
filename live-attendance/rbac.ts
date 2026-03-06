// TODO: have to toggle it according to tests

import type { NextFunction, Request, Response } from "express";
import type { role } from "./generated/prisma/enums";

export const rbac = (role: role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        error: `Forbidden, ${role} access required`,
      });
    }
    next();
  };
};
