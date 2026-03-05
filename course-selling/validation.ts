import z from "zod";
import { role } from "./generated/prisma/enums";

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "password is too short"),
  name: z.string(),
  // TODO: if its correct or not
  role: z.enum(role),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "password is too short"),
});

export const createCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
});

export const createLessonSchema = z.object({
  title: z.string(),
  content: z.string(),
  courseId: z.uuid(),
});

export const purchaseCourseSchema = z.object({
  courseId: z.uuid(),
});
