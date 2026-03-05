import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const deleteOneCourseService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id } = req.params as { id: string };

  const course = await prisma.course.findFirst({
    where: { id, instructorId: userId  },
  });

  if (!course) {
    return responsePlate({
      res,
      message: "course not found",
      status: 404,
    });
  }

  await prisma.course.delete({
    where: { id },
  });

  return responsePlate({
    res,
    message: "course deleted",
    status: 200,
  });
};
