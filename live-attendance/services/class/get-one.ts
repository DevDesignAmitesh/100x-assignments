import type { Request, Response } from "express";
import { getClassSchema } from "../../validation";
import { prisma } from "../../db";

export const getClassService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { success, data, error } = getClassSchema.safeParse(req.params);

  if (!success) {
    console.log("zod error ", error);
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { classId } = data;

  const existingClass = await prisma.class.findFirst({
    where: { id: classId, teacherId: userId },
    include: { students: true },
  });

  if (!existingClass) {
    return res.status(404).json({
      success: false,
      error: "Class not found",
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      _id: existingClass.id,
      className: existingClass.className,
      teacherId: existingClass.teacherId,
      students: existingClass.students,
    },
  });
};
