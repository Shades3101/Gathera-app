import type { Request, Response } from "express";
import { prismaClient } from "../db/client.js";
import { response } from "../utils/responseHandler.js";

export default async function getChats(req: Request, res: Response) {
    const roomId = req.params.roomId;

    if(!roomId) {
        return response(res, 400, "Invalid RoomId")
    }

    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy :{
            createdAt: "desc"
        },
        take: 50
    })

    return response(res, 200, "Chats Fetched Succesfully", messages)
}