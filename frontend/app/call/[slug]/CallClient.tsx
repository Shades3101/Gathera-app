"use client";

import { LiveKitRoom, VideoTrack, useTracks, useRoomContext, TrackReference } from "@livekit/components-react";
import { Room, RoomEvent, VideoPresets, Track } from "livekit-client";
import { BACKEND_URL } from "@/lib/config";
import axios from "axios";
import "@livekit/components-styles";
import { UseSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Monitor, Phone, MessageSquareText } from "lucide-react";
import { CustomButton } from "@/components/ui/custombutton";
import { useRouter } from "next/navigation";
import { InCallChatPanel } from "@/components/InCallChatPanel";

// This component handles the ROOM connection and tracks
function VideoConference({ chatMessages, sendChatMessage, showChat, setShowChat, leaveCall }: {
    chatMessages: any[],
    sendChatMessage: (text: string) => void,
    showChat: boolean,
    setShowChat: React.Dispatch<React.SetStateAction<boolean>>,
    leaveCall: () => void
}) {
    const room = useRoomContext();
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    const localTrack = tracks.find(t => t.participant.identity === room.localParticipant.identity && t.source === Track.Source.Camera);
    const remoteTrack = tracks.find(t => t.participant.identity !== room.localParticipant.identity && t.source === Track.Source.Camera);

    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);

    const toggleMic = async () => {
        const newState = !isMicOn;
        setIsMicOn(newState);
        await room.localParticipant.setMicrophoneEnabled(newState);
    }

    const toggleVideo = async () => {
        const newState = !isVideoOn;
        setIsVideoOn(newState);
        await room.localParticipant.setCameraEnabled(newState);
    }

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden relative">
            {/* VIDEO AREA */}
            <div className="relative w-full max-w-7xl aspect-video mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/5">

                {/* REMOTE VIDEO*/}
                {remoteTrack ? (
                    <VideoTrack trackRef={remoteTrack as TrackReference} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                        Waiting for others...
                    </div>
                )}

                {/* LOCAL VIDEO  */}
                <div className="absolute bottom-4 right-4 w-64 aspect-video bg-black/50 rounded-xl border border-white/20 shadow-2xl overflow-hidden z-10">
                    {localTrack && (
                        <VideoTrack trackRef={localTrack as TrackReference} className="w-full h-full object-cover scale-x-[-1]" />
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white">
                        You
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">

                {/* Mic Button */}
                <CustomButton variant={isMicOn ? "secondary" : "destructive"} onClick={toggleMic} className="rounded-full w-14 h-14 shadow-lg cursor-pointer" >
                    {isMicOn ? <Mic /> : <MicOff />}
                </CustomButton>

                {/* Video Button */}
                <CustomButton variant={isVideoOn ? "secondary" : "destructive"} onClick={toggleVideo} className="rounded-full w-14 h-14 shadow-lg cursor-pointer">
                    {isVideoOn ? <Video /> : <VideoOff />}
                </CustomButton>

                {/* Soon ScreenShare */}
                <CustomButton className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white shadow-lg cursor-pointer" disabled>
                    <Monitor />
                </CustomButton>

                {/* Chat  Button */}
                <CustomButton onClick={() => setShowChat((prev) => !prev)} className="rounded-full w-14 h-14 text-white shadow-lg cursor-pointer" variant={showChat ? "secondary" : "destructive"}>
                    <MessageSquareText />
                </CustomButton>

                <CustomButton variant="destructive" className="rounded-full w-14 h-14 shadow-lg cursor-pointer" onClick={leaveCall} >
                    <Phone className="rotate-135" />
                </CustomButton>
            </div>

            {/* CHAT PANEL */}
            {showChat && (
                <div className="absolute right-6 top-8 bottom-8 w-96 z-50">
                    <InCallChatPanel messages={chatMessages} onSend={sendChatMessage} onClose={() => setShowChat(false)} />
                </div>
            )}
        </div>
    );
}

export default function CallClient({ roomId, WsToken, accessToken }: { roomId: string; WsToken: string; accessToken: string; }) {
    if (!WsToken) return null;

    const router = useRouter();
    const { socket, isConnected, userId } = UseSocket(WsToken);

    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<any[]>([]);

    const [liveKitToken, setLiveKitToken] = useState("");
    const [liveKitUrl, setLiveKitUrl] = useState("");


    useEffect(() => {
        if (!socket || !isConnected) {
            return;
        }

        // Join the WS room for Chat
        socket.send(JSON.stringify({
            type: "join-room",
            roomId
        }));

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "chat") {
                if (data.sender === userId) {
                    return; // Ignore own messages
                }
                const incoming = {
                    id: Date.now(),
                    text: data.message,
                    sender: "other" as const,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };
                setChatMessages((prev) => [...prev, incoming]);
            }
        };

        socket.addEventListener("message", handleMessage);
        return () => {
            socket.removeEventListener("message", handleMessage);
            socket.send(JSON.stringify({ type: "leave-room", roomId }));
        }
    }, [socket, isConnected, roomId, userId]);


    // Fetching LiveKit Token & URL
    useEffect(() => {
        if (!userId) {
            console.log("CallClient: Waiting for userId...");
            return;
        }

        const fetchToken = async () => {
            console.log("CallClient: Fetching token for roomId:", roomId, "userId:", userId);
            try {
                const identity = userId;
                const url = `${BACKEND_URL}/livekit/token?roomId=${roomId}&participantName=${identity}`;
                console.log("CallClient: Requesting", url);

                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    withCredentials: true
                });

                console.log("CallClient: Received response", res.data);

                if (res.data.data.token) {
                    setLiveKitToken(res.data.data.token);
                }

                // CRITICAL: Set the URL so the loading screen passes
                if (res.data.data.serverUrl) {
                    setLiveKitUrl(res.data.data.serverUrl);
                } else {
                    console.error("CallClient: No LiveKit URL found in response or env!");
                }

            } catch (e) {
                console.error("Failed to get LiveKit token", e);
            }
        };
        fetchToken();
    }, [roomId, userId, accessToken]);

    const sendChatMessage = (text: string) => {
        if (!text.trim()) {
            return;
        }

        const localMsg = {
            id: Date.now(),
            text,
            sender: "me" as const,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setChatMessages((prev) => [...prev, localMsg]);

        socket?.send(JSON.stringify({
            type: "chat",
            roomId,
            message: text,
        }));
    };

    const leaveCall = () => {
        router.push("/me");
    }

    if (!liveKitToken || !liveKitUrl) {
        return <div className="h-screen w-full flex items-center justify-center text-white">
            Loading Video...
        </div>;
    }

    return (
        <LiveKitRoom
            video={false}
            audio={false}
            token={liveKitToken}
            options={{ publishDefaults: { videoSimulcastLayers: [VideoPresets.h720, VideoPresets.h360] } }}
            serverUrl={liveKitUrl}
            data-lk-theme="default"
            style={{ height: '100vh' }}
            onDisconnected={() => { router.push("/me"); }}
            onError={(err) => { console.error("LiveKit Error:", err); }}
        >
            <VideoConference
                chatMessages={chatMessages}
                sendChatMessage={sendChatMessage}
                showChat={showChat}
                setShowChat={setShowChat}
                leaveCall={leaveCall}
            />
        </LiveKitRoom>
    );
}
