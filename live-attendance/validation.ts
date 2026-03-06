import z from "zod";
import { role } from "./generated/prisma/enums";

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6, "password is too short"),
  role: z.enum(role),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "password is too short"),
});

export const createClassSchema = z.object({
  className: z.string(),
});

export const addStudentSchema = z.object({
  studentId: z.uuid(),
  classId: z.uuid(),
});

export const getClassSchema = z.object({
  classId: z.uuid(),
});
