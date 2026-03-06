import type { Request, Response } from "express";
import { prisma } from "../../db";

export const meService = async (req: Request, res: Response) => {
  const { userId, role } = req.user;

  const user = await prisma.user.findFirst({
    where: { id: userId, role },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
