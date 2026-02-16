
import { Router } from "express";
import { getToken } from "../controllers/livekitController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { userLimiter } from "../middleware/RateLimiter.js";

export const LiveKitRouter = Router();

LiveKitRouter.get("/livekit/token", authMiddleware, userLimiter, getToken);
