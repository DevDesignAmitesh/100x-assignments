import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const getOneCourseStatsService = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const course = await prisma.course.findFirst({
    where: { id },
    include: { lessons: true, instructor: true, purchases: true },
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
    message: "course stats found",
    status: 200,
    data: {
      total_purchases: course.purchases.length,
      total_revenue: 0,
      course_price: course.price,
    },
  });
};
