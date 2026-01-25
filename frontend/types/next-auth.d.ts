import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession {
        backendToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        backendToken?: string;
    }
}
