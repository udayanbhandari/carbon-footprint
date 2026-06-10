import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { useChat } from '../../hooks/useChat';
import { CHAT_SUGGESTIONS } from '../../data/carbonData';

function TypingIndicator() {
  return (
    <div className="flex gap-2 animate-slide-up self-start bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft" role="status" aria-label="Assistant is typing">
      <span className="sr-only">Assistant is typing</span>
      <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-75" />
      <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-150" />
    </div>
  );
}

export function ChatView() {
  const { messages, isTyping, send, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    send(input);
    setInput('');
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="flex-shrink-0 px-6 py-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Carbon Assistant</h1>
          <p className="text-sm text-gray-500">Ask anything about your carbon footprint</p>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={clearMessages}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 min-h-[44px]"
            aria-label="Clear chat history"
          >
            Clear
          </button>
        )}
      </header>

      <div 
        role="log" 
        aria-live="polite" 
        aria-label="Chat conversation" 
        aria-relevant="additions"
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="text-center mt-10 animate-fade-in">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              <span aria-hidden="true">🌱</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hello! I'm your free carbon guide 👋</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              I can help you understand your footprint, find ways to reduce emissions, and explain climate science.
            </p>
            
            <div role="group" aria-label="Suggested questions" className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {CHAT_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  aria-label={`Ask: ${s}`}
                  onClick={() => { send(s); inputRef.current?.focus(); }}
                  className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:border-brand-500 hover:text-brand-600 transition-colors shadow-sm min-h-[44px]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={msg.id} 
              role="article" 
              aria-label={isUser ? 'Your message' : 'Assistant response'}
              className={clsx(
                'flex flex-col max-w-[85%] animate-slide-up',
                isUser ? 'self-end items-end' : 'self-start items-start'
              )}
            >
              <div className={clsx(
                'px-5 py-3.5 shadow-soft',
                isUser 
                  ? 'bg-brand-600 text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm prose prose-sm prose-indigo max-w-none'
              )}>
                {isUser ? (
                  msg.content
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
              <time dateTime={msg.timestamp.toISOString()} className="text-[10px] text-gray-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </time>
            </div>
          );
        })}
        
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} className="h-1" />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 relative z-10">
        <form onSubmit={handleSubmit} aria-label="Send a message" className="max-w-4xl mx-auto flex gap-3">
          <label htmlFor="chat-input" className="sr-only">Type your carbon question</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            aria-label="Your question"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask about your carbon footprint..."
            className="flex-1 min-h-[44px] max-h-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="btn-primary flex-shrink-0 h-11 px-5 bg-brand-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors shadow-glow flex items-center justify-center"
          >
            <span className="sr-only">Send</span>
            <span aria-hidden="true" className="text-lg">↑</span>
          </button>
        </form>
      </div>
    </div>
  );
}
