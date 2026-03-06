import { Router } from "express";
import { authMiddleware } from "../auth-middleware";
import { rbac } from "../rbac";
import { createClassService } from "../services/class/create-one";
import { addStudentService } from "../services/class/add-student";
import { getClassService } from "../services/class/get-one";
import { getAttendanceService } from "../services/class/get-attendance";

export const classRouter = Router();

classRouter.post("/", authMiddleware, rbac("teacher"), createClassService);
classRouter.post(
  "/:id/add-student",
  authMiddleware,
  rbac("teacher"),
  addStudentService,
);
classRouter.get("/:id", authMiddleware, rbac("teacher"), getClassService);
classRouter.get(
  "/:id/my-attendance",
  authMiddleware,
  rbac("student"),
  getAttendanceService,
);
