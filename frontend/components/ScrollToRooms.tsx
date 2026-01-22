"use client";

import { ChevronDown } from "lucide-react";

export default function ScrollToRooms() {
    const handleScroll = () => {
        document.getElementById("my-rooms")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div onClick={handleScroll} className="absolute bottom-10 animate-bounce text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            <ChevronDown className="w-8 h-8" />
        </div>
    );
}
