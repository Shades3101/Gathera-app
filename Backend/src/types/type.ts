import { z } from "zod";

export const SignUpZodSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.string().min(3).max(30),
    password: z.string().min(1)
})

export const SignInZodSchema = z.object({
    email: z.string().min(3).max(30),
    password: z.string().min(1)
})

export const RoomSchema = z.object({
    slug: z.string().min(1).max(15)
})