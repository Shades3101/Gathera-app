
import { AccessToken } from 'livekit-server-sdk';
import type { Request, Response } from 'express';
import { prismaClient } from '../db/client.js';
import { response } from '../utils/responseHandler.js';



export const getToken = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.query;
        const userId = req.userId; 

        if (!roomId || typeof roomId !== 'string') {
            return response(res, 400, "Missing or invalid roomId");
        }

        if (!userId) {
            return response(res, 401, "Unauthorized");
        }

        const existingRoom = await prismaClient.room.findFirst({
            where: {
                id: roomId
            }
        });

        if (!existingRoom) {
            return response(res, 404, "Room not found in database. Cannot create LiveKit session.");
        }

        await prismaClient.roomMember.upsert({
            where: {
                userId_roomId: {
                    userId: userId,
                    roomId: roomId
                }
            },
            create: {
                userId: userId,
                roomId: roomId
            },
            update: {}
        })

        // Reduce TTL to 2 hours for better security
        const at = new AccessToken(
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET,
            {
                identity: userId,
                ttl: '2h',
            },
        );
        at.addGrant({ 
            roomJoin: true, 
            room: roomId 
        });
        
        const token = await at.toJwt();

        return response(res, 200, "Token generated", {
            token,
            serverUrl: process.env.LIVEKIT_URL
        });

    } catch (error) {
        console.error("Error generating LiveKit token:", error);
        return response(res, 500, "Internal Server Error during token generation");
    }
}
