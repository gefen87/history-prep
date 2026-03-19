"use client";

import { useState } from "react";
import Image from "next/image";
import { Lato } from "next/font/google";

// הגדרת הפונט Lato
const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface FlipCardProps {
  event: {
    year: string;
    title: string;
    imageUrl: string;
    bulletPoints: string[];
    youtubeLink: string;
  };
}

export default function FlipCard({ event }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    // 1. הוספנו cursor-pointer ו-group
    <div 
      className="w-72 h-[400px] perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: "preserve-3d", transition: "transform 0.7s" }}
      >
        
        {/* צד קדמי (Front) */}
        <div 
          className="absolute w-full h-full flex flex-col bg-transparent"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* 1. כותרת עליונה */}
          <h3 className="text-center font-semibold text-gray-800 text-[17px] px-2 mb-0">
            {event.year}: {event.title}
          </h3>

          {/* 2. התמונה - גובה קבוע, גאפ של 4 פיקסלים מהכותרת (mt-1) */}
          {/* הוספנו אפקטי ריחוף על התמונה כרטיסייה: */}
          {/* shadow-md -> shadow-xl (העמקת הצל) */}
          {/* transition-all duration-300 (אנימציה חלקה) */}
          {/* group-hover:-translate-y-2 (תזוזה של 2 פיקסלים למעלה) */}
          <div className="relative w-full h-[280px] rounded-2xl overflow-hidden shadow-md mt-1 bg-white transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
            <Image 
              src={event.imageUrl} 
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover"
            />
          </div>

          {/* 3. טקסט תחתון - גאפ של 4 פיקסלים מהתמונה (mt-1) */}
          {/* הוספנו group-hover:underline כדי שגם הטקסט יגיב לריחוף על הכרטיסייה */}
          <div className="text-left w-full pl-2 mt-1">
            <span className="text-blue-700 text-sm font-medium transition-all group-hover:underline">
              גלה עוד...
            </span>
          </div>
        </div>

        {/* צד אחורי (Back) */}
        <div 
          className="absolute w-full h-full bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col justify-between"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
          <div>
            <h3 className="font-bold text-xl text-gray-800 mb-4 text-center pb-3 border-b border-gray-100">
              {event.year}
            </h3>
            
            {/* רשימה עם יישור שורות מושלם */}
            <ul className={`${lato.className} list-disc list-outside pr-5 text-gray-700 space-y-2.5 text-right`}>
              {event.bulletPoints.map((point, index) => (
                <li 
                  key={index} 
                  className="text-[14px] leading-[20px]" 
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center mt-4">
            <a 
              href={event.youtubeLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
              onClick={(e) => e.stopPropagation()} // מונע מהקליק על הכפתור להפוך את הכרטיסייה חזרה
            >
              לצפייה בסרטון
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}