import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { getWsToken } from "@/lib/getWsToken";
import CallClient from "./CallClient";
import { userSession } from "@/lib/authGuard";
import { getAccessToken } from "@/lib/getAccessToken";

async function getRoomId(slug: string) {
    const token = await getAccessToken();

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
    const user = await userSession();

    if (!user) {
        return null
    }

    const slug = (await params).slug;
    const roomId = await getRoomId(slug);
    const wsToken = await getWsToken();
    const accessToken = await getAccessToken();


    return <CallClient roomId={roomId} WsToken={wsToken} accessToken={accessToken} />
}
