"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/config";

export const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        try {
            await axios.get(`${BACKEND_URL}/logout`, {
                withCredentials: true
            });

            router.push("/");
        } catch (error) {
            console.log("Logout Failed", error);
        }
    };

    return { logout };
};