import { cookies } from "next/headers";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function getUser() {
    try {

        const session = await getServerSession(authOptions);
        if (session && session.user) {
            return {
                id: session.user.email || "google-user",
                email: session.user.email,
                name: session.user.name,
                photo: session.user.image
            };
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return null;
        }

        const res = await axios.get(`${BACKEND_URL}/me`, {
            headers: {
                Cookie: `access_token=${token}`
            },
        });

        if (!res.data) {
            return null;
        }
        return res.data.data;
    } catch (error) {
        console.log("Error fetching user:", error);
        return null;
    }
}
