import z from "zod";
import { role } from "./generated/prisma/enums";

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6, "password is too short"),
  role: z.enum(role)
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "password is too short"),
})