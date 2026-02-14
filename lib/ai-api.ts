const API_BASE =
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function getAiStatus(): Promise<{ available: boolean }> {
  const res = await fetch(`${API_BASE}/ai/status`);
  if (!res.ok) return { available: false };
  const data = await res.json();
  return { available: data?.data?.available ?? false };
}

/**
 * Stream a chat completion. Calls onChunk for each content delta and onDone when stream ends.
 * idToken is optional; when provided (signed-in user), the request includes Authorization header.
 */
export async function streamChat(
  messages: ChatMessage[],
  idToken: string | null,
  callbacks: {
    onChunk: (content: string) => void;
    onDone: () => void;
    onError: (message: string) => void;
  },
): Promise<void> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (idToken) {
      headers.Authorization = `Bearer ${idToken}`;
    }
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      callbacks.onError(err?.message || `Request failed: ${res.status}`);
      callbacks.onDone();
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      callbacks.onError("No response body");
      callbacks.onDone();
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const payload = line.slice(6);
          if (payload === "[DONE]") {
            callbacks.onDone();
            return;
          }
          try {
            const data = JSON.parse(payload);
            if (data.content) callbacks.onChunk(data.content);
            if (data.error) callbacks.onError(data.error);
          } catch {
            // ignore parse errors for non-JSON lines
          }
        }
      }
    }

    if (buffer.startsWith("data: ")) {
      const payload = buffer.slice(6);
      if (payload !== "[DONE]") {
        try {
          const data = JSON.parse(payload);
          if (data.content) callbacks.onChunk(data.content);
        } catch {
          // ignore
        }
      }
    }
    callbacks.onDone();
  } catch (e: any) {
    callbacks.onError(e?.message || "Network error");
    callbacks.onDone();
  }
}
