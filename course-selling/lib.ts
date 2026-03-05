import type { Response } from "express";
import type { ZodError } from "zod";

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

export const zodErrorMessage = ({ error }: { error: ZodError }) => {
  return error.issues
    .map((er) => `${er.path.join(".")}: ${er.message}`)
    .join(", ");
};
