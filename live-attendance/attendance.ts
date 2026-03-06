import type { ActiveSession } from "./types";

class Attendance {
  private static instance: Attendance;
  public activeSession: ActiveSession | null;

  constructor() {
    this.activeSession = null;
  }

  getInstance(): Attendance {
    if (!Attendance.instance) {
      Attendance.instance = new Attendance();
    }
    return Attendance.instance;
  }

  start(classId: string, startedAt: string) {
    this.activeSession = {
      classId,
      startedAt,
      attendance: {},
    };
  }
}

export const attendance = new Attendance().getInstance();
