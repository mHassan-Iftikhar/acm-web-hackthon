import { Request, Response } from 'express';
import Message from '../../models/Message.js';
import User from '../../models/User.js';

// Get chat history for the current user (User <-> Admin)
export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.uid; // Firebase UID from token
        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        // Resolve MongoDB ID from Firebase UID
        const user = await User.findOne({ firebaseUID: userId });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Find messages where user is sender OR receiver
        // Note: This assumes support chat is a single channel between user and "the system" or "admin team"
        const messages = await Message.find({
            $or: [
                { sender: user._id },
                { receiver: user._id }
            ]
        })
            .sort({ createdAt: 1 }) // Oldest first
            .populate('sender', 'displayName email profilePicture')
            .populate('receiver', 'displayName email profilePicture');

        res.status(200).json({
            status: 'success',
            data: messages
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch chat history' });
    }
};

// Admin: Get list of users who have chatted
export const getUsersWithChats = async (req: Request, res: Response) => {
    try {
        // Aggregate to find unique senders who are not admins
        // Or simpler: find all messages, get unique sender IDs, populate user info
        // This is a naive implementation, good for MVP
        const distinctSenderIds = await Message.distinct('sender');

        const users = await User.find({
            _id: { $in: distinctSenderIds },
            role: 'user' // Only fetch regular users
        }).select('displayName email profilePicture firebaseUID');

        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
    }
};


// Admin: Get chat history with a specific user
export const getAdminChatHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params; // MongoDB ID of the user

        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'displayName email profilePicture')
            .populate('receiver', 'displayName email profilePicture');

        res.status(200).json({
            status: 'success',
            data: messages
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch chat history' });
    }
};
