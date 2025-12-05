import { Router } from "express";
import { SignIn, SignUp, WsToken } from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const authRoute = Router();

authRoute.post("/signup", SignUp);
authRoute.post("/signin", SignIn);
authRoute.get("/ws-token", authMiddleware, WsToken)

