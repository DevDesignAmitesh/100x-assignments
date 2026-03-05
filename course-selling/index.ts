import express from "express";
import { authRouter } from "./routes/auth";
import { courseRouter } from "./routes/course";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/course", courseRouter);
