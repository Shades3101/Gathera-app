"use client";

import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link";

interface User {
    id: string;
    email: string;
    photo?: string;
    name?: string;
}

export default function UserMenu({ user }: { user: User | null }) {
    const { logout } = useLogout();

    if (!user) {
        return (
            <>
                <Link href="/signin" className="text-sm font-medium text-muted-foreground transition-colors">
                    Sign In
                </Link>
                <Button asChild size="sm" className="font-semibold cursor-pointer">
                    <Link href="/signup">Get Started</Link>
                </Button>
            </>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                    <UserAvatar photo={user.photo} name={user.name} email={user.email} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuLabel>
                    <div className="flex justify-between items-center font-semibold">
                        <span>{user.email}</span>
                        <Button variant="ghost" size="sm" className="hover:bg-red-900/70 cursor-pointer" onClick={logout}>Logout</Button>
                    </div>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
