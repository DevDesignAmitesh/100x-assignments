import { Router } from "express";
import { authMiddleware } from "../auth-middleware";
import { rbac } from "../rbac";
import { createLessonService } from "../services/lessons/create";
import { getAllLessonService } from "../services/lessons/get-all";

export const lessonRouter = Router();

lessonRouter.post(
  "/",
  authMiddleware,
  rbac("INSTRUCTOR"),
  createLessonService,
);

lessonRouter.get(
  "/:courseId/lessons",
  getAllLessonService,
);
