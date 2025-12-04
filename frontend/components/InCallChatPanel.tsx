"use client";

import { useState, useRef, useEffect } from "react";
import { X, SendHorizonal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ChatMessage {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
}

export function InCallChatPanel({ messages, onSend, onClose, }: { 
  messages: ChatMessage[];
  onSend: (msg: string) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) {
       return;
    }

    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#121212] border-l border-white/10 rounded-l-2xl overflow-hidden shadow-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-white text-lg font-medium">In-call messages</h3>
        <button onClick={onClose} className="p-1 text-white/70 hover:text-white" >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-white/40 mt-6">No messages yet</p>
        )}

        {messages.map((m) => (
          <div key={m.id} className="flex flex-col">
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${ m.sender === "me" ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-white/10 text-white" }`} >
              {m.text}
            </div>
            <div className={`text-xs mt-1 ${ m.sender === "me" ? "text-right text-white/40" : "text-left text-white/40" }`} >
              {m.time}
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={submit} className="flex items-center bg-black/20 border border-white/10 rounded-2xl px-4 py-2" >
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Send a message" 
          className="border-0 shadow-none bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0" />

          <Button type="submit" size="icon" variant="ghost">
            <SendHorizonal className="h-5 w-5 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}
