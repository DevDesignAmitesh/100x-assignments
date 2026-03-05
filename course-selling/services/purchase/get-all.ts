import type { Request, Response } from "express";
import { prisma } from "../../db";
import { responsePlate } from "../../lib";

export const allUsersPurchasesService = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { page, limit } = req.query as unknown as {
    page: string;
    limit: string;
  };

  const purchases = await prisma.purchase.findMany({
    where: { userId },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return responsePlate({
    res,
    message: "purchases found",
    status: 200,
    data: { purchases },
  });
};
