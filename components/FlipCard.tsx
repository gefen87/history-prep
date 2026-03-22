"use client";

import { useState } from "react";
import Image from "next/image";
import { Lato } from "next/font/google";

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
  // הוספנו את המאפיין החדש:
  priority?: boolean;
}

// קיבלנו את ה-priority כפרופ
export default function FlipCard({ event, priority = false }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-72 h-[400px] perspective-1000 cursor-pointer group/card"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: "preserve-3d", transition: "transform 0.7s" }}
      >
        
        {/* צד קדמי */}
        <div 
          className="absolute w-full h-full flex flex-col bg-transparent"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="text-center font-semibold text-gray-800 text-[17px] px-2 mb-0">
            {event.year}: {event.title}
          </h3>

          <div className="relative w-full h-[280px] rounded-2xl overflow-hidden shadow-md mt-1 bg-white transition-all duration-300 group-hover/card:shadow-xl group-hover/card:-translate-y-2">
            <Image 
              src={event.imageUrl} 
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover"
              priority={priority} // כאן אנחנו אומרים ל-Next.js אם התמונה הזו קריטית לטעינה הראשונית
            />
          </div>

          <div className="text-left w-full pl-2 mt-1">
            <span className="text-blue-700 text-sm font-medium transition-all group-hover/card:underline">
              גלה עוד...
            </span>
          </div>
        </div>

        {/* צד אחורי */}
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
            
            <ul className={`${lato.className} list-disc list-outside pr-5 text-gray-700 space-y-2.5 text-right`}>
              {event.bulletPoints.map((point, index) => (
                <li key={index} className="text-[14px] leading-[20px]">
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
              onClick={(e) => e.stopPropagation()} 
            >
              לצפייה בסרטון
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}