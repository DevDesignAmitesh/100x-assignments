import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const meService = async (req: Request, res: Response) => {
  const { userId } = req.user;

  const user = await prisma.user.findFirst({
    where: { id: userId }
  });

  if (!user) {
    return responsePlate({
      res,
      message: "user not found",
      status: 404
    })
  }

  return responsePlate({
    res,
    message: "user found",
    status: 200,
    data: { user }
  })
}