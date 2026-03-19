"use client";

import { useRef } from "react";
import FlipCard from "./FlipCard"; // הקומפוננטה שיצרנו
import { TimelineEvent } from "@/lib/data"; // מושך את ה-Interface המעודכן מקובץ הנתונים

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative group my-8" dir="rtl">
      
      {/* חץ ימינה (תחילת הציר) - מוסתר בנייד */}
      <div className="hidden md:flex absolute top-0 right-0 h-[400px] w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 items-center justify-center pointer-events-none">
        <button
          onClick={() => scroll("right")}
          className="w-12 h-16 bg-white/80 hover:bg-white shadow-lg rounded-xl flex items-center justify-center pointer-events-auto backdrop-blur-sm transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* חץ שמאלה (המשך הציר) - מוסתר בנייד */}
      <div className="hidden md:flex absolute top-0 left-0 h-[400px] w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 items-center justify-center pointer-events-none">
        <button
          onClick={() => scroll("left")}
          className="w-12 h-16 bg-white/80 hover:bg-white shadow-lg rounded-xl flex items-center justify-center pointer-events-auto backdrop-blur-sm transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* הקונטיינר הנגלל עם הכרטיסיות */}
      <div 
        ref={scrollRef}
        className="flex gap-[44px] overflow-x-auto px-6 md:px-24 pb-8 pt-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {events.map((event) => {
          // רשת הביטחון: בודק אם הנתונים כבר עודכנו למבנה החדש (שיש בולטים והם מערך)
          const isUpdated = Array.isArray(event.bulletPoints);

          if (!isUpdated) {
            return (
              <div key={event.id || event.title} className="snap-center shrink-0 w-72 h-[400px] bg-gray-100 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-center p-4">
                <p className="text-gray-500 font-medium">הכרטיסיות לנושא זה יתעדכנו בקרוב...</p>
              </div>
            );
          }

          return (
            <div key={event.id} className="snap-center shrink-0">
              <FlipCard event={event} />
            </div>
          );
        })}
      </div>

    </div>
  );
}