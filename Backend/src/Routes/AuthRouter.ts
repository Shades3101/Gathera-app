import { Router } from "express";
import { SignIn, SignUp, WsToken, GoogleLogin, refreshToken } from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { generalLimiter, loginLimiter, userLimiter } from "../middleware/RateLimiter.js";

export const authRoute = Router();

authRoute.post("/signup", generalLimiter, SignUp);
authRoute.post("/signin", loginLimiter, SignIn);
authRoute.post("/google-login", generalLimiter, GoogleLogin);
authRoute.get("/ws-token", authMiddleware, userLimiter, WsToken)
authRoute.post("/refresh-token", generalLimiter, refreshToken)

