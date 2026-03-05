import { Router } from "express";
import { signupService } from "../services/auth/signup";
import { loginService } from "../services/auth/login";

export const authRouter = Router();

authRouter.post("/signup", signupService);
authRouter.post("/login", loginService);
