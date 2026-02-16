import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && account.id_token) {
                try {
                    const res = await axios.post(`${BACKEND_API_URL}/google-login`, {
                        credential: account.id_token,
                    });

                    if (res.data && res.data.data && res.data.data.token) {
                        token.backendToken = res.data.data.token;
                    }
                } catch (error) {
                    console.error("Failed to sync user with backend:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.backendToken = token.backendToken;
            return session;
        }
    }
};
