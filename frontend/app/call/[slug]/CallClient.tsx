"use client";

import { UseSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Monitor, Phone, MessageSquareText, } from "lucide-react";
import { CustomButton } from "@/components/ui/custombutton";
import { useRouter } from "next/navigation";
import { InCallChatPanel } from "@/components/InCallChatPanel";

export default function CallClient({ roomId, WsToken, }: { roomId: string; WsToken: string; }) {

    // Early return should happen before any hooks
    if (!WsToken) {
        return null;
    }

    const { socket, isConnected, userId } = UseSocket(WsToken);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const hasJoinedRef = useRef(false);
    const hasSetupWebRTC = useRef(false);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);

    const router = useRouter();

    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Joining room
        if (!hasJoinedRef.current) {
            socket.send(JSON.stringify({
                type: "join-room",
                roomId,
            })
            );
            hasJoinedRef.current = true;
        }

        if (!hasSetupWebRTC.current) {
            setupWebRTC();
            hasSetupWebRTC.current = true;
        }

        const cleanup = setupSocketListeners();

        return () => {
            cleanup();
            hasJoinedRef.current = false;
        };
    }, [socket, isConnected]);

    // link video streams
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    const setupWebRTC = () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pcRef.current = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.send(JSON.stringify({
                    type: "ice-candidate",
                    roomId,
                    payload: event.candidate,
                })
                );
            }
        };

        pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            } else {
                const newStream = new MediaStream();
                newStream.addTrack(event.track);
                setRemoteStream(newStream);
            }
        };
    };

    const renegotiate = async () => {
        const pc = pcRef.current;
        if (!pc || !socket) {
            return;
        }
        if (pc.signalingState !== "stable") {
            return;
        }
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.send(JSON.stringify({
            type: "offer",
            roomId,
            payload: offer,
        })
        );
    };

    const startCall = async () => {
        const pc = pcRef.current;
        if (!pc) return;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket?.send(JSON.stringify({
            type: "offer",
            roomId,
            payload: offer,
        })
        );
    };

    const toggleMic = async () => {
        if (isMicOn) {
            // remove audio tracks
            const senders = pcRef.current?.getSenders() || [];
            senders.forEach((s) => {
                if (s.track?.kind === "audio") {
                    pcRef.current?.removeTrack(s);
                }
            });

            localStream?.getAudioTracks().forEach((t) => {
                t.stop();
                localStream.removeTrack(t);
            });

            setIsMicOn(false);
            await renegotiate();
            return;
        }

        try {
            const audio = await navigator.mediaDevices.getUserMedia({ audio: true });

            let finalStream = localStream || new MediaStream();
            audio.getTracks().forEach((t) => finalStream.addTrack(t));
            setLocalStream(finalStream);

            audio.getTracks().forEach((t) =>
                pcRef.current?.addTrack(t, finalStream!)
            );

            setIsMicOn(true);
            await renegotiate();
        } catch (error) {
            console.log("Mic blocked", error);
        }
    };

    const toggleVideo = async () => {
        if (isVideoOn) {
            // remove video tracks
            const senders = pcRef.current?.getSenders() || [];
            senders.forEach((s) => {
                if (s.track?.kind === "video") pcRef.current?.removeTrack(s);
            });

            localStream?.getVideoTracks().forEach((t) => {
                t.stop();
                localStream.removeTrack(t);
            });

            setIsVideoOn(false);
            await renegotiate();
            return;
        }

        try {
            const video = await navigator.mediaDevices.getUserMedia({ video: true });

            let finalStream = localStream || new MediaStream();
            video.getTracks().forEach((t) => finalStream.addTrack(t));
            setLocalStream(finalStream);

            video.getTracks().forEach((t) =>
                pcRef.current?.addTrack(t, finalStream!)
            );

            setIsVideoOn(true);
            await renegotiate();
        } catch (e) {
            console.log("Video blocked", e);
        }
    };

    const setupSocketListeners = () => {
        if (!socket) return () => { };

        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            // Handle connected message Safety Check just in case 
            if (data.type === "connected") {
                return;
            }

            // Other user joined then start the call
            if (data.type === "user-joined") {
                startCall();
                return;
            }

            if (data.type === "offer") {
                const pc = pcRef.current;
                if (!pc) return;

                await pc.setRemoteDescription(data.payload);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                socket.send(JSON.stringify({
                    type: "answer",
                    roomId,
                    payload: answer,
                })
                );
                return;
            }

            if (data.type === "answer") {
                await pcRef.current?.setRemoteDescription(data.payload);
                return;
            }

            if (data.type === "ice-candidate") {
                await pcRef.current?.addIceCandidate(data.payload);
                return;
            }

            if (data.type === "chat") {

                if (data.sender === userId) {
                    return;
                }
                const incoming = {
                    id: Date.now(),
                    text: data.message,
                    sender: data.sender === userId ? "me" : "other",
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };
                setChatMessages((prev) => [...prev, incoming]);
                return;
            }
        };

        return () => {
            socket.onmessage = null;
        };
    };

    const sendChatMessage = (text: string) => {
        if (!text.trim()) {
            return;
        }
        const localMsg = {
            id: Date.now(),
            text,
            sender: "me",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setChatMessages((prev) => [...prev, localMsg]);

        socket?.send( JSON.stringify({
                type: "chat",
                roomId,
                message: text, 
            })
        );
    };

    function leaveCall() {
        if (socket && isConnected) {
            socket.send( JSON.stringify({
                    type: "leave-room",
                    roomId,
                })
            );
        }

        if (localStream) {
            localStream.getTracks().forEach((t) => t.stop());
        }

        setRemoteStream(null);

        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }

        router.push("/me");
    }

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden relative">
            {/* VIDEO AREA */}
            <div className="relative w-full max-w-7xl aspect-video mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/5">
                {remoteStream ? (
                    <>
                        <video ref={remoteVideoRef} playsInline className="w-full h-full object-cover" />

                        {/* Local video */}
                        <div className="absolute bottom-4 right-4 w-64 aspect-video bg-black/50 rounded-xl border border-white/20 shadow-2xl overflow-hidden z-10">
                            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white">
                                You
                            </div>
                        </div>
                    </>
                ) : (
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                )}
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
                <CustomButton className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white shadow-lg cursor-pointer">
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
