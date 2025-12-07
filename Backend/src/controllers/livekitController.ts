
import { AccessToken } from 'livekit-server-sdk';
import type { Request, Response } from 'express';
import { prismaClient } from '../db/client.js';
import { response } from '../utils/responseHandler.js';

const createToken = async (roomName: string, participantName: string) => {
    // If this room doesn't exist, we'll return undefined
    // But the controller ensures the room exists in DB first.

    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: participantName,
            // Token valid for 1 hour? Let's make it configurable or standard.
            ttl: '1h',
        },
    );
    at.addGrant({ roomJoin: true, room: roomName });

    return await at.toJwt();
};

export const getToken = async (req: Request, res: Response) => {
    try {
        const { roomId, participantName } = req.query;

        if (!roomId || typeof roomId !== 'string') {
            return response(res, 400, "Missing or invalid roomId");
        }
        if (!participantName || typeof participantName !== 'string') {
            return response(res, 400, "Missing or invalid participantName");
        }

        const existingRoom = await prismaClient.room.findFirst({
            where: {
                id: roomId
            }
        });

        console.log(roomId)

        if (!existingRoom) {
            return response(res, 404, "Room not found in database. Cannot create LiveKit session.");
        }
        const token = await createToken(roomId, participantName);

        return response(res, 200, "Token generated", {
            token,
            serverUrl: process.env.LIVEKIT_URL
        });

    } catch (error) {
        console.error("Error generating LiveKit token:", error);
        return response(res, 500, "Internal Server Error during token generation");
    }
}
