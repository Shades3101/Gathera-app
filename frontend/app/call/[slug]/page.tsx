import { cookies } from "next/headers";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { getWsToken } from "@/lib/getWsToken";
import CallClient from "./CallClient";

async function getRoomId(slug: string) {
    const token = (await cookies()).get("access_token")?.value || "";

    const res = await axios.get(`${BACKEND_URL}/room/${slug}`, {
        headers: {
            Cookie: `access_token=${token}`,
        },
    });

    return res.data.data.id;
}

export default async function CallPage({ params }: {
    params: Promise<{
        slug: string
    }>
}) {

    const slug = (await params).slug;
    const roomId = await getRoomId(slug);
    const wsToken = await getWsToken();


    return <CallClient roomId={roomId} WsToken={wsToken} />
}
