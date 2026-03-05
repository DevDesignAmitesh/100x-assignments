import type { Request, Response } from "express";
import { loginSchema } from "../../validation";
import { responsePlate, zodErrorMessage } from "../../lib";
import { prisma } from "../../db";
import { generateToken } from "../../token";

export const loginService = async (req: Request, res: Response) => {
  const { success, data, error } = loginSchema.safeParse(req.body);

  if (!success) {
    return responsePlate({
      res,
      message: "invalid inputs",
      status: 403,
      data: zodErrorMessage({ error }),
    });
  }

  const { email, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    return responsePlate({
      res,
      message: "user not found, please signup",
      status: 404,
    });
  }

  const token = generateToken({
    role: existingUser.role,
    userId: existingUser.id,
  });

  return responsePlate({
    res,
    message: "login successfull",
    status: 200,
    data: { token },
  });
};
