import z, { ZodError } from "zod";
import { role, serviceType } from "./generated/prisma/enums";

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:MM (24h)");

export const zodErrorMessage = ({ error }: { error: ZodError }) => {
  return error.issues
    .map((er) => `${er.path.join(".")}: ${er.message}`)
    .join(", ");
};

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.enum(role),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const createServiceSchema = z.object({
  name: z.string(),
  type: z.enum(serviceType),
  durationInMinutes: z.enum(["30", "60", "90", "120"]),
});

export const getServiceSchema = z.object({
  type: z.enum(serviceType).optional(),
});

export const getSlotSchema = z.object({
  date: z.string(),
  serviceId: z.uuid(),
});

export const createAvailabilitySchema = z.object({
  daysOfWeek: z.enum(["0", "1", "2", "3", "4", "5", "6"]),
  startTime: timeSchema,
  endTime: timeSchema,
  serviceId: z.uuid(),
});
