import type { Request, Response } from "express";
import { prisma } from "../../db";

export const getStudentsService = async (req: Request, res: Response) => {
  const students = await prisma.user.findMany({
    where: {
      role: "student",
    },
  });

  return res.status(200).json({
    success: true,
    data: students,
  });
};
