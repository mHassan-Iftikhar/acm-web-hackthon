import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        avatar?: string;
    } | string;
    receiver: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    createdAt?: string;
}

export const useChat = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize Socket
    useEffect(() => {
        if (!user) return;

        let newSocket: Socket | null = null;

        const initSocket = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) return;

                // Use environment variable for backend URL or default to localhost
                const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

                newSocket = io(SOCKET_URL, {
                    auth: {
                        token: token,
                    },
                    autoConnect: true,
                });

                newSocket.on('connect', () => {
                    console.log('Socket connected');
                    setIsConnected(true);
                });

                newSocket.on('disconnect', () => {
                    console.log('Socket disconnected');
                    setIsConnected(false);
                });

                newSocket.on('receive_message', (message: Message) => {
                    setMessages((prev) => [...prev, message]);
                });

                newSocket.on('message_sent', (message: Message) => {
                    setMessages((prev) => {
                        if (prev.find(m => m._id === message._id)) return prev;
                        return [...prev, message];
                    });
                });

                newSocket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err);
                });

                setSocket(newSocket);

                // Fetch initial history
                fetchHistory(token);
            } catch (error) {
                console.error("Socket init error", error);
            }
        };

        initSocket();

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, [user]);

    const fetchHistory = async (token: string) => {
        try {
            setIsLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/chat/history`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setMessages(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch chat history", error);
        } finally {
            setIsLoading(false);
        }
    }

    const sendMessage = useCallback((content: string, receiverId: string) => {
        if (socket && isConnected) {
            socket.emit('send_message', { content, receiverId });
        }
    }, [socket, isConnected]);

    return {
        socket,
        messages,
        sendMessage,
        isConnected,
        isLoading
    };
};
