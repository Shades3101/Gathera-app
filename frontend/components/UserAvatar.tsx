"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

interface UserAvatarProps {
    photo?: string | null;
    name?: string;
    email?: string;
    className?: string;
}

export function UserAvatar({ photo, name, email, className }: UserAvatarProps) {
    const [imageError, setImageError] = useState(false);

    // Generate fallback initials
    const getInitials = () => {
        if (name) {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        if (email) {
            return email[0].toUpperCase();
        }
        return "U";
    };

    return (
        <Avatar className={className}>
            {photo && !imageError ? (
                <div className="relative w-full h-full">
                    <Image
                        src={photo}
                        alt={name || email || "User avatar"}
                        fill
                        className="object-cover"
                        sizes="32px"
                        onError={() => setImageError(true)}
                        unoptimized={false} // Enable Next.js optimization and caching
                    />
                </div>
            ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials()}
                </AvatarFallback>
            )}
        </Avatar>
    );
}
