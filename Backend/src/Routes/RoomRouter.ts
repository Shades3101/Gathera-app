import { Router } from "express";
import CreateRoom, { deleteRoom, getAllRoom, getRoomId, userRooms } from "../controllers/roomController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { generalLimiter, userLimiter } from "../middleware/RateLimiter.js";

export const RoomRoute = Router();

RoomRoute.post("/create-room", authMiddleware, userLimiter, CreateRoom);
RoomRoute.get("/user-room", authMiddleware, userLimiter, userRooms)
RoomRoute.get("/all-rooms", generalLimiter, getAllRoom)
RoomRoute.get("/room/:slug", generalLimiter, getRoomId)
RoomRoute.delete("/delete-Room", authMiddleware, userLimiter, deleteRoom)