"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 

export default function JoinRoom() {
    const [slug, setSlug] = useState("");
    const router = useRouter();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug.trim()) return;
        router.push(`/call/${slug}`);
    };

    return <div className="w-full sm:w-auto flex flex-1 justify-center items-center gap-4 ">
        <Input placeholder="Enter Slug" className="h-12 rounded-xl px-5 w-full bg-muted/50 border-input focus-visible:ring-blue-500"
        onChange={(e) => setSlug(e.target.value)}
        />
        <Button className="p-6 cursor-pointer" variant="hero" onClick={handleJoin}>
            Join Room
        </Button>
    </div>
}