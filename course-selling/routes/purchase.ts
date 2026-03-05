import { Router } from "express";
import { authMiddleware } from "../auth-middleware";
import { rbac } from "../rbac";
import { purchaseService } from "../services/purchase/purchase";
import { allUsersPurchasesService } from "../services/purchase/get-all";

export const purchaseRouter = Router();

purchaseRouter.use(authMiddleware, rbac("STUDENT"));

purchaseRouter.post("/", purchaseService);
purchaseRouter.get("/users/purchases", allUsersPurchasesService);
