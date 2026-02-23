import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST() {
    try {
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === "production";

        let refreshToken = cookieStore.get("refresh_token")?.value;

        if (!refreshToken) {
            const session = await getServerSession(authOptions);
            refreshToken = (session as any)?.refreshToken;
        }

        if (!refreshToken) {
            return NextResponse.json(
                { error: "No refresh token available. Please log in again." },
                { status: 401 }
            );
        }

        const res = await axios.post(`${BACKEND_URL}/refresh-token`, {
            refreshToken
        }, {
            validateStatus: (status) => status < 500
        });

        if (res.status !== 200) {
            const response = NextResponse.json({
                error: "Refresh token expired. Please log in again."
            }, {
                status: 401
            });

            response.cookies.delete("access_token");
            response.cookies.delete("refresh_token");
            return response;
        }

        const data = res.data;
        const newAccessToken: string = data.data.token;
        const newRefreshToken: string = data.data.refreshToken;

        const cookieOpts = {
            httpOnly: true,
            path: "/",
            secure: isProduction,
            sameSite: isProduction ? ("none" as const) : ("lax" as const),
        };

        const response = NextResponse.json({
            success: true,
            token: newAccessToken,
        });

        response.cookies.set("access_token", newAccessToken, {
            ...cookieOpts,
            maxAge: 15 * 60,
        });

        if (newRefreshToken) {
            response.cookies.set("refresh_token", newRefreshToken, {
                ...cookieOpts,
                maxAge: 7 * 24 * 60 * 60,
            });
        }

        return response;

    } catch (error) {
        console.error("Token refresh error:", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        });
    }
}
