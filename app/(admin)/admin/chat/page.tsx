'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useChat } from '@/hooks/use-chat';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { auth } from '@/lib/firebase';

interface ChatUser {
    _id: string;
    email: string;
    displayName?: string;
}

export default function AdminChatPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[]>([]);
    const [replyText, setReplyText] = useState('');
    const { sendMessage, socket } = useChat();

    // Fetch users with active chats
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setUsers(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        fetchUsers();
    }, [user]);

    // Fetch conversation when user selected
    useEffect(() => {
        if (!selectedUser) return;

        const fetchConversation = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/admin/history/${selectedUser}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setMessages(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch conversation', error);
            }
        };

        fetchConversation();

        if (socket) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handleNewMsg = (msg: any) => {
                if (msg.sender._id === selectedUser || msg.receiver === selectedUser) {
                    setMessages(prev => [...prev, msg]);
                }
            };

            socket.on('receive_message', handleNewMsg);
            socket.on('message_sent', handleNewMsg);

            return () => {
                socket.off('receive_message', handleNewMsg);
                socket.off('message_sent', handleNewMsg);
            }
        }

    }, [selectedUser, socket]);

    const handleSend = () => {
        if (!replyText.trim() || !selectedUser) return;
        sendMessage(replyText, selectedUser); // Send to specific user ID
        setReplyText('');
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-4 p-4">
            {/* Users List */}
            <Card className="w-1/3 flex flex-col">
                <CardHeader>
                    <CardTitle>Active Conversations</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-2">
                    {users.length === 0 && <div className="text-center text-sm text-muted-foreground">No active chats</div>}
                    {users.map((u) => (
                        <div
                            key={u._id}
                            onClick={() => setSelectedUser(u._id)}
                            className={`p-3 rounded-lg cursor-pointer mb-2 flex items-center gap-2 ${selectedUser === u._id ? 'bg-secondary' : 'hover:bg-muted'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                                {(u.displayName?.[0] || u.email[0]).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-medium truncate">{u.displayName || 'User'}</div>
                                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col">
                <CardHeader className="border-b">
                    <CardTitle>{users.find(u => u._id === selectedUser)?.displayName || (selectedUser ? 'Unknown User' : 'Select a user')}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                    {!selectedUser ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">Select a conversation to start chatting</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground">No messages</div>
                    ) : (
                        messages.map((msg, i) => {
                            // Check if message is from the selected user (Them)
                            // If msg.sender is string, compare strings. If object, compare _id.
                            const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
                            const isThem = senderId === selectedUser;

                            return (
                                <div key={i} className={`flex ${isThem ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${!isThem
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-white dark:bg-slate-800 border rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                        <div className="text-[10px] opacity-70 mt-1 text-right">
                                            {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </CardContent>
                <CardFooter className="p-4 border-t gap-2">
                    <Input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type a reply..."
                        disabled={!selectedUser}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend} disabled={!selectedUser || !replyText.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
