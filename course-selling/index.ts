import express from "express";
import { authRouter } from "./routes/auth";
import { courseRouter } from "./routes/course";
import { lessonRouter } from "./routes/lesson";
import { purchaseRouter } from "./routes/purchase";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/purchases", purchaseRouter);

app.listen(3000, () => {
  console.log("port is running at 3000");
});
