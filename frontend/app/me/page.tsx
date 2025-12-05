import NewRoom from "@/components/NewRoom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userSession } from "@/lib/authGuard";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { Separator } from "@/components/ui/separator";
import RoomList from "@/app/me/RoomList";
import { ChevronDown } from "lucide-react"; 
import JoinRoom from "@/components/JoinRoom";

// Force dynamic rendering for this page since it uses cookies
export const dynamic = 'force-dynamic';

export default async function Me() {
    const user = await userSession();

    return (
        <div className="min-h-screen bg-background">
            
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md h-16">
                <div className="container mx-auto px-4 flex h-full items-center justify-between">
                    <Button variant="ghost" className="hover:bg-transparent! cursor-pointer" asChild>
                        <Link href={"/"}>
                            <div className="text-xl font-bold tracking-tight">
                                Gathera
                            </div>
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                        <UserMenu user={user} />
                    </div>
                </div>
            </nav>

            <main className="flex flex-col">
                <section className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 space-y-10 relative">
                    
                    <div className="text-center space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Video call and meetings from anywhere,{" "}
                            <span className="text-blue-500 block sm:inline">anytime.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                            Connect with your loved ones seamlessly.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                      <JoinRoom/>
                    </div>

                    <div className="absolute bottom-10 animate-bounce text-muted-foreground">
                        <ChevronDown className="w-6 h-6" />
                    </div>
                </section>

                <Separator />
                <section className="container mx-auto px-4 py-16 min-h-screen space-y-8 ">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">My Rooms</h2>
                        <NewRoom /> 
                    </div>
                    
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                          
                        {/* New Room Component */}
                        <RoomList />
                    </div>
                </section>
            </main>
        </div>
    );
}