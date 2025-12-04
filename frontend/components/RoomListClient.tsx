"use client";

import { Group, MoreHorizontal, Trash2, Share2, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export interface Room {
    id: string;
    slug: string;
    createdAt: string;
}

interface RoomListClientProps {
    rooms: Room[];
}

export default function RoomListClient({ rooms }: RoomListClientProps) {
    const router = useRouter();
    
    const handleRoomClick = (slug: string) => {
        router.push(`/call/${slug}`);
    };

 
    const handleCopyLink = (e: React.MouseEvent, slug: string) => {
        e.stopPropagation();
        const url = `${window.location.origin}/room/${slug}`;
        navigator.clipboard.writeText(url);
        // You can add a toast notification here if you have one set up
        alert("Link copied to clipboard!");
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        
        console.log(id)
        const res = await axios.delete(`${BACKEND_URL}/delete-Room`, {
            data: { id },
            withCredentials: true
        });

        router.refresh()
        console.log("Delete room", id);
    };

    return (
        <div className="w-full">
            {rooms.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">No rooms yet. Create one above!</p>
                </div>
            ) : (
                <div className="flex flex-col">
                    {rooms.map((room, index) => (
                        <div key={room.id} className="group">
                           
                            <div onClick={() => handleRoomClick(room.slug)} className="flex items-center justify-between px-4 py-4 hover:bg-muted/40 transition-colors cursor-pointer rounded-lg">
                           
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="p-2 bg-muted/30 rounded-full text-muted-foreground group-hover:text-blue-500 transition-colors">
                                        <Group className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-base font-medium text-foreground truncate">
                                            {room.slug}
                                        </p>
                                        <p className="text-xs text-muted-foreground sm:hidden">
                                            {new Date(room.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mr-10 md:gap-10 text-sm text-muted-foreground">
                                    <span className="hidden sm:inline text-xs w-20 text-right">
                                        {new Date(room.createdAt).toLocaleDateString()}
                                    </span>

                                    {/* Dropdown Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>

                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" onClick={(e) => e.stopPropagation()}>   {/* stopPropagation prevents the row click from firing */}
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRoomClick(room.slug); }}>
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Join Room
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => handleCopyLink(e, room.slug)}>
                                                <Share2 className="mr-2 h-4 w-4" />
                                                Copy Invitation
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={(e) => handleDelete(e, room.id)} >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Room
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            {index < rooms.length - 1 && (
                                <Separator className="my-1 bg-border/40" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}