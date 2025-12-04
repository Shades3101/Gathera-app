import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { response } from "../utils/responseHandler.js";
import dotenv from "dotenv"
dotenv.config()

export const secret = process.env.JWT_SECRET || "12345678bfdksjfkjsf";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies?.access_token;

    if (!token) {
        return response(res, 401, "Unauthorized: Token not found")
    }

    try {
        const vtoken = jwt.verify(token, secret) as JwtPayload;
        req.userId = vtoken.userId;
        next();
    } catch (error) {
        return response(res, 403, "Forbidden: Invalid or Expired Token")
    }
}