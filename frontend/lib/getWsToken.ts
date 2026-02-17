import axios from "axios";
import { BACKEND_URL } from "./config";
import { getAccessToken } from "./getAccessToken";

export async function getWsToken() {

    const token = await getAccessToken();

    if (!token) {
        console.error("getWsToken: No access token found");
    }

    try {
        const res = await axios.get(`${BACKEND_URL}/ws-token`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )

        return res.data.data
    } catch (error: any) {
        console.error("getWsToken failed:", error.response?.status, error.response?.data);
        throw error;
    }
}