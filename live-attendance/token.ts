import { sign, verify } from "jsonwebtoken";
import type { TokenPayload } from "./types";

const secret = process.env.JWT_SECRET!;

export const generateToken = (payload: TokenPayload) => {
  return sign(payload, secret);
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
};
