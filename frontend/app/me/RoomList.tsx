import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import RoomListClient, { Room } from "@/components/RoomListClient";
import { getAccessToken } from "@/lib/getAccessToken";

async function getRooms(): Promise<Room[]> {
    const token = await getAccessToken();

    if (!token) {
        return [];
    }

    try {
        const res = await axios.get(`${BACKEND_URL}/user-room`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data.data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
}

export default async function RoomList() {
    const rooms = await getRooms();

    const token = await getAccessToken();

    return <RoomListClient rooms={rooms} token={token || ""} />;
}