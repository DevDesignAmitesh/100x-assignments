import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const getOneCourseService = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const course = await prisma.course.findFirst({
    where: { id },
    include: { lessons: true, instructor: true }
  });

  if (!course) {
    return responsePlate({
      res,
      message: "course not found",
      status: 404,
    });
  }

  return responsePlate({
    res,
    message: "course found",
    status: 200,
    data: { course },
  });
};
