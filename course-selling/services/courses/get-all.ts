import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const getAllCoursesService = async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany();

  return responsePlate({
    res,
    message: "courses found",
    status: 200,
    data: { courses },
  });
};
