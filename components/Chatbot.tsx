"use client";

import { useState, useRef, useEffect } from "react";
import { practiceQuestions, PracticeQuestion } from "@/lib/questions";

// פונקציה ליצירת מזהה ייחודי לכל הודעה, מונע את השגיאה האדומה ב-React
const generateId = () => Math.random().toString(36).substring(2, 9);

type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
  imageUrl?: string;
  isOptions?: boolean;
  options?: string[];
};

export default function Chatbot({ topicId }: { topicId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "bot",
      content: "שלום לך!\nאיך אני יכול לעזור לך היום?",
      isOptions: true,
      options: ["אני רוצה לתרגל", "אני רוצה לשאול שאלה"],
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState<PracticeQuestion | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleOptionClick = (option: string) => {
    const newUserMsg: Message = { id: generateId(), role: "user", content: option };
    
    const updatedMessages = messages.map(msg => 
      msg.isOptions ? { ...msg, isOptions: false } : msg
    );

    let nextBotMsg: Message;

    if (option === "אני רוצה לתרגל" || option === "תרגול נוסף") {
      const relevantQuestions = topicId 
        ? practiceQuestions.filter(q => q.topicId === topicId)
        : practiceQuestions;
      
      const targetQuestions = relevantQuestions.length > 0 ? relevantQuestions : practiceQuestions;
      const randomQuestion = targetQuestions[Math.floor(Math.random() * targetQuestions.length)];
      
      setActiveQuestion(randomQuestion);

      let messageContent = `מעולה!\nהנה שאלה (את התשובה יש לכתוב בשורה למטה):\n\n`;
      
      if (randomQuestion.imageUrl) {
        nextBotMsg = {
          id: generateId(),
          role: "bot",
          content: `${messageContent}**${randomQuestion.questionText}**`, 
          imageUrl: randomQuestion.imageUrl, 
        };
      } else {
        if (randomQuestion.sourceText) {
          messageContent += `📜 **קטע מקור:**\n${randomQuestion.sourceText}\n\n`;
        }

        messageContent += `**${randomQuestion.questionText}**`;

        nextBotMsg = {
          id: generateId(),
          role: "bot",
          content: messageContent,
        };
      }

      setIsInputDisabled(false);
    } 
    else {
      nextBotMsg = {
        id: generateId(),
        role: "bot",
        content: option === "חזרה לצ'אט" 
          ? "עברנו למצב צ'אט חופשי. מה תרצה לשאול?" 
          : "כולי אוזן.\nיש לכתוב את השאלה בשורה למטה:",
      };
      setIsInputDisabled(false);
    }

    setMessages([...updatedMessages, newUserMsg, nextBotMsg]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isInputDisabled || isLoading) return;

    const userText = input.trim();
    setInput("");
    
    const newUserMsg: Message = { id: generateId(), role: "user", content: userText };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    let pdfPath = "";
    let currentTopicTitle = "הכנה לבגרות בהיסטוריה";
    
    if (topicId === "second-temple") pdfPath = "/pdfs/heshmonaim.pdf";
    else if (topicId === "nationalism") pdfPath = "/pdfs/nationalism.pdf";
    else if (topicId === "holocaust") pdfPath = "/pdfs/nazism.pdf";
    else if (topicId === "state-building") pdfPath = "/pdfs/1948_onwards.pdf";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userText, 
          activeQuestion: activeQuestion,
          // השינוי החשוב: שולחים רק את 6 ההודעות האחרונות כדי למנוע קריסה מרוב עומס נתונים
          history: messages.slice(-6), 
          topicTitle: currentTopicTitle, 
          topicMaterialPdf: pdfPath 
        }),
      });

      if (!response.ok) {
        // עכשיו אם יש שגיאה, הטרמינל יציג לנו בדיוק למה השרת כועס
        const errorDetails = await response.text();
        console.error("Server Error Details:", errorDetails);
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();

      let nextOptionsMsg: Message | null = null;
      const currentActiveQuestion = activeQuestion;

      if (currentActiveQuestion) {
        setActiveQuestion(null);
        setIsInputDisabled(true); 
        
        nextOptionsMsg = {
          id: generateId(),
          role: "bot",
          content: "איך תרצה להמשיך?",
          isOptions: true,
          options: ["תרגול נוסף", "חזרה לצ'אט"]
        };
      }

      setMessages((prev) => {
        const newMessages = [...prev, { id: generateId(), role: "bot", content: data.reply }];
        if (nextOptionsMsg) newMessages.push(nextOptionsMsg);
        return newMessages;
      });

    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "bot", content: "אופס, נראה שיש תקלה זמנית בחיבור לשרת. אנא נסה שוב." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end" dir="rtl">
        
        {isOpen && (
          <div className="flex flex-col h-[550px] w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-4 transition-all duration-300">
            
            <div className="bg-slate-800 p-4 text-white font-semibold flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                History Prep AI
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#f8fafc]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user" 
                        ? "bg-slate-200 text-slate-900 rounded-tr-none" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none whitespace-pre-wrap"
                    }`}
                  >
                    
                    {msg.imageUrl && (
                      <div 
                        className="relative mb-3 cursor-pointer group rounded-lg overflow-hidden border border-gray-200"
                        onClick={() => setEnlargedImage(msg.imageUrl!)}
                      >
                        <img 
                          src={msg.imageUrl} 
                          alt="מקור חזותי" 
                          className="w-full max-h-40 object-contain object-top transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*([\s\S]*?)\*\*/g, '<span class="text-blue-950 font-semibold">$1</span>') }} />
                    
                    {msg.isOptions && msg.options && (
                      <div className="mt-4 flex flex-col gap-2.5">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className="bg-white text-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-200 border-2 border-slate-800 py-2.5 px-4 rounded-xl text-center font-bold shadow-sm"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none p-4 flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isInputDisabled || isLoading}
                  placeholder={isInputDisabled ? "יש לבחור אפשרות למעלה..." : "הקלד תשובה או שאלה כאן..."}
                  className="w-full bg-gray-100 text-gray-800 rounded-full py-3.5 px-5 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-800 disabled:opacity-60 transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isInputDisabled || isLoading}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 hover:bg-slate-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-all shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-slate-800 hover:bg-slate-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 border-4 border-white"
            aria-label="פתח צ'אטבוט"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </div>

      {enlargedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setEnlargedImage(null)} 
          dir="ltr"
        >
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setEnlargedImage(null);
              }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img 
              src={enlargedImage} 
              alt="מקור מוגדל" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </>
  );
}