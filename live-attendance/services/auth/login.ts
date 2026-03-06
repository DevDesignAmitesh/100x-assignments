import type { Request, Response } from "express";
import { loginSchema } from "../../validation";
import { prisma } from "../../db";
import { compare } from "bcrypt";
import { generateToken } from "../../token";

export const loginService = async (req: Request, res: Response) => {
  const { data, success, error } = loginSchema.safeParse(req.body);

  if (!success) {
    console.log("zod error ", error);
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { email, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    return res.status(400).json({
      success: false,
      error: "User not found",
    });
  }

  const isPasswordRight = await compare(password, existingUser.password);

  if (!isPasswordRight) {
    return res.status(400).json({
      success: false,
      error: "Invalid email or password",
    });
  }

  const token = generateToken({
    userId: existingUser.id,
    role: existingUser.role,
  });

  return res.status(200).json({
    success: true,
    data: {
      token,
    },
  });
};
