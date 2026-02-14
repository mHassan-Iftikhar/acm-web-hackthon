'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, X, Send } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIAssistant() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quickActions, setQuickActions] = useState<{ label: string; prompt: string }[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchQuickActions();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchQuickActions = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/ai/quick-actions`);
            setQuickActions(response.data.data);
        } catch (error) {
            console.error('Failed to fetch quick actions:', error);
        }
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const headers: any = { 'Content-Type': 'application/json' };

            // Add auth token if user is logged in
            if (user) {
                const { auth } = await import('@/lib/firebase');
                const token = await auth.currentUser?.getIdToken();
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
            }

            const response = await axios.post(
                `${API_URL}/api/ai/chat`,
                {
                    message: text,
                    conversationHistory: messages.slice(-6), // Last 6 messages for context
                },
                { headers }
            );

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.data.message,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (prompt: string) => {
        sendMessage(prompt);
    };

    return (
        <div className="fixed bottom-20 right-4 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center p-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                    <Sparkles className="w-6 h-6" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-96 h-[500px] flex flex-col shadow-2xl border-purple-200">
                    <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            <CardTitle className="text-sm font-medium">Taakra AI Assistant</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="h-6 w-6 text-white hover:bg-white/20"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full">
                            <div ref={scrollRef} className="p-4 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-sm text-muted-foreground py-8">
                                        <div className="mb-4">
                                            <Sparkles className="w-12 h-12 mx-auto text-purple-500" />
                                        </div>
                                        <p className="font-medium mb-2">Hi! I'm your AI assistant.</p>
                                        <p className="text-xs">How can I help you today?</p>
                                        {quickActions.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                {quickActions.map((action, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleQuickAction(action.prompt)}
                                                        className="w-full text-xs"
                                                    >
                                                        {action.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${msg.role === 'user'
                                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none'
                                                        : 'bg-muted text-foreground rounded-bl-none'
                                                    }`}
                                            >
                                                {msg.role === 'assistant' && (
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        <span className="text-xs font-semibold">AI</span>
                                                    </div>
                                                )}
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg p-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100" />
                                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200" />
                                                </div>
                                                <span className="text-xs text-muted-foreground">Thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-muted/20 gap-2">
                        <Input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask me anything..."
                            className="bg-background"
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(inputText)}
                            disabled={isLoading}
                        />
                        <Button
                            size="icon"
                            onClick={() => sendMessage(inputText)}
                            disabled={isLoading || !inputText.trim()}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
