import axios from "axios";
import { cookies } from "next/headers";
import { BACKEND_URL } from "./config";

export async function getWsToken() {

    const token = (await cookies()).get("access_token")?.value || "";

    const res = await axios.get(`${BACKEND_URL}/ws-token`,
        {
            headers: {
                Cookie: `access_token=${token}`
            }
        }
    )

    console.log(res)

    return res.data.data
}