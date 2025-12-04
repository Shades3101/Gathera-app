import type { Request, Response } from "express";
import { response } from "../utils/responseHandler.js";

import { RoomSchema } from "../types/type.js";
import { prismaClient } from "../db/client.js";

export default async function CreateRoom(req: Request, res: Response) {

    const parsedData = RoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        return response(res, 400, "Invalid Room Inputs")
    }

    const userId = req.userId;
    if (!userId) {
        return response(res, 404, "Please Provide UserId");
    }


    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.slug,
                hostId: userId
            }
        })

        return response(res, 200, "Room Successfully Create", room.id)

    } catch (error) {
        console.log(error);
        return response(res, 411, "Room Already Exists")
    }


}

export async function userRooms(req: Request, res: Response) {

    const userId = req.userId
    if (!userId) {
        return response(res, 400, "Unauthorized Fetching of Rooms")
    }

    try {
        const rooms = await prismaClient.room.findMany({
            where: {
                hostId: userId
            }
        })
        return response(res, 200, "Finding Rooms Successfull", rooms);

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export async function getAllRoom(req: Request, res: Response) {

    try {

        const allRooms = await prismaClient.room.findMany();

        return response(res, 200, "All Rooms Fetched Successfully", allRooms)

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }

}

export async function getRoomId(req: Request, res: Response) {

    const slug = req.params.slug

    if (!slug) {
        return response(res, 404, "Slug is Required")
    }

    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    })

    return response(res, 200, "Room Fetched Successfully", room)
}

export async function deleteRoom(req: Request, res: Response) {
    const roomId = req.body.id;

    try {
        await prismaClient.room.delete({
            where: {
                id: roomId
            }
        })

        return response(res, 200, "Room Deleted Successfully")
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}