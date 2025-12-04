import jwt, { type JwtPayload } from "jsonwebtoken";
import { secret } from "./authMiddleware.js";

export default function wsAuthMiddleware(token: string): string | null {

    try {
        const vtoken = jwt.verify(token, secret)

        if (typeof vtoken == "string") {
            return null
        }

        if (!vtoken || !vtoken.userId) {
            return null
        }
        return vtoken.userId

    } catch (e) {
        console.log(e);
    }
    return null;
}