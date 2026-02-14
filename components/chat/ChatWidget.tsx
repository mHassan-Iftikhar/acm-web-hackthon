'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function ChatWidget() {
    const { user } = useAuth();
    const { messages, sendMessage, isConnected, isLoading } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // If not logged in, don't show chat
    if (!user) return null;

    const handleSend = () => {
        if (!inputText.trim()) return;
        // Send to 'admin' placeholder, backend should handle routing to support
        sendMessage(inputText, 'support-agent');
        setInputText('');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center p-0">
                    <MessageSquare className="w-8 h-8" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-80 h-96 flex flex-col shadow-2xl border-primary/20">
                    <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
                        <CardTitle className="text-sm font-medium">Support Chat</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-primary-foreground hover:bg-primary/80">
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                        {isLoading ? (
                            <div className="text-center text-xs text-muted-foreground p-4">Loading history...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-xs text-muted-foreground p-4">
                                👋 Hi! How can we help you today?
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                // Logic to determine if message is Mine
                                // If sender is a string and likely a User ID (MongoID), we can't easily compare with Firebase UID.
                                // However, we can use the `receiver` field.
                                // If I am the receiver (conceptually), it's from Support.
                                // If I sent it, the receiver should be 'support-agent' or an Admin ID.

                                // Actually, simpler:
                                // Authenticated User -> Sends to 'support-agent' -> Saved in DB as sender=UserID, receiver=AdminID?
                                // Backend needs to resolve 'support-agent' to an Admin ID or just leave it?
                                // Let's assume for now:
                                // If sender.name === user.displayName it's ME.
                                // If sender is 'support-agent' it's THEM.

                                let isMe = false;
                                if (typeof msg.sender === 'object' && msg.sender.name === user.displayName) isMe = true;
                                // Fallback: verify if I am not the sender, then it's incoming.
                                // But I need to know WHO the sender is.

                                // Let's assume left alignment for now if we vary.
                                // Actually, if I can't determine, default to Right (?) no, Left.

                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${isMe
                                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                                : 'bg-muted text-foreground rounded-bl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        {!isConnected && <div className="text-xs text-destructive text-center pt-2">Disconnected</div>}
                    </CardContent>
                    <CardFooter className="p-3 border-t gap-2 bg-muted/50">
                        <Input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="bg-background"
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button size="icon" onClick={handleSend} disabled={!isConnected || !inputText.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
