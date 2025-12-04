import { Router } from "express";
import getChats from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const chatRoute = Router()

chatRoute.get("/chats/:roomId", authMiddleware, getChats)