import axios from "axios";
import { BACKEND_URL } from "./config";
import { getAccessToken } from "./getAccessToken";

export async function getWsToken() {

    const token = await getAccessToken();

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