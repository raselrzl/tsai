'use client';

import { useState, useRef, useEffect } from 'react';
import { CornerRightUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SimpleChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e?: React.FormEvent | React.MouseEvent) {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setPendingMessage(input);
    setInput('');
    setIsLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    if (!response.body) {
      setIsLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      aiResponse += decoder.decode(value);

      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    }

    setPendingMessage(null);
    setIsLoading(false);
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, pendingMessage]);
  

  return (
    <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto flex justify-center flex-col items-center">
      <div className="flex flex-row min-w-full justify-between">
        <Link href="/" className="text-2xl font-extrabold uppercase">Flyg-Chat</Link>
        <p className="bg-gray-50 px-4 py-1 rounded-lg">Login</p>
      </div>

      <div className="mt-20 p-4 rounded-[10px] bg-white shadow-xl w-full max-w-5xl border border-gray-200">
        <div className="text-center">
          <h1 className="text-xl font-bold my-5">Ask whatever you want?</h1>
        </div>

        <div
          ref={chatContainerRef}
          className="max-h-[600px] overflow-y-auto pt-10 pb-4 pr-4 pl-4 sm:pr-12 sm:pl-2 relative"
        >
          {messages.map((msg, index) => (
            <div key={index} className="mb-4 flex flex-col gap-2">
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`${
                    msg.role === 'user' ? 'bg-blue-50' : 'bg-gray-100'
                  } text-black px-4 py-2 rounded-2xl max-w-[80%] sm:max-w-[75%]`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {pendingMessage && (
            <div className="mb-4 flex flex-col gap-2 opacity-70 italic select-none">
              <div className="flex justify-end">
                <div className="bg-blue-100 text-black px-4 py-2 rounded-2xl max-w-[80%] sm:max-w-[75%]">
                  {pendingMessage}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 text-black px-4 py-2 rounded-2xl max-w-[80%] sm:max-w-[75%]">
                  <Loader2 />
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-row items-end bg-gray-50 rounded-2xl px-3 py-2 gap-2"
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              className="w-full resize-none bg-transparent outline-none px-2 py-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gray-200 text-black px-4 py-2 rounded-full disabled:opacity-50 hover:bg-gray-300 size-12"
            >
              {isLoading ? '...' : <CornerRightUp className="pr-1 mr-1" />}
            </button>
          </form>
        </div>
      </div>

      {/* Suggestion area (optional) */}
      {/* <div className="mt-6 max-w-5xl w-full">
        <ul className="flex flex-wrap gap-2 min-h-[2.5rem]">
          {['What is AI?', 'Tell me a joke.', 'Explain quantum computing.'].map((q, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  setInput(q);
                  handleSubmit();
                }}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                disabled={isLoading}
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      </div> */}
    </main>
  );
}
