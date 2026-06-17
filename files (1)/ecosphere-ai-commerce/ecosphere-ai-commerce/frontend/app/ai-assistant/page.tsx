// frontend/app/ai-assistant/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI Shopping Assistant. I can help you find products, compare items, suggest eco-friendly options, and answer questions about sustainability. What are you looking for?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        reasoning: data.reasoning,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const suggestionExamples = [
    'Which laptop is best for AI?',
    'Suggest eco-friendly products',
    'Recommend products under ₹5000',
    'Compare two products',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
      <div className="max-w-2xl mx-auto w-full h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold">AI Shopping Assistant</h1>
            <p className="text-sm text-slate-400">Powered by advanced machine learning</p>
          </div>
          <div className="text-4xl">🤖</div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 1 && (
            <div className="space-y-4">
              <p className="text-center text-slate-400">How can I help you shop today?</p>
              <div className="grid grid-cols-2 gap-3">
                {suggestionExamples.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(suggestion);
                      setTimeout(() => {
                        document.querySelector('form')?.dispatchEvent(
                          new Event('submit', { bubbles: true })
                        );
                      }, 0);
                    }}
                    className="glass p-3 rounded-lg hover:border-green-500/50 transition text-left text-sm"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                    : 'glass'
                }`}
              >
                <p className="text-sm mb-2">{message.content}</p>
                {message.reasoning && message.role === 'assistant' && (
                  <p className="text-xs opacity-70 italic mt-2">
                    💡 {message.reasoning}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="glass rounded-lg p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about products..."
              disabled={loading}
              className="flex-1"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            💡 Tip: Ask about specific products, recommendations, sustainability, or comparisons
          </p>
        </form>
      </div>
    </div>
  );
}
