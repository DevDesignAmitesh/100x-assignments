import type { Request, Response } from "express";
import { addStudentSchema } from "../../validation";
import { prisma } from "../../db";

export const addStudentService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { data, success, error } = addStudentSchema.safeParse({
    ...req.body,
    ...req.params,
  });

  if (!success) {
    console.log("zod error ", error);
    return res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
  }

  const { classId, studentId } = data;

  const [existingClass, student] = await Promise.all([
    prisma.class.findFirst({
      where: { id: classId, teacherId: userId },
    }),
    prisma.user.findFirst({
      where: { id: studentId, role: "student" },
    }),
  ]);

  if (!existingClass) {
    return res.status(404).json({
      success: false,
      error: "Class not found",
    });
  }

  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Student not found",
    });
  }

  const updatedClass = await prisma.class.update({
    where: { id: existingClass.id },
    data: {
      students: {
        connect: {
          id: student.id,
        },
      },
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
      _id: updatedClass.id,
      className: updatedClass.className,
      teacherId: updatedClass.teacherId,
      studentIds: updatedClass.students,
    },
  });
};
