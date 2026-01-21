"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import axios from "axios";

export default function JoinRoom() {
    const [slug, setSlug] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!slug.trim()) {
            return;
        }

        setLoading(true);
        try {
            
            await api.get(`/room/${slug}`);
            router.push(`/call/${slug}`);

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setError("Room not found");
                } else if (error.response?.status === 401) {
                    setError("Please login to join the room");
                } else {
                    setError("Something went wrong");
                }
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return <div className="w-full sm:w-auto flex flex-1 justify-center items-center gap-4 ">
        <div className="flex flex-col w-full gap-2">
            <div className="flex w-full gap-4">
                <Input placeholder="Enter Slug" className="h-12 rounded-xl px-5 w-full bg-muted/50 border-input focus-visible:ring-blue-500" onChange={(e) => {
                        setSlug(e.target.value);
                        setError("");
                    }} value={slug} />

                <Button className="p-6 cursor-pointer" variant="hero" onClick={handleJoin} disabled={loading}>
                    {loading ? "Joining..." : "Join Room"}
                </Button>
            </div>
            {error && <span className="text-red-500 text-sm ml-2">
                {error}
            </span>
            }
        </div>
    </div>
}