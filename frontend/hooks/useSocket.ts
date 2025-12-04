import { WS_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";

export interface WSMessage {
    type: string,
    roomId: string,
    payload?: any,
    message?: string,
}

export function UseSocket(token: string) {

    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {

        if (!token) {
            return
        }

        const ws = new WebSocket(`${WS_URL}?wstoken=${token}`)
        console.log(ws);
        console.log("Welcome to the room")

        wsRef.current = ws; // stable for video avoids re-renders

        ws.onopen = () => {
            console.log("Ws Connected")
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "connected" && data.userId) {
                    setUserId(data.userId);
                    console.log("Received userId:", data.userId);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        ws.onerror = (error) => {
            console.log("WS Error", error)
        }

        ws.onclose = () => {
            console.log("Ws Closed")
            setIsConnected(false);
        }

        return () => {
            ws.close();
        }

    }, [token]);

    return {
        socket: wsRef.current,
        isConnected,
        userId
    }

}