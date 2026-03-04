'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Landmark, Map, ShieldAlert, FileText, ArrowLeft } from 'lucide-react';
import { topicsData } from '../lib/data';

export default function Dashboard() {
  const topicIcons: Record<string, React.ElementType> = {
    'nationalism': BookOpen,
    'second-temple': Landmark,
    'building-state': Map,
    'totalitarianism': ShieldAlert,
  };

  return (
    <main className="min-h-screen bg-surface-ground p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">
            הכנה לבגרות <span className="text-[#0000a0]">בהיסטוריה</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            כל החומר למיקוד, מצגות, סיכומים ותרגולים אינטראקטיביים שיעזרו לכם להגיע מוכנים.
          </p>
          
          {/* הקישור המעודכן לנתיב הקיים בתיקיות שלך */}
          <Link href="/exam">
            <button className="mt-10 bg-[#0000a0] hover:bg-[#000080] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-3 mx-auto transition-transform hover:scale-105">
              <FileText size={22} />
              מחולל בחינות (סימולטור)
            </button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(topicsData).map((topic) => {
            let Icon = topicIcons[topic.id];
            if (!Icon) {
              if (topic.id.includes('building')) Icon = Map;
              else Icon = BookOpen;
            }
            
            return (
              <Link 
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="group bg-white rounded-3xl p-8 border border-border-subtle shadow-voog-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-[#0000a0] group-hover:bg-[#0000a0] group-hover:text-white transition-colors">
                      <Icon size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#0000a0] transition-colors">
                      {topic.title}
                    </h2>
                  </div>
                  <p className="text-text-muted leading-relaxed">
                    לחץ לכניסה לחומרי הלימוד, סיכומים, ציר זמן ותרגול.
                  </p>
                </div>
                <div className="text-[#0000a0] opacity-30 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <ArrowLeft size={28} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}