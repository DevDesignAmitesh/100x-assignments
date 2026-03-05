import type { Request, Response } from "express";
import { purchaseCourseSchema } from "../../validation";
import { responsePlate, zodErrorMessage } from "../../lib";
import { prisma } from "../../db";

export const purchaseService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { success, data, error } = purchaseCourseSchema.safeParse(req.params);

  if (!success) {
    return responsePlate({
      res,
      message: "invalid inputs",
      status: 403,
      data: zodErrorMessage({ error }),
    });
  }

  const { courseId } = data;

  const course = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!course) {
    return responsePlate({
      res,
      message: "course not found",
      status: 404,
    });
  }

  await prisma.purchase.create({
    data: {
      courseId: course.id,
      userId,
    },
  });

  return responsePlate({
    res,
    message: "course purchased",
    status: 201,
  });
};
