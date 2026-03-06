import express from "express";
import { authRouter } from "./routes/auth";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("server is running at 3000");
});
