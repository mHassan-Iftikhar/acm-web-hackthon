"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/socket-context";
import { useAuth } from "@/hooks/use-auth";
import { chatApi } from "@/lib/chat-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isAdmin: boolean;
}

export function ChatWidget() {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && isOpen && messages.length === 0) {
      loadHistory();
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const history = await chatApi.getChatHistory(user!.uid);
      setMessages(
        history.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      );
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket || !user) return;

    const messageData = {
      text: inputValue,
      senderId: user.uid,
      senderName: user.displayName || user.email?.split("@")[0] || "User",
      timestamp: new Date(),
      isAdmin: false,
    };

    socket.emit("send_message", messageData);

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      { ...messageData, id: Math.random().toString() },
    ]);
    setInputValue("");
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 shadow-2xl border-2 flex flex-col h-[500px]">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              />
              <CardTitle className="text-sm font-semibold text-slate-900">
                Support Chat
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full px-4 py-4" viewportRef={scrollRef}>
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-20 text-sm">
                  <p>Connected to support.</p>
                  <p>How can we help you today?</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col ${msg.isAdmin ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          msg.isAdmin
                            ? "bg-slate-100 text-slate-900 rounded-tl-none"
                            : "bg-blue-600 text-white rounded-tr-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">
                        {format(msg.timestamp, "HH:mm")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full gap-2"
            >
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                disabled={!isConnected}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || !isConnected}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
