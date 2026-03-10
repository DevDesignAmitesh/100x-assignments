import type { role } from "./generated/prisma/enums";

export type TokenPayload = {
  userId: string;
  role: role
}