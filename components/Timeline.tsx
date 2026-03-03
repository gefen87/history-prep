'use client';

import React from 'react';
import { TimelineEvent } from '../lib/data';

interface TimelineProps {
  events?: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  // אם אין אירועים, לא נציג כלום
  if (!events || events.length === 0) return null;

  return (
    <div className="w-full mb-8 overflow-x-auto pb-6 pt-2" dir="rtl">
      <div className="flex items-start min-w-max px-2">
        {events.map((event, index) => (
          <div key={index} className="relative flex flex-col items-center w-56 group">
            
            {/* הקו המחבר והחץ - העדכון בוצע בשורה הזו כדי למרכז אותם בול! */}
            {index !== events.length - 1 && (
              <div className="absolute top-4 right-1/2 w-full -translate-y-1/2 flex items-center justify-center z-0">
                {/* הפס עצמו */}
                <div className="absolute w-full h-[3px] bg-brand-primary/30 group-hover:bg-brand-primary/60 transition-colors"></div>
                
                {/* חץ SVG אמיתי שיושב באמצע הקו */}
                <svg 
                  className="w-6 h-6 text-brand-primary/50 group-hover:text-brand-primary relative z-10 transition-colors bg-surface-ground rounded-full" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* הנקודה המרכזית על הציר */}
            <div className="w-8 h-8 rounded-full bg-surface-white border-4 border-brand-primary flex items-center justify-center z-10 shadow-sm transition-transform duration-300 group-hover:scale-125">
              <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
            </div>
            
            {/* כרטיסיית התוכן */}
            <div className="mt-6 bg-white p-4 rounded-xl border border-border-subtle shadow-sm text-center w-[90%] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <span className="inline-block px-3 py-1 bg-brand-secondary text-brand-dark font-black rounded-md text-sm mb-3">
                {event.year}
              </span>
              <h4 className="font-bold text-text-main text-base mb-2 leading-tight">{event.title}</h4>
              <p className="text-sm text-text-muted leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}