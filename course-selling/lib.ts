import type { Response } from "express";

export const responsePlate = ({
  res,
  message,
  data,
  status,
}: {
  res: Response;
  message: string;
  data?: any;
  status: number;
}) => {
  return res.status(status).json({
    data,
    message,
  });
};
