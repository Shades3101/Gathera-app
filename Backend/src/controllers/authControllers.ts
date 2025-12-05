import type { Request, Response } from "express";
import { SignInZodSchema, SignUpZodSchema } from "../types/type.js";
import { response } from "../utils/responseHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret } from "../middleware/authMiddleware.js";
import { prismaClient } from "../db/client.js";
import { Prisma } from "../generated/prisma/client.js";


export async function SignUp(req: Request, res: Response) {
    try {

        const parsedData = SignUpZodSchema.safeParse(req.body);
        if (!parsedData.success) {

            return response(res, 400, "Invalid Inputs", parsedData.error.format())
        }

        const hashedPass = await bcrypt.hash(parsedData.data.password, 10)


        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.email,
                name: parsedData.data.name,
                password: hashedPass
            }
        })

        response(res, 200, "Signup Success", user.id)

    } catch (error) {

        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return response(res, 409, "User with this email already exists");
            }
        }
        return response(res, 500, "Internal Server Error");
    }

}

export async function SignIn(req: Request, res: Response) {
    try {

        const parsedData = SignInZodSchema.safeParse(req.body);
        console.log(parsedData)
        if (!parsedData.success) {

            return response(res, 400, "Invalid Inputs", parsedData.error.format())
        }

        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })

        if (!user) {
            return response(res, 404, "User Not Found")
        }

        const passMatch = await bcrypt.compare(parsedData.data.password, user.password)
        if (passMatch) {
            const token = jwt.sign({
                userId: user.id
            }, secret,
                { expiresIn: "1d" });

            return response(res, 200, "Login Success", { userId: user.id, token: token });

        } else {
            return response(res, 401, "Invalid Credentials");
        }

    } catch (error) {
        console.log(error)
        return response(res, 500, "Internal Server Error")
    }
}

export async function WsToken(req: Request, res: Response) {

    try {
        const userId = req.userId;
        
        if(!userId) {
            return response(res, 401, "Unauthorized: User ID missing")
        }

        const wsToken = jwt.sign(
            { userId },
            secret,
            { expiresIn: "15m" }
        );

        return response(res, 200, "Ws Token", wsToken)
    } catch (err) {
        return response(res, 500, "Failed to issue WS token");
    }
}
