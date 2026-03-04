'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, ClipboardCheck } from 'lucide-react';
import { examQuestions } from '../../lib/exams';

export default function ExamPage() {
  const [questions, setQuestions] = useState<any[]>([]);

  const generateExam = () => {
    if (!examQuestions || examQuestions.length === 0) return;
    
    // שליפה אוטומטית של כל הקטגוריות הייחודיות מתוך מאגר השאלות שלך
    const uniqueCategories = Array.from(new Set(examQuestions.map(q => q.category)));
    
    const selectedQuestions = uniqueCategories.map(cat => {
      // סינון שאלות ששייכות לקטגוריה הנוכחית
      const catQuestions = examQuestions.filter(q => q.category === cat);
      // הגרלת שאלה אחת מתוך הקטגוריה
      return catQuestions[Math.floor(Math.random() * catQuestions.length)];
    }).filter(Boolean); // מונע שגיאות אם משהו חסר

    setQuestions(selectedQuestions);
  };

  useEffect(() => {
    generateExam();
  }, []);

  return (
    <main className="min-h-screen bg-[#f9fafb] p-4 sm:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0000a0] font-bold transition-colors"
          >
            <ArrowRight size={20} />
            חזרה למסך הראשי
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-[#0000a0]">
                <ClipboardCheck size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">מחולל בחינה</h1>
                <p className="text-gray-500 font-medium"></p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={generateExam}
                className="flex-1 sm:flex-none bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCw size={18} />
                ערבב מחדש
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((q, index) => (
              <div 
                key={q.id || index} 
                className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#0000a0]/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[11px] font-black text-[#0000a0] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {q.category}
                  </span>
                  <span className="text-gray-300 font-bold text-sm">שאלה {index + 1}</span>
                </div>
                <p className="text-xl text-gray-800 leading-relaxed font-semibold group-hover:text-black transition-colors">
                  {q.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-50 text-center text-gray-400 text-sm font-medium">
            תרגול מקיף • {questions.length} נושאי ליבה • היסטוריה 2026
          </div>
        </div>
      </div>
    </main>
  );
}