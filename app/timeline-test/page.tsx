"use client";

import { useRef } from "react";
import FlipCard from "@/components/FlipCard";
import { timelineEvents } from "@/app/data/timelineEvents"; // ודא שזה הנתיב הנכון אצלך

export default function TimelineTestPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center" dir="rtl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">בדיקת כרטיסיות ציר זמן</h1>
        <p className="text-gray-600">גלול ימינה ושמאלה או השתמש בחיצים כדי לראות את כל האירועים.</p>
      </div>
      
      {/* אזור הסליידר */}
      <div className="w-full max-w-7xl mx-auto relative group">
        
        {/* חץ ימינה (תחילת הציר) - מוסתר בנייד, ממורכז באזור השקוף */}
        <div className="hidden md:flex absolute top-0 right-0 h-[384px] w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 items-center justify-center pointer-events-none">
          <button
            onClick={() => scroll("right")}
            className="w-12 h-16 bg-white/80 hover:bg-white shadow-lg rounded-xl flex items-center justify-center pointer-events-auto backdrop-blur-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* חץ שמאלה (סוף הציר) - מוסתר בנייד, ממורכז באזור השקוף */}
        <div className="hidden md:flex absolute top-0 left-0 h-[384px] w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 items-center justify-center pointer-events-none">
          <button
            onClick={() => scroll("left")}
            className="w-12 h-16 bg-white/80 hover:bg-white shadow-lg rounded-xl flex items-center justify-center pointer-events-auto backdrop-blur-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

       {/* הקונטיינר הנגלל - שינינו לרווח של 44 פיקסלים בדיוק */}
        <div 
          ref={scrollRef}
          className="flex gap-[44px] overflow-x-auto px-6 md:px-24 pb-8 pt-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {timelineEvents.map((event) => (
            <div key={event.id} className="snap-center shrink-0">
              <FlipCard event={event} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}