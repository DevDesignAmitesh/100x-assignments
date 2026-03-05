import { sign, verify } from "jsonwebtoken";
import type { TokenPayload } from "./types";

const secret = process.env.JWT_SECRET!;

export const verifyToken = (token: string) => {
  return verify(token, secret) as TokenPayload;
};

export const generateToken = (payload: TokenPayload) => {
  return sign(payload, secret);
};
