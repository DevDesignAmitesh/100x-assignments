import { Router } from "express";
import { createCourseService } from "../services/courses/create";
import { authMiddleware } from "../auth-middleware";
import { rbac } from "../rbac";
import { getAllCoursesService } from "../services/courses/get-all";
import { getOneCourseService } from "../services/courses/get-one";
import { deleteOneCourseService } from "../services/courses/delete-one";
import { updateOneCourseService } from "../services/courses/update-one";
import { getOneCourseStatsService } from "../services/courses/get-one-stats";

export const courseRouter = Router();

courseRouter.post("/", authMiddleware, rbac("INSTRUCTOR"), createCourseService);
courseRouter.get("/", getAllCoursesService);
courseRouter.get("/:id", getOneCourseService);
courseRouter.get("/:id/stats", getOneCourseStatsService);
courseRouter.patch(
  "/:id",
  authMiddleware,
  rbac("INSTRUCTOR"),
  updateOneCourseService,
);
courseRouter.delete(
  "/:id",
  authMiddleware,
  rbac("INSTRUCTOR"),
  deleteOneCourseService,
);
