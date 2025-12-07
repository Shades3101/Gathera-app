"use client";

import { api } from "@/lib/api";
import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface NewRoomProps {
    token?: string;
}

export default function NewRoom({ token }: NewRoomProps) {
    const router = useRouter();

    const [slug, setSlug] = useState("");

    const newRoomHandle = async () => {
        try {
            const resposne = await api.post(`/create-room`,
                { slug },
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                }
            )

            console.log("Room Created", resposne.data)
            router.refresh()
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-fit sm:w-auto bg-blue-500 hover:bg-blue-600 h-full rounded-xl px-8 text-lg font-medium bg-transparent hover:bg-gray-700 cursor-pointer">
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enter Slug</DialogTitle>
                    <DialogDescription>
                        Slug is the name of the room.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Slug
                        </Label>
                        <Input id="link" placeholder="example: cohort-chat" onChange={(e) => setSlug(e.target.value)} />
                    </div>
                </div>
                <DialogFooter className="sm: justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={newRoomHandle} className="cursor-pointer">
                            Create Room
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
}