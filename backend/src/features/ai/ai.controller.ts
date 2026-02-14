import { Request, Response } from "express";
import { streamChat, isAIAvailable } from "../../services/ai.service.js";

export async function postChat(req: Request, res: Response) {
  try {
    const { messages } = req.body as { messages: { role: string; content: string }[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        status: "error",
        message: "Request body must include messages array with at least one message",
      });
      return;
    }

    const normalized = messages.map((m) => ({
      role: (m.role === "user" || m.role === "assistant" || m.role === "system"
        ? m.role
        : "user") as "user" | "assistant" | "system",
      content: String(m.content ?? ""),
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    for await (const chunk of streamChat(normalized)) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      res.flush?.();
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({
        status: "error",
        message: err.message || "AI request failed",
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
}

export function getStatus(_req: Request, res: Response) {
  res.status(200).json({
    status: "success",
    data: { available: isAIAvailable() },
  });
}
