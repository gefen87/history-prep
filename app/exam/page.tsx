'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { examQuestions, OpenQuestion } from '../../lib/exams';

export default function ExamGeneratorPage() {
  const [generatedExam, setGeneratedExam] = useState<OpenQuestion[]>([]);

  // פונקציה לבניית מבחן אקראי חדש
  const generateNewExam = () => {
    // מוציאים את רשימת הקטגוריות הייחודיות (4 נושאים)
    const categories = Array.from(new Set(examQuestions.map(q => q.category)));
    
    const newExam: OpenQuestion[] = [];
    
    // עבור כל קטגוריה, נשלוף שאלה אחת באקראי
    categories.forEach(category => {
      const questionsInCategory = examQuestions.filter(q => q.category === category);
      const randomIndex = Math.floor(Math.random() * questionsInCategory.length);
      newExam.push(questionsInCategory[randomIndex]);
    });

    setGeneratedExam(newExam);
  };

  // מפעילים את המחולל בפעם הראשונה כשהדף עולה
  useEffect(() => {
    generateNewExam();
  }, []);

  if (generatedExam.length === 0) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl">מייצר טופס בחינה...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8 dir-rtl" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* סרגל כלים עליון (לא מודפס) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden gap-4">
          <Link href="/" className="text-brand-primary hover:underline font-bold">
            &rarr; חזרה למסך הראשי
          </Link>
          <div className="flex gap-3">
            <button 
              onClick={generateNewExam}
              className="bg-brand-secondary text-brand-dark hover:bg-blue-200 font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
            >
              🔄 ערבב מבחן מחדש
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              🖨️ הדפס מבחן
            </button>
          </div>
        </div>

        {/* טופס המבחן (זה מה שיודפס) */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl print:shadow-none print:p-0">
          
          <div className="text-center mb-10 border-b-2 border-gray-800 pb-6">
            <h1 className="text-4xl font-black text-gray-900 mb-2">מתכונת בהיסטוריה</h1>
            <h2 className="text-xl text-gray-600">שאלות פתוחות מתוך מאגר בחינות הבגרות</h2>
            <div className="mt-6 flex justify-between text-lg text-gray-800 font-medium">
              <span>שם התלמיד/ה: __________________</span>
              <span>תאריך: __________________</span>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            {generatedExam.map((question, index) => (
              <div key={question.id} className="break-inside-avoid">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded-full">
                    פרק {index + 1}: {question.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                  {index + 1}. {question.text}
                </h3>
                
                {/* שורות ריקות לכתיבת התשובה (מצוין להדפסה) */}
                <div className="flex flex-col gap-6 opacity-30">
                  <hr className="border-gray-400 border-dashed" />
                  <hr className="border-gray-400 border-dashed" />
                  <hr className="border-gray-400 border-dashed" />
                  <hr className="border-gray-400 border-dashed" />
                  <hr className="border-gray-400 border-dashed" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16 pt-8 border-t border-gray-300 text-gray-500 print:block hidden">
            בהצלחה! מיוצר על ידי מחולל הבחינות של מורה AI.
          </div>

        </div>
      </div>
    </main>
  );
}