import { WebSocket } from "ws";
import type { ConnectedUserType } from "./index.js"

console.log("Before Signalling Server")

export const SignallingServer = (ws: WebSocket, message: any, senderId: string, connectedUsers: ConnectedUserType[]) => {

    const { type, roomId, payload } = message;

    if (type !== "offer" && type !== "answer" && type !== "ice-candidate") {

        return;
    }

    console.log(`Signal [${type}] from ${senderId} to Room ${roomId}`)

    connectedUsers.forEach((user) => {

        const isInRoom = user.rooms.has(roomId);

        const isNotSender = user.userId !== senderId;

        if (isInRoom && isNotSender) {
            if (user.ws.readyState === WebSocket.OPEN) {
                user.ws.send(JSON.stringify({
                    type: type,
                    senderId,
                    payload
                }));
            }
        }
    });
};