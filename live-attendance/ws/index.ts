import { WebSocketServer } from "ws";
import type { ExtendedWs } from "../types";
import { verifyToken } from "../token";
import { attendance } from "../attendance";
import { prisma } from "../db";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (ws: ExtendedWs, req) => {
  const token = req.url?.split("token=")[1];

  if (!token) {
    ws.send(
      JSON.stringify({
        event: "ERROR",
        data: {
          message: "Unauthorized or invalid token",
        },
      }),
    );
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    ws.send(
      JSON.stringify({
        event: "ERROR",
        data: {
          message: "Unauthorized or invalid token",
        },
      }),
    );
    return;
  }

  ws.user = decoded;

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data.toString());

    if (parsedData.event === "ATTENDANCE_MARKED") {
      const { studentId, status } = parsedData.data;

      if (ws.user.role !== "teacher") {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: {
              message: "Forbidden, teacher event only",
            },
          }),
        );
        return;
      }

      if (!attendance.activeSession) {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: {
              message: "No active attendance session",
            },
          }),
        );
        return;
      }

      attendance.activeSession.attendance[studentId] = status;

      server.clients.forEach((ws) => {
        ws.send(
          JSON.stringify({
            event: "ATTENDANCE_MARKED",
            data: {
              studentId,
              status,
            },
          }),
        );
      });
    }

    if (parsedData.event === "TODAY_SUMMARY") {
      if (ws.user.role !== "teacher") {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: {
              message: "Forbidden, teacher event only",
            },
          }),
        );
        return;
      }

      if (!attendance.activeSession) {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: {
              message: "No active attendance session",
            },
          }),
        );
        return;
      }

      let present = 0,
        absent = 0,
        total = 0;

      for (const [studentId, attendanceStatus] of Object.entries(
        attendance.activeSession.attendance,
      )) {
        if (attendanceStatus === "absent") {
          absent += 1;
        } else if (attendanceStatus === "present") {
          present += 1;
        }
        total += 1;
      }

      server.clients.forEach((ws) => {
        ws.send(
          JSON.stringify({
            event: "TODAY_SUMMARY",
            data: {
              present,
              absent,
              total,
            },
          }),
        );
      });
    }

    if (parsedData.event === "MY_ATTENDANCE") {
      if (ws.user.role !== "student") {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: {
              message: "Forbidden, student event only",
            },
          }),
        );
        return;
      }

      if (!attendance.activeSession) {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: {
              message: "No active attendance session",
            },
          }),
        );
        return;
      }

      const attendanceStatus =
        attendance.activeSession.attendance[ws.user.userId];

      ws.send(
        JSON.stringify({
          event: "MY_ATTENDANCE",
          data: {
            status: attendanceStatus ? attendanceStatus : "not yet updated",
          },
        }),
      );
    }

    if (parsedData.event === "DONE") {
      if (ws.user.role !== "teacher") {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: {
              message: "Forbidden, teacher event only",
            },
          }),
        );
        return;
      }

      if (!attendance.activeSession) {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: {
              message: "No active attendance session",
            },
          }),
        );
        return;
      }

      const activeClass = await prisma.class.findMany({
        where: { id: attendance.activeSession.classId },
        include: {
          students: true,
        },
      });
    }
  });
});
