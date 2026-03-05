import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const getAllCoursesService = async (req: Request, res: Response) => {
  // const { page, limit } = req.query as unknown as {
  //   page: string;
  //   limit: string;
  // };

  // const courses = await prisma.course.findMany({
  //   skip: (Number(page) - 1) * Number(limit),
  //   take: Number(limit),
  // });

  const courses = await prisma.course.findMany();

  return responsePlate({
    res,
    message: "courses found",
    status: 200,
    data: { courses },
  });
};
