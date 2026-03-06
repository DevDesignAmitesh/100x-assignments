import type { Request, Response } from "express";
import { signupSchema } from "../../validation";
import { prisma } from "../../db";
import { hash } from "bcrypt";

export const signupService = async (req: Request, res: Response) => {
  const { success, data, error } = signupSchema.safeParse(req.body);

  if (!success) {
    console.log("zod error ", error);
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { email, name, password, role } = data;

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "Email already exists",
    });
  }

  const hashedPassword = await hash(password, 4);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  });

  return res.status(201).json({
    success: true,
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
