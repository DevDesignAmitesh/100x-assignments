import type { Request, Response } from "express";
import { createLessonSchema } from "../../validation";
import { responsePlate, zodErrorMessage } from "../../lib";
import { prisma } from "../../db";

export const createLessonService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { data, success, error } = createLessonSchema.safeParse(req.body);

  if (!success) {
    return responsePlate({
      res,
      message: "invalid inputs",
      status: 403,
      data: zodErrorMessage({ error }),
    });
  }

  const { content, courseId, title } = data;

  const course = await prisma.course.findFirst({
    where: { id: courseId, instructorId: userId },
  });

  if (!course) {
    return responsePlate({
      res,
      message: "course not found",
      status: 404,
    });
  }

  const lesson = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title,
      content,
    },
  });

  return responsePlate({
    res,
    message: "lesson created successfully",
    status: 200,
    data: {
      id: lesson.id
    }
  });
};
