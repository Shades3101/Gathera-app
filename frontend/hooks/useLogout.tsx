"use client"

import { notify } from "@/lib/notify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";


export const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        try {
            await signOut({ redirect: false });
            await axios.post("/api/logout");

            router.refresh()

            router.push("/");
            notify.info("Logged Out Successfully");

        } catch (error) {
            console.log("Logout Failed", error);
            notify.error("Logout Failed")
        }
    };

    return { logout };
};