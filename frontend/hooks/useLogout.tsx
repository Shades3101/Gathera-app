"use client"

import axios from "axios";
import { useRouter } from "next/navigation";


export const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        try {

            await axios.post("/api/logout");

            router.refresh()

            router.push("/");
        } catch (error) {
            console.log("Logout Failed", error);
        }
    };

    return { logout };
};