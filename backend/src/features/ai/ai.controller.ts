import { Request, Response } from 'express';
import aiService from '../../services/ai.service.js';
import Competition from '../../models/Competition.js';
import Registration from '../../models/Registration.js';
import User from '../../models/User.js';

class AIController {
    /**
     * POST /api/ai/chat
     * Chat with AI assistant
     */
    async chat(req: Request, res: Response) {
        try {
            const { message, conversationHistory } = req.body;

            if (!message) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Message is required'
                });
            }

            // Get user context if authenticated
            let context: any = {};

            if (req.user) {
                try {
                    // Find user in database
                    const user = await User.findOne({ firebaseUID: req.user.uid });

                    if (user) {
                        // Fetch user's registrations
                        const registrations = await Registration.find({ user: user._id })
                            .populate('competition', 'title status')
                            .limit(5);

                        context.registrations = registrations;
                    }

                    // Fetch some available competitions for context
                    const competitions = await Competition.find({
                        status: { $in: ['registration_open', 'ongoing'] }
                    })
                        .populate('category', 'name')
                        .sort({ registeredCount: -1 })
                        .limit(5);

                    context.competitions = competitions;
                } catch (contextError) {
                    console.warn('Failed to fetch context:', contextError);
                    // Continue without context
                }
            }

            // Get AI response
            const aiResponse = await aiService.chat(message, conversationHistory, context);

            res.status(200).json({
                status: 'success',
                data: {
                    message: aiResponse
                }
            });
        } catch (error) {
            console.error('AI chat error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to process AI chat request'
            });
        }
    }

    /**
     * GET /api/ai/quick-actions
     * Get quick action prompts
     */
    async getQuickActions(req: Request, res: Response) {
        try {
            const actions = aiService.getQuickActions();

            res.status(200).json({
                status: 'success',
                data: actions
            });
        } catch (error) {
            console.error('Get quick actions error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch quick actions'
            });
        }
    }
}

export default new AIController();
