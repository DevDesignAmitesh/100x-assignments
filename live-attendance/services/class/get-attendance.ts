import type { Request, Response } from "express";
import { getClassSchema } from "../../validation";
import { prisma } from "../../db";

export const getAttendanceService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { data, success, error } = getClassSchema.safeParse(req.params);

  if (!success) {
    console.log("zod error ", error);
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { classId } = data;

  const attendance = await prisma.attendance.findFirst({
    where: { classId, studentId: userId },
  });

  if (!attendance) {
    return res.status(200).json({
      success: true,
      data: {
        classId,
        status: null,
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      classId: attendance.classId,
      status: attendance.status,
    },
  });
};
