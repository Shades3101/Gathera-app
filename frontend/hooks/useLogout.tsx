"use client"

import { notify } from "@/lib/notify";
import axios from "axios";
import { useRouter } from "next/navigation";


export const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        try {

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