import jwt, { type JwtPayload } from "jsonwebtoken";

export default function wsAuthMiddleware(token: string): string | null {

    try {
        const vtoken = jwt.verify(token, process.env.JWT_SECRET!)

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