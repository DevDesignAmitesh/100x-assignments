import type { Request, Response } from "express";
import { createCourseSchema } from "../../validation";
import { responsePlate, zodErrorMessage } from "../../lib";
import { prisma } from "../../db";

export const createCourseService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { data, success, error } = createCourseSchema.safeParse(req.body);

  if (!success) {
    return responsePlate({
      res,
      message: "invalid inputs",
      status: 401,
      data: zodErrorMessage({ error }),
    });
  }

  const { description, price, title } = data;

  await prisma.course.create({
    data: {
      title,
      description,
      price,
      instructorId: userId,
    },
  });

  return responsePlate({
    res,
    message: "course created",
    status: 201,
  });
};
