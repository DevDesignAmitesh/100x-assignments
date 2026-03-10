import { sign, verify } from "jsonwebtoken";
import type { TokenPayload } from "./types";

export const generateToken = (payload: TokenPayload) => {
  return sign(payload, process.env.JWT_SECRET!);
};

export const verifyToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET!) as TokenPayload
};
