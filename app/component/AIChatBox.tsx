/* "use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

interface AIChatboxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIchatBox({ open, onClose }: AIChatboxProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
    });

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-2 xl:right-36",
        open ? "fixed" : "hidden"
      )}
    >
      <Button onClick={onClose}>Close</Button>
      <div className="flex flex-col h-[600px] bg-gray-200 border-2 rounded shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && !isLoading && (
            <p className="text-gray-500 text-center">
              No messages yet. Ask me anything!
            </p>
          )}
          {messages.map((message, idx) => (
            <ChatMessage message={message} key={message.id ?? idx} />
          ))}

          {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
          {error && (
            <pre className="text-sm text-red-500 whitespace-pre-wrap">
              {JSON.stringify(error, null, 2)}
            </pre>
          )}
        </div>

        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: { role: string; content: string };
}) {
  const isUser = role === "user";

  return (
    <div className={cn("p-2 rounded", isUser ? "bg-white" : "bg-blue-100")}>
      <div className="text-xs text-gray-500 mb-1 font-bold">
        {isUser ? "User" : "AI"}
      </div>
      <div className="whitespace-pre-wrap text-sm">{content}</div>
    </div>
  );
}
 */

'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AIChatboxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIchatBox({ open, onClose }: AIChatboxProps) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message or pending update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, pendingMessage]);

  async function handleSubmit(e?: React.FormEvent | React.MouseEvent) {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setPendingMessage(""); // Start empty assistant response
    setInput("");
    setIsLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    if (!response.body) {
      setIsLoading(false);
      setPendingMessage(null);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      aiResponse += decoder.decode(value);
      setPendingMessage(aiResponse);
    }

    // Add the finished AI response to messages
    setMessages((prev) => [...newMessages, { role: "system", content: aiResponse }]);
    setPendingMessage(null);
    setIsLoading(false);
  }

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-2 xl:right-36",
        open ? "fixed" : "hidden"
      )}
    >
      <Button onClick={onClose}>Close</Button>
      <div className="flex flex-col h-[600px] bg-gray-200 border-2 rounded shadow-lg">
        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && !isLoading && (
            <p className="text-gray-500 text-center">No messages yet. Ask me anything!</p>
          )}
          {messages.map((message, idx) => (
            <ChatMessage message={message} key={idx} />
          ))}

          {pendingMessage !== null && (
            <ChatMessage message={{ role: "system", content: pendingMessage }} />
          )}

          {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything"
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: { role: string; content: string };
}) {
  const isUser = role === "user";

  return (
    <div className={cn("p-2 rounded", isUser ? "bg-white" : "bg-blue-100")}>
      <div className="text-xs text-gray-500 mb-1 font-bold">{isUser ? "User" : "AI"}</div>
      <div className="whitespace-pre-wrap text-sm">{content}</div>
    </div>
  );
}
