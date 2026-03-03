'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  topicId: string;
  topicTitle: string;
  topicMaterial: string;
  topicMaterialPdf?: string;
}

export default function Chatbot({ topicId, topicTitle, topicMaterial, topicMaterialPdf }: ChatbotProps) {
  const storageKey = `chat-history-${topicId}`;
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: `שלום! אני מורה ה-AI שלך לנושא "${topicTitle}". קראתי את החומר. מה תרצה לשאול?` }]);
    }
  }, [storageKey, topicTitle]);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, storageKey, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    const currentHistory = [...messages];
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: currentHistory,
          topicTitle,
          topicMaterial,
          topicMaterialPdf
        }),
      });

      if (!response.ok) throw new Error('שגיאה בתקשורת');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'מצטער, הייתה לי שגיאה טכנית. נסה שוב.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end dir-rtl" dir="rtl">
      
      {/* --- חלון הצ'אט (פתוח) --- */}
      {isOpen && (
        <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle flex flex-col w-[350px] sm:w-[400px] h-[550px] mb-4 overflow-hidden animate-fade-in origin-bottom-right">
          
          <div className="bg-brand-primary text-white p-4 font-bold flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span>מורה AI</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { sessionStorage.removeItem(storageKey); setMessages([{ role: 'assistant', content: `התחלנו מחדש. מה תרצה לשאול?` }]); }}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
              >
                נקה שיחה
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors text-xl font-bold px-1"
                aria-label="סגור צ'אט"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50 text-sm sm:text-base">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[85%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-brand-secondary text-brand-dark self-start rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 self-end rounded-tl-none shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="self-end bg-white border border-gray-200 text-gray-500 p-3 rounded-lg rounded-tl-none shadow-sm flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="שאל על החומר..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-brand-primary hover:bg-brand-dark disabled:bg-gray-300 text-white px-4 rounded-lg font-bold transition-colors"
            >
              שלח
            </button>
          </form>
        </div>
      )}

      {/* --- הכפתור המרחף (סגור) - העדכון בוצע כאן! --- */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center gap-1 bg-[#001A40] hover:bg-[#002866] text-white rounded-full w-20 h-20 shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 border-2 border-white/10"
        >
          {/* המרת ה-Emoji לאייקון SVG עם 3 נקודות כפי שביקשת (בסטייל Voog/Saved Info) */}
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="mb-1"
          >
            {/* רקע בועת הדיבור (לבן) */}
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04349 16.4525C2.22946 18.3833 2.01928 19.3366 2.00224 20.0152C1.9852 20.6938 2.3062 21.0148 2.9848 20.9978C3.6634 20.9807 4.6167 20.7705 6.5475 19.9565C7.88842 20.6244 9.40026 21 12 21C17.5228 21 22 16.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="white"/>
            {/* שלוש נקודות (בצבע הרקע של הכפתור כדי שייראו שקופות, כפי שמופיע בתמונה שלך) */}
            <circle cx="8" cy="12" r="1.5" fill="#001A40"/>
            <circle cx="12" cy="12" r="1.5" fill="#001A40"/>
            <circle cx="16" cy="12" r="1.5" fill="#001A40"/>
          </svg>
          
          <span className="font-bold text-sm">מורה AI</span>
        </button>
      )}

    </div>
  );
}