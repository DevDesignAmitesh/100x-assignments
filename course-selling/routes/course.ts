import { Router } from "express";
import { createCourseService } from "../services/courses/create";
import { authMiddleware } from "../auth-middleware";
import { rbac } from "../rbac";
import { getAllCoursesService } from "../services/courses/get-all";
import { getOneCourseService } from "../services/courses/get-one";
import { deleteOneCourseService } from "../services/courses/delete-one";

export const courseRouter = Router();

courseRouter.post(
  "/courses",
  authMiddleware,
  rbac("INSTRUCTOR"),
  createCourseService,
);
courseRouter.get("/courses", getAllCoursesService);
courseRouter.get("/courses/:id", getOneCourseService);
courseRouter.delete("/courses/:id", deleteOneCourseService);
