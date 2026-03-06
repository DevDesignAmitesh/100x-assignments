import express from "express";
import { authRouter } from "./routes/auth";
import { classRouter } from "./routes/class";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/class", classRouter);

app.listen(3000, () => {
  console.log("server is running at 3000");
});
