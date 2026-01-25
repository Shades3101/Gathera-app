import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAccessToken() {
    let token = (await cookies()).get("access_token")?.value;

    if (!token) {
        const session = await getServerSession(authOptions);
        if (session?.backendToken) {
            token = session.backendToken;
        }
    }

    return token || "";
}
