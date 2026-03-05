import type { Request, Response } from "express";
import { signupSchema } from "../../validation";
import { responsePlate, zodErrorMessage } from "../../lib";
import { prisma } from "../../db";
import { hash } from "bcrypt";

export const signupService = async (req: Request, res: Response) => {
  const { data, success, error } = signupSchema.safeParse(req.body);

  if (!success) {
    return responsePlate({
      res,
      message: "invalid inputs",
      status: 403,
      data: zodErrorMessage({ error }),
    });
  }

  const { email, name, password, role } = data;

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return responsePlate({
      res,
      message: "user already exists with this email",
      status: 403,
    });
  }

  const hashedPassword = await hash(password, 4);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  });

  return responsePlate({
    res,
    message: "user registered successfully, kindly login",
    status: 200,
  });
};
