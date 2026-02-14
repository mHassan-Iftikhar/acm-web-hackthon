import { GoogleGenAI } from "@google/genai";
import Competition from "../models/Competition.js";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

/**
 * Build context string from competition data for RAG.
 */
export async function getCompetitionContext(): Promise<string> {
  const competitions = await Competition.find({ status: { $ne: "draft" } })
    .populate("category", "name icon")
    .sort({ startDate: 1 })
    .limit(30)
    .lean();

  if (competitions.length === 0) {
    return "There are no published competitions at the moment.";
  }

  const lines = competitions.map((c: any) => {
    const cat = c.category;
    const catName = cat?.name ?? "General";
    const start = c.startDate ? new Date(c.startDate).toISOString().slice(0, 10) : "TBD";
    const end = c.endDate ? new Date(c.endDate).toISOString().slice(0, 10) : "TBD";
    const deadline = c.registrationDeadline
      ? new Date(c.registrationDeadline).toISOString().slice(0, 10)
      : "TBD";
    return [
      `- **${c.title}** (ID: ${c._id})`,
      `  Category: ${catName}. Status: ${c.status}.`,
      `  Description: ${(c.shortDescription || c.description || "").slice(0, 300)}...`,
      `  Dates: ${start} to ${end}. Registration deadline: ${deadline}.`,
      `  Venue: ${c.venue}. Max participants: ${c.maxParticipants}, registered: ${c.registeredCount ?? 0}.`,
      `  Entry fee: ${c.entryFee ?? 0}.`,
    ].join("\n");
  });

  return "Current competitions on Taakra:\n\n" + lines.join("\n\n");
}

const SYSTEM_PROMPT_TEMPLATE = `You are the Taakra competition assistant. You help users discover and understand competitions on the Taakra platform. Use ONLY the following competition data to answer questions about competitions, dates, registration, and venues. If the user asks something not covered by this data, say you don't have that information and suggest they browse the Discover or Competitions page. Be concise, friendly, and helpful. Do not make up competition names or details.

--- COMPETITION DATA (use this as your source of truth) ---
{{CONTEXT}}
--- END DATA ---`;

/**
 * Get the system prompt with competition context injected.
 */
export async function getSystemPrompt(): Promise<string> {
  const context = await getCompetitionContext();
  return SYSTEM_PROMPT_TEMPLATE.replace("{{CONTEXT}}", context);
}

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

/**
 * Convert our chat messages to Gemini contents format.
 * Gemini uses "user" and "model" (not "assistant"). System is sent as systemInstruction.
 */
function toGeminiContents(messages: ChatMessage[]): { role: "user" | "model"; parts: { text: string }[] }[] {
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
  for (const m of messages) {
    if (m.role === "system") continue; // handled by systemInstruction
    const role = m.role === "assistant" ? "model" : "user";
    contents.push({ role, parts: [{ text: m.content }] });
  }
  return contents;
}

/**
 * Stream a chat completion with RAG context using Gemini. Yields text deltas.
 */
export async function* streamChat(
  messages: ChatMessage[],
): AsyncGenerator<string, void, unknown> {
  if (!ai) {
    yield "[Taakra AI is not configured. Set GEMINI_API_KEY to enable the assistant.]";
    return;
  }

  const systemPrompt = await getSystemPrompt();
  const contents = toGeminiContents(messages);

  if (contents.length === 0) {
    yield "Please send a message to start the conversation.";
    return;
  }

  try {
    const response = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config: { systemInstruction: systemPrompt },
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (typeof text === "string" && text.length > 0) {
        yield text;
      }
    }
  } catch (err: any) {
    yield `[Error: ${err?.message ?? "AI request failed"}]`;
  }
}

export function isAIAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * Non-streaming chat: collect stream into a single string (for controller use).
 */
export async function chat(
  message: string,
  conversationHistory: ChatMessage[] = [],
  _context?: unknown
): Promise<string> {
  const messages: ChatMessage[] = [
    ...conversationHistory.filter((m) => m.role === "user" || m.role === "assistant"),
    { role: "user", content: message },
  ];
  let result = "";
  for await (const chunk of streamChat(messages)) {
    result += chunk;
  }
  return result;
}

const QUICK_ACTIONS = [
  { label: "Trending now", prompt: "What competitions are trending right now?" },
  { label: "Upcoming", prompt: "Which competitions are coming up soon?" },
  { label: "By category", prompt: "What competition categories do you have?" },
  { label: "How to register", prompt: "How do I register for a competition?" },
];

export function getQuickActions(): { label: string; prompt: string }[] {
  return QUICK_ACTIONS;
}

export default {
  chat,
  getQuickActions,
  getCompetitionContext,
  getSystemPrompt,
  streamChat,
  isAIAvailable,
};
