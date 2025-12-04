import type { Request, Response } from "express";
import { prismaClient } from "../db/client.js";
import { response } from "../utils/responseHandler.js";

export async function Me(req: Request, res: Response) {

    const userId = req.userId;

    if (!userId) {
        return response(res, 400, "Sign In or Sign Up First")
    }

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                photo: true
            }
        })

        if (!user) {
            return response(res, 404, "User Not Found")
        } else {
            return response(res, 200, "User Found Successfully", user)
        }

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}