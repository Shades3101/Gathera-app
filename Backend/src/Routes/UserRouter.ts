import { Router } from "express";
import { Me } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { userLimiter } from "../middleware/RateLimiter.js";

export const userRoute = Router();

userRoute.get("/me", authMiddleware, userLimiter, Me);