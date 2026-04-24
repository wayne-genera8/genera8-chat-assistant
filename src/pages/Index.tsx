import { useState, useEffect, useRef, useCallback } from "react";

const API_ENDPOINT = "https://mpbgzczhgwiplojqsaiy.supabase.co/functions/v1/chat";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wYmd6Y3poZ3dpcGxvanFzYWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTczMTgsImV4cCI6MjA5MTAzMzMxOH0.lu8NqnXwhtlLZXUu5x7TwfqLQv7QjMVh7c1dEX5Pu6I";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface VisitorInfo {
  name: string;
  dealer: string;
  country: string;
  variant: string;
  lang: "en" | "es";
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [visitor, setVisitor] = useState<VisitorInfo>({ name: "", dealer: "", country: "", variant: "" });
  const [product, setProduct] = useState("lotmanager");
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSentInitial = useRef(false);

  // Sanitize URL param: strip control chars, limit length
  const sanitizeParam = (value: string | null, maxLength = 100): string => {
    if (!value) return "";
    return value.replace(/[^\w\s.,'&-]/g, "").trim().slice(0, maxLength);
  };

  const sanitizeSlug = (value: string | null): string => {
    if (!value) return "lotmanager";
    const cleaned = value.replace(/[^a-z0-9_-]/gi, "").slice(0, 50).toLowerCase();
    return cleaned || "lotmanager";
  };

  // Read URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v: VisitorInfo = {
      name: sanitizeParam(params.get("name")),
      dealer: sanitizeParam(params.get("company") || params.get("dealer")),
      country: sanitizeParam(params.get("country")),
      variant: sanitizeParam(params.get("variant"), 20),
    };
    setVisitor(v);
    setProduct(sanitizeSlug(params.get("product")));
    setHasAccess(Boolean(v.dealer || v.variant || v.name));
    setAccessChecked(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping, scrollToBottom]);

  const sendToAPI = useCallback(
    async (allMessages: Message[]) => {
      setIsStreaming(true);
      setShowTyping(true);

      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
            sessionId,
            product,
            visitor,
          }),
        });

        if (!response.ok || !response.body) throw new Error("Network error");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "content_block_delta" && data.delta?.text) {
                  if (showTyping) setShowTyping(false);
                  assistantText += data.delta.text;
                  setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last?.role === "assistant") {
                      return [...prev.slice(0, -1), { role: "assistant", content: assistantText }];
                    }
                    return [...prev, { role: "assistant", content: assistantText }];
                  });
                }
              } catch {
                // skip
              }
            }
          }
        }
      } catch {
        setShowTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I'm having a connection issue. Please refresh and try again." },
        ]);
      } finally {
        setIsStreaming(false);
        setShowTyping(false);
        inputRef.current?.focus();
      }
    },
    [sessionId, product, visitor, showTyping]
  );

  // Auto-send initial message
  useEffect(() => {
    if (!accessChecked || !hasAccess) return;
    if (hasSentInitial.current) return;
    hasSentInitial.current = true;

    const channel = visitor.variant.toLowerCase().startsWith("web") ? "SMS" : "email";
    let initialContent = `Hi, I clicked through from the ${channel} about LotManager.`;
    if (visitor.name && visitor.dealer) {
      initialContent = `Hi, I'm ${visitor.name} from ${visitor.dealer}. I clicked through from the ${channel} about LotManager.`;
    } else if (visitor.dealer) {
      initialContent = `Hi, I'm from ${visitor.dealer}. I clicked through from the ${channel} about LotManager.`;
    } else if (visitor.name) {
      initialContent = `Hi, I'm ${visitor.name}. I clicked through from the ${channel} about LotManager.`;
    }

    // Don't add to visible messages — send silently
    const hiddenMessages: Message[] = [{ role: "user", content: initialContent }];
    sendToAPI(hiddenMessages);
  }, [visitor, product, sendToAPI, accessChecked, hasAccess]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    sendToAPI(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!accessChecked) return null;

  if (!hasAccess) {
    return (
      <div
        className="flex flex-col items-center justify-center h-dvh px-6"
        style={{ background: "#141414" }}
      >
        <div className="w-full max-w-[400px] text-center">
          <div className="flex items-center justify-center mb-8">
            <span className="text-2xl mr-1.5">⚡</span>
            <span className="font-bold text-lg" style={{ color: "#36F085" }}>
              LotManager
            </span>
            <span className="ml-1.5 text-sm" style={{ color: "#888" }}>
              by Genera8
            </span>
          </div>
          <h1 className="text-xl font-semibold mb-3" style={{ color: "#f0f0f0" }}>
            Invalid access
          </h1>
          <p className="text-sm" style={{ color: "#888" }}>
            This chat requires a valid invitation link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh max-w-[600px] mx-auto" style={{ background: "#141414" }}>
      {/* Header */}
      <header
        className="flex items-center px-5 shrink-0"
        style={{ height: 56, borderBottom: "1px solid #2a2a2a" }}
      >
        <span className="text-lg mr-1.5">⚡</span>
        <span className="font-bold text-[15px]" style={{ color: "#36F085" }}>
          LotManager
        </span>
        <span className="ml-1.5 text-[13px]" style={{ color: "#888" }}>
          by Genera8
        </span>
      </header>

      {/* Headline */}
      {visitor.dealer && (
        <div className="px-5 py-5 shrink-0">
          <h1 className="text-xl font-semibold" style={{ color: "#f0f0f0" }}>
            Hi {visitor.dealer} — let's talk LotManager
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#888" }}>
            Ask me anything — I'll answer honestly and we can book a demo if it makes sense.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap"
              style={
                msg.role === "assistant"
                  ? {
                      background: "#1e1e1e",
                      border: "1px solid #2a2a2a",
                      borderRadius: "16px 16px 16px 4px",
                      color: "#f0f0f0",
                    }
                  : {
                      background: "#36F085",
                      color: "#141414",
                      borderRadius: "16px 16px 4px 16px",
                    }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {showTyping && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-1 px-4 py-3"
              style={{
                background: "#1e1e1e",
                border: "1px solid #2a2a2a",
                borderRadius: "16px 16px 16px 4px",
              }}
            >
              <span className="typing-dot w-2 h-2 rounded-full" style={{ background: "#36F085" }} />
              <span className="typing-dot w-2 h-2 rounded-full" style={{ background: "#36F085" }} />
              <span className="typing-dot w-2 h-2 rounded-full" style={{ background: "#36F085" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="shrink-0 flex items-center gap-3 px-5 py-4"
        style={{ background: "#1a1a1a", borderTop: "1px solid #2a2a2a" }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground px-4 py-3"
          style={{
            background: "#141414",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            color: "#f0f0f0",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#36F085")}
          onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          className="text-[15px] font-semibold px-5 py-3 transition-opacity"
          style={{
            background: "#36F085",
            color: "#141414",
            borderRadius: 12,
            opacity: !input.trim() || isStreaming ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Index;
