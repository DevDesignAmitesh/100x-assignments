import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate, zodErrorMessage } from "../../lib";
import { updateCourseSchema } from "../../validation";

export const updateOneCourseService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { success, data, error } = updateCourseSchema.safeParse({
    ...req.body,
    ...req.params,
  });

  if (!success) {
    return responsePlate({
      res,
      message: "invalid inputs",
      status: 403,
      data: zodErrorMessage({ error }),
    });
  }

  const { description, price, title, courseId } = data;

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

  await prisma.course.update({
    where: { id: course.id },
    data: {
      description,
      title,
      price,
    },
  });

  return responsePlate({
    res,
    message: "course updated",
    status: 201,
    data: { courseId },
  });
};
