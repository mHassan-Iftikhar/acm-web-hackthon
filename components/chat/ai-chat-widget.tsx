"use client";

import { useState, useRef, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { streamChat, getAiStatus, type ChatMessage } from "@/lib/ai-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type UiMessage = { id: string; role: "user" | "assistant"; content: string };

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAiStatus().then((s) => setAiAvailable(s.available));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: UiMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    const chatHistory: ChatMessage[] = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: text },
    ];

    let fullContent = "";
    const currentUser = auth.currentUser;
    const token = currentUser ? await currentUser.getIdToken() : null;

    try {
      await streamChat(chatHistory, token, {
        onChunk(chunk) {
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: fullContent } : m,
            ),
          );
        },
        onDone() {
          setIsLoading(false);
        },
        onError(err) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content || `Error: ${err}` }
                : m,
            ),
          );
          setIsLoading(false);
        },
      });
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: m.content || "Something went wrong." }
            : m,
        ),
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-24 z-50">
      {!isOpen ? (
        <Button
          className="h-14 w-14 rounded-full shadow-lg bg-violet-600 hover:bg-violet-700"
          onClick={() => setIsOpen(true)}
          title="AI Assistant"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 shadow-2xl border-2 flex flex-col h-[500px]">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b bg-violet-50/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              <CardTitle className="text-sm font-semibold text-slate-900">
                AI Assistant
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
            {!aiAvailable && (
              <div className="absolute top-2 left-2 right-2 text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 z-10">
                AI is not configured. Ask your admin to set GEMINI_API_KEY.
              </div>
            )}
            <ScrollArea className="h-full px-4 py-4" viewportRef={scrollRef}>
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-20 text-sm">
                  <p className="font-medium text-slate-700">Ask me about competitions</p>
                  <p className="mt-1">e.g. &quot;What competitions are coming up?&quot;</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-violet-600 text-white rounded-tr-none"
                            : "bg-slate-100 text-slate-900 rounded-tl-none"
                        }`}
                      >
                        {msg.content
                          ? msg.content
                          : msg.role === "assistant" && isLoading
                            ? (
                                <span className="inline-flex items-center gap-1">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Thinking...
                                </span>
                              )
                            : null}
                      </div>
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
                handleSend();
              }}
              className="flex w-full gap-2"
            >
              <Input
                placeholder="Ask about competitions..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                disabled={isLoading || !aiAvailable}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading || !aiAvailable}
                className="bg-violet-600 hover:bg-violet-700"
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
