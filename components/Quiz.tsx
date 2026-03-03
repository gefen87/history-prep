'use client';

import React, { useState } from 'react';
import { Question } from '../lib/data';

interface QuizProps {
  questions: Question[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // הגנה למקרה שאין עדיין שאלות בנושא הזה
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-lg text-gray-500 italic">שאלות תרגול יתווספו לכאן בקרוב...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // מה קורה כשהתלמיד לוחץ על תשובה
  const handleAnswerClick = (index: number) => {
    if (showFeedback) return; // מונע לחיצה כפולה אחרי שכבר ענו

    setSelectedAnswer(index);
    setShowFeedback(true);

    if (index === currentQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 1); // הוספת נקודה
    }
  };

  // מעבר לשאלה הבאה או סיום
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // אתחול החידון מחדש
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizCompleted(false);
  };

  // --- מסך סיום החידון ---
  if (quizCompleted) {
    return (
      <div className="bg-surface-white p-10 rounded-voog-lg shadow-voog-card text-center border border-border-subtle animate-fade-in">
        <div className="text-7xl mb-6">🏆</div>
        <h3 className="text-3xl font-extrabold text-text-main mb-4">כל הכבוד! סיימת את התרגול</h3>
        <p className="text-2xl mb-8 text-gray-700">
          הציון שלך: <span className="font-bold text-brand-primary text-4xl">{score}</span> מתוך {questions.length}
        </p>
        <button
          onClick={handleRestart}
          className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-1"
        >
          תרגל שוב ↻
        </button>
      </div>
    );
  }

  // --- מסך השאלה הפעילה ---
  return (
    <div className="bg-surface-white p-8 rounded-voog-lg shadow-voog-card border border-border-subtle max-w-3xl mx-auto">
      
      {/* סרגל התקדמות עליון */}
      <div className="flex justify-between items-center mb-8 text-sm text-text-muted font-medium border-b pb-4">
        <span className="bg-gray-100 px-3 py-1 rounded-full">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</span>
        <span className="text-brand-primary font-bold">ניקוד: {score}</span>
      </div>

      {/* טקסט השאלה */}
      <h3 className="text-2xl font-bold text-text-main mb-8 leading-relaxed">
        {currentQuestion.text}
      </h3>

      {/* כפתורי התשובות */}
      <div className="flex flex-col gap-4 mb-8">
        {currentQuestion.options.map((option, index) => {
          // קביעת עיצוב הכפתור לפי המצב (לפני/אחרי בחירה, נכון/לא נכון)
          let buttonClass = "bg-surface-ground border-2 border-border-subtle hover:border-brand-primary hover:bg-blue-50 text-gray-800";
          
          if (showFeedback) {
            if (index === currentQuestion.correctAnswerIndex) {
              buttonClass = "bg-green-100 border-green-500 text-green-800 font-bold shadow-sm"; // תשובה נכונה
            } else if (index === selectedAnswer) {
              buttonClass = "bg-red-50 border-red-400 text-red-600 line-through opacity-80"; // התשובה השגויה שנבחרה
            } else {
              buttonClass = "bg-gray-50 border-gray-100 text-gray-400 opacity-50"; // שאר התשובות
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={showFeedback}
              className={`text-right p-5 rounded-xl transition-all duration-300 ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* אזור המשוב וההסבר הפדגוגי */}
      {showFeedback && (
        <div className="animate-fade-in bg-brand-secondary p-6 rounded-xl border border-brand-primary/20 flex flex-col items-start gap-4">
          <div className="w-full">
            <p className={`font-bold text-xl mb-3 ${selectedAnswer === currentQuestion.correctAnswerIndex ? 'text-green-600' : 'text-red-600'}`}>
              {selectedAnswer === currentQuestion.correctAnswerIndex ? '✨ תשובה נכונה!' : '❌ טעות!'}
            </p>
            <div className="bg-white p-4 rounded-lg border border-white/50 shadow-sm">
              <p className="text-gray-800 leading-relaxed"><span className="font-bold">הסבר: </span>{currentQuestion.explanation}</p>
            </div>
          </div>
          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-sm self-end flex items-center gap-2"
          >
            {currentQuestionIndex < questions.length - 1 ? 'לשאלה הבאה ⬅️' : 'סיים וצפה בציון 🚩'}
          </button>
        </div>
      )}
    </div>
  );
}