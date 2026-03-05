import { Router } from "express";
import { signupService } from "../services/auth/signup";
import { loginService } from "../services/auth/login";
import { meService } from "../services/auth/me";
import { authMiddleware } from "../auth-middleware";

export const authRouter = Router();

authRouter.post("/signup", signupService);
authRouter.post("/login", loginService);
authRouter.get("/me", authMiddleware, meService);
