import { Router } from "express";
import { signupService } from "../services/auth/signup";
import { loginService } from "../services/auth/login";
import { authMiddleware } from "../auth-middleware";
import { meService } from "../services/auth/me";

export const authRouter = Router();

authRouter.post("/signup", signupService);
authRouter.post("/login", loginService);
authRouter.post("/me", authMiddleware, meService);
