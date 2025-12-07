
import { Router } from "express";
import { getToken } from "../controllers/livekitController.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const LiveKitRouter = Router();

LiveKitRouter.get("/livekit/token", authMiddleware, getToken);
