import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { auth } from '../config/firebase-admin.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

interface Autosocket extends Socket {
    user?: any;
}

export const initSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // Adjust for production
            methods: ['GET', 'POST'],
        },
    });

    // Middleware for authentication
    io.use(async (socket: Autosocket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token not provided'));
            }

            const decodedToken = await auth.verifyIdToken(token);

            // Find user in DB to attach complete profile if necessary
            const user = await User.findOne({ firebaseUID: decodedToken.uid });

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket: Autosocket) => {
        console.log(`User connected: ${socket.user?.email} (${socket.id})`);

        // Join user to their own room for private messages/notifications
        // Room name: user_<mongoId>
        const userId = socket.user?._id.toString();
        socket.join(`user_${userId}`);

        // If user is admin, join 'admin' room to receive support messages
        if (socket.user?.role === 'admin') {
            socket.join('admin_support');
        }

        // Handle sending a message
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, content } = data;

                if (!receiverId || !content) return;

                const newMessage = await Message.create({
                    sender: userId,
                    receiver: receiverId,
                    content,
                    isRead: false
                });

                // Emit to receiver
                io.to(`user_${receiverId}`).emit('receive_message', {
                    _id: newMessage._id, // Send the message ID back
                    sender: {
                        _id: socket.user._id,
                        name: socket.user.displayName || socket.user.email,
                        avatar: socket.user.profilePicture
                    }, // Populate verify minimal sender info
                    receiver: receiverId,
                    content,
                    timestamp: newMessage.createdAt
                });

                // Emit back to sender (confirmation/optimistic UI update support)
                // Or client can just push their own message. 
                // But helpful to have server confirmation.
                socket.emit('message_sent', {
                    _id: newMessage._id,
                    content,
                    timestamp: newMessage.createdAt
                });

            } catch (error) {
                console.error('Message send error:', error);
                socket.emit('error', 'Failed to send message');
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user?.email}`);
        });
    });

    return io;
};
