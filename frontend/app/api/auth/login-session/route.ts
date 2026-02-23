import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, refreshToken } = body;

        if (!token) {
            return NextResponse.json({
                error: "Token is required"
            }, {
                status: 400
            });
        }

        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === "production";

        const cookieOpts = {
            httpOnly: true,
            path: "/",
            secure: isProduction,
            sameSite: isProduction ? ("none" as const) : ("lax" as const),
        };

        cookieStore.set("access_token", token, {
            ...cookieOpts,
            maxAge: 15 * 60,
        });

        if (refreshToken) {
            cookieStore.set("refresh_token", refreshToken, {
                ...cookieOpts,
                maxAge: 7 * 24 * 60 * 60,
            });
        }

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        console.error("Session creation error:", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        });
    }
}
