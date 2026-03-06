import type { Request, Response } from "express";
import { getClassSchema } from "../../validation";
import { prisma } from "../../db";
import { attendance } from "../../attendance";

export const startClassService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { data, success, error } = getClassSchema.safeParse(req.body);

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
  });

  if (!existingClass) {
    return res.status(404).json({
      success: false,
      error: "Class not found",
    });
  }

  const startedAt = new Date().toISOString();

  await prisma.class.update({
    where: { id: existingClass.id },
    data: { startedAt },
  });

  attendance.start(classId, startedAt);

  return res.status(200).json({
    success: true,
    data: {
      classId,
      startedAt,
    },
  });
};
