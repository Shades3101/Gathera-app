import { Router } from "express";
import { Me } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const userRoute = Router();

userRoute.get("/me", authMiddleware, Me);