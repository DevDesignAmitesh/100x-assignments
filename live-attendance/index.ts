import express from "express";
import { authRouter } from "./routes/auth";
import { classRouter } from "./routes/class";
import { authMiddleware } from "./auth-middleware";
import { rbac } from "./rbac";
import { getStudentsService } from "./services/extra/get-students";
import { startClassService } from "./services/extra/start-class";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/class", classRouter);
app.get("/students", authMiddleware, rbac("teacher"), getStudentsService)
app.get("/attendance/start", authMiddleware, rbac("teacher"), startClassService)

app.listen(3000, () => {
  console.log("server is running at 3000");
});
