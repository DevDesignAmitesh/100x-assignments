import type { Request, Response } from "express";
import { createClassSchema } from "../../validation";
import { prisma } from "../../db";

export const createClassService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { data, success, error } = createClassSchema.safeParse(req.body);

  if (!success) {
    console.log("zod error ", error);
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { className } = data;

  const createdClass = await prisma.class.create({
    data: {
      className,
      teacherId: userId,
    },
    include: {
      students: {
        select: {
          id: true,
        },
      },
    },
  });

  return res.status(201).json({
    success: true,
    data: {
      _id: createdClass.id,
      className: createdClass.className,
      teacherId: createdClass.teacherId,
      studentIds: createdClass.students,
    },
  });
};
