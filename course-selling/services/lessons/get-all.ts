import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const getAllLessonService = async (req: Request, res: Response) => {
  const { courseId } = req.params as { courseId: string };

  const lessons = await prisma.lesson.findMany({
    where: { courseId },
  });

  return responsePlate({
    res,
    message: "lessons found",
    status: 200,
    data: { lessons },
  });
};
