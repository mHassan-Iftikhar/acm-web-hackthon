import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with GEMINI_API_KEY or GOOGLE_API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

class AIService {
    /**
     * System prompt that defines the AI assistant's role and context
     */
    private getSystemPrompt(): string {
        return `You are Taakra AI Assistant, a helpful AI assistant for the Taakra competition management platform.

Your role is to help users with:
1. Understanding how to register for competitions
2. Finding suitable competitions based on their interests
3. Explaining competition rules and requirements
4. Navigating the platform features
5. General questions about the platform

Guidelines:
- Be friendly, concise, and helpful
- If asked about specific competitions, provide relevant details
- If you don't have specific information, guide users to the appropriate platform features
- Keep responses under 150 words
- Use emojis sparingly to keep a professional tone
- Always encourage users to check the compete platform for latest updates`;
    }

    /**
     * Generate competition-specific context for the AI
     */
    private generateCompetitionContext(competitions: any[]): string {
        if (!competitions || competitions.length === 0) {
            return '';
        }

        const competitionList = competitions
            .slice(0, 5)
            .map(
                (comp, index) =>
                    `${index + 1}. ${comp.title} - Category: ${comp.category?.name || 'N/A'}, Status: ${comp.status}, Entry Fee: ${comp.entryFee || 0}, Venue: ${comp.venue || 'TBD'}`
            )
            .join('\n');

        return `\n\nCurrent available competitions:\n${competitionList}`;
    }

    /**
     * Generate registration-specific context for the AI
     */
    private generateRegistrationContext(registrations: any[]): string {
        if (!registrations || registrations.length === 0) {
            return '\n\nThe user has no current registrations.';
        }

        const regList = registrations
            .slice(0, 3)
            .map(
                (reg, index) =>
                    `${index + 1}. ${reg.competition?.title || 'Competition'} - Status: ${reg.status}`
            )
            .join('\n');

        return `\n\nUser's current registrations:\n${regList}`;
    }

    /**
     * Chat with AI assistant using Google Gemini
     */
    async chat(
        userMessage: string,
        conversationHistory: ChatMessage[] = [],
        context?: {
            competitions?: any[];
            registrations?: any[];
        }
    ): Promise<string> {
        try {
            if (!apiKey) {
                return 'AI assistant is not configured. Please set GEMINI_API_KEY or GOOGLE_API_KEY in the server environment.';
            }

            // Build system message with context
            let systemPrompt = this.getSystemPrompt();

            if (context?.competitions) {
                systemPrompt += this.generateCompetitionContext(context.competitions);
            }

            if (context?.registrations) {
                systemPrompt += this.generateRegistrationContext(context.registrations);
            }

            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: systemPrompt,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                },
            });

            // Build conversation history for Gemini (user / model roles)
            const history = conversationHistory
                .filter((m) => m.role !== 'system')
                .slice(-6)
                .map((m) => ({
                    role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
                    parts: [{ text: m.content }],
                }));

            const chat = model.startChat({
                history,
            });

            const result = await chat.sendMessage(userMessage);
            const response = result.response;
            const text = response.text();

            return text || 'Sorry, I could not generate a response.';
        } catch (error: any) {
            console.error('AI Service Error:', error);
            if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
                return 'AI service is currently unavailable due to quota limits. Please try again later or contact support.';
            }
            if (error.message?.includes('API key')) {
                return 'AI assistant is not configured. Please set GEMINI_API_KEY or GOOGLE_API_KEY in the server environment.';
            }
            return 'Sorry, I encountered an error. Please try again or contact support if the issue persists.';
        }
    }

    /**
     * Get quick action responses
     */
    getQuickActions(): { label: string; prompt: string }[] {
        return [
            { label: '📋 How to register?', prompt: 'How do I register for a competition?' },
            { label: '🏆 Show trending competitions', prompt: 'What are the trending competitions right now?' },
            { label: '📅 My registrations', prompt: 'Show me my current registrations' },
            { label: '❓ Platform help', prompt: 'How do I use this platform?' },
        ];
    }
}

export default new AIService();
