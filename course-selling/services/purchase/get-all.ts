import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const allUsersPurchasesService = async (req: Request, res: Response) => {
  const { userId } = req.user;

  const purchases = await prisma.purchase.findMany({
    where: { userId },
  });

  return responsePlate({
    res,
    message: "purchases found",
    status: 200,
    data: { purchases },
  });
};
