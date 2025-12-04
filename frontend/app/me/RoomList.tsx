import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import RoomListClient, { Room } from "@/components/RoomListClient";
import { cookies } from "next/headers";

async function getRooms(): Promise<Room[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await axios.get(`${BACKEND_URL}/user-room`, {
        headers: {
            Cookie: `access_token=${token}`
        }
    });
    return res.data.data;
}

export default async function RoomList() {
    const rooms = await getRooms();

    return <RoomListClient rooms={rooms} />;
}