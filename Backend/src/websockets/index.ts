import { WebSocket, WebSocketServer } from "ws";
import wsAuthMiddleware from "../middleware/wsAuthMiddleware.js";
import { prismaClient } from "../db/client.js";
import { SignallingServer } from "./signalling.js";

export interface ConnectedUserType {
  ws: WebSocket,
  userId: string,
  rooms: Set<string>
}

const connectedUser: ConnectedUserType[] = [];

export function initWebSocket(server: any) {

  const wss = new WebSocketServer({
    server,
    verifyClient: (info, callback) => {
      const origin = info.origin;
      const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean);

      if (!allowedOrigins.includes(origin)) {
        console.warn(`Blocked WS connection from unauthorized origin: ${origin}`);
        return callback(false, 403, "Unauthorized Origin");
      }

      callback(true);
    }
  });

  wss.on("connection", (ws, request) => {

    const url = request.url || "";;

    if (!url) {
      return
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('wstoken') || "";
    const userId = wsAuthMiddleware(token)

    if (userId === null) {
      ws.close();
      return null
    }

    //storing user in-memory
    const user: ConnectedUserType = {
      ws,
      userId,
      rooms: new Set()
    }

    connectedUser.push(user);

    console.log(`Ws Connected: User is ${userId}`)

    // Send userId to the client
    ws.send(JSON.stringify({
      type: "connected",
      userId
    }));

    ws.on('message', async (data) => {

      const rawData = data.toString();

      let parsedData;
      try {
        parsedData = JSON.parse(rawData)
        console.log("Parsed data successfully:", parsedData)

      } catch (error) {
        console.log("Parse error:", error)
        return;
      }

      if (parsedData.type === "join-room") {

        const roomId = String(parsedData.roomId)

        const room = await prismaClient.room.findUnique({
          where: {
            id: roomId
          },
          include: {
            members: {
              where: {
                userId: userId
              }
            }
          }
        })

        if (!room) {
          ws.send(JSON.stringify({
            type: "Error",
            message: "Room Does not exist"
          }));
          return;
        }

        const isMember = room.members.length > 0;
        const isHost = room.hostId === userId;

        if (!isMember && !isHost) {
          ws.send(JSON.stringify({
            type: "Error",
            message: "Unauthorized: You are not a member of this room"
          }));
          return;
        }

        user?.rooms.add(roomId)
        console.log(`User ${userId} joined Room ${roomId}`);

        connectedUser.forEach((u) => {
          // Send to everyone in this room EXCEPT the person who just joined
          if (u.rooms.has(roomId) && u.userId !== userId) {
            console.log(`Notifying ${u.userId} that ${userId} joined`);
            u.ws.send(JSON.stringify({
              type: "user-joined",
              roomId,
              userId
            }));
          }
        });

      } else if (parsedData.type === "leave-room") {

        const roomId = String(parsedData.roomId);
        user.rooms.delete(roomId)

        connectedUser.forEach((u) => {
          if (u.rooms.has(roomId) && u.userId !== userId) {
            u.ws.send(JSON.stringify({
              type: "user-left",
              roomId,
              userId
            }));
          }
        });

        console.log(`User ${userId} has left the room ${roomId}`);

      } else if (parsedData.type === "chat") {

        const roomId = String(parsedData.roomId);
        const message = parsedData.message;

        //use queue - better approach, push it to queue
        //add try-catch to avoid crashing of the server 
        //FIX the bug (do not save chats if a user is not in the room): DONE
        if (!user.rooms.has(roomId)) {
          ws.send(JSON.stringify({
            type: "Error",
            message: "You must join the room before sending messages"
          }));
          return;
        }

        await prismaClient.chat.create({
          data: {
            roomId,
            message,
            userId
          }
        });

        console.log(`New Message from ${userId} in Room ${roomId}`);

        //Brodacast it to the All users in the room

        connectedUser.forEach((u) => {
          if (u.rooms.has(roomId)) {
            u.ws.send(
              JSON.stringify({
                type: "chat",
                roomId,
                message,
                sender: userId,
              })
            );
          }
        });
      }

      // this is the signalling server condition
      else if (["offer", "answer", "ice-candidate"].includes(parsedData.type)) {

        SignallingServer(ws, parsedData, userId, connectedUser);

      } else {

        console.log("Unknown WS event", parsedData.type)
      }
    });

    ws.on("close", () => {
      const index = connectedUser.indexOf(user);
      if (index !== -1) {
        connectedUser.splice(index, 1);
      }
      console.log(`WS disconnected ${userId}`)
    });
  });

  console.log("WebSocket server initialized");
}