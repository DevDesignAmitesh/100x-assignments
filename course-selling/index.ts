import express from "express";
import { authRouter } from "./routes/auth";
import { courseRouter } from "./routes/course";
import { lessonRouter } from "./routes/lesson";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/lesson", lessonRouter);
