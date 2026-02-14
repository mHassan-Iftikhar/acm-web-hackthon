"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/socket-context";
import { chatApi } from "@/lib/chat-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, User } from "lucide-react";
import { format } from "date-fns";

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isAdmin: boolean;
}

export function AdminChatView() {
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (message: Message) => {
      // If message is for selected user, add to messages
      if (
        message.senderId === selectedUserId ||
        (message.isAdmin && selectedUserId)
      ) {
        setMessages((prev) => [...prev, message]);
      }

      // Update conversations list
      loadConversations();
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, selectedUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      setIsLoadingList(conversations.length === 0);
      const data = await chatApi.getAdminChats();
      setConversations(
        data.map((c: any) => ({
          ...c,
          timestamp: new Date(c.timestamp),
        })),
      );
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const loadChat = async (userId: string) => {
    try {
      setIsLoadingChat(true);
      setSelectedUserId(userId);
      const history = await chatApi.getChatHistory(userId);
      setMessages(
        history.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      );

      // Mark as read
      await chatApi.markAsRead(userId);
      loadConversations(); // Refresh unread count
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket || !selectedUserId) return;

    const messageData = {
      text: inputValue,
      senderId: "admin", // Static for now, or use real admin ID from auth
      senderName: "Support Team",
      recipientId: selectedUserId,
      timestamp: new Date(),
      isAdmin: true,
    };

    socket.emit("send_admin_message", messageData);

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      { ...messageData, id: Math.random().toString() },
    ]);
    setInputValue("");
  };

  const selectedConversation = conversations.find(
    (c) => c.userId === selectedUserId,
  );

  return (
    <div className="flex bg-white rounded-xl shadow-sm border h-[700px] overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b bg-slate-50">
          <h2 className="font-bold flex items-center gap-2 text-slate-900">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Support Conversations
          </h2>
        </div>
        <ScrollArea className="flex-1">
          {isLoadingList ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No active conversations.
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((c) => (
                <button
                  key={c.userId}
                  onClick={() => loadChat(c.userId)}
                  className={`w-full p-4 flex gap-3 hover:bg-slate-50 transition-colors text-left ${
                    selectedUserId === c.userId
                      ? "bg-blue-50 hover:bg-blue-50"
                      : ""
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {c.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-slate-900 truncate">
                        {c.userName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {format(c.timestamp, "HH:mm")}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${c.unreadCount > 0 ? "text-slate-900 font-bold" : "text-slate-500"}`}
                    >
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <div className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center shrink-0">
                      {c.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {!selectedUserId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="bg-slate-100 p-6 rounded-full">
              <User className="h-12 w-12" />
            </div>
            <p className="text-sm font-medium">
              Select a conversation to start chatting
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-white flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {selectedConversation?.userName.charAt(0).toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-slate-900 leading-none">
                  {selectedConversation?.userName}
                </h3>
                <span className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Online
                </span>
              </div>
            </div>

            <ScrollArea className="flex-1 px-6 py-6" viewportRef={scrollRef}>
              {isLoadingChat ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col ${msg.isAdmin ? "items-end" : "items-start"}`}
                    >
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            msg.isAdmin
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white text-slate-900 rounded-tl-none border"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span
                          className={`text-[10px] text-slate-400 ${msg.isAdmin ? "text-right" : "text-left"}`}
                        >
                          {format(msg.timestamp, "MMM dd, HH:mm")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 bg-white border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-3"
              >
                <Input
                  placeholder="Type your reply..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 h-11"
                  disabled={!isConnected}
                />
                <Button
                  type="submit"
                  className="h-11 px-6"
                  disabled={!inputValue.trim() || !isConnected}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Sub-component wrapper for Lucide icon to avoid errors in main file
function MessageCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
