import type { WebSocket } from "ws";
import type { attendanceStatus, role } from "./generated/prisma/enums";

export type TokenPayload = {
  userId: string;
  role: role;
};

export type ExtendedWs = WebSocket & {
  user: TokenPayload;
};

export type ActiveSession = {
  classId: string;
  startedAt: string;
  attendance: Record<string, attendanceStatus>;
};
