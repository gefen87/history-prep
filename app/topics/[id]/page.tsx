'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
// ייבוא האייקונים החדשים מ-Lucide
import { FileText, Presentation, PlaySquare, GraduationCap, ArrowRight, Headset, Maximize2 } from 'lucide-react'; 
import { topicsData } from '../../../lib/data';
import Quiz from '../../../components/Quiz';
import Chatbot from '../../../components/Chatbot';
import Timeline from '../../../components/Timeline';

// הגדרת הטאבים עם רכיבי האייקונים הוקטוריים
const TABS = [
  { id: 'material', label: 'חומר כתוב', icon: FileText },
  { id: 'presentations', label: 'מצגות', icon: Presentation },
  { id: 'videos', label: 'סרטונים', icon: PlaySquare },
  { id: 'practice', label: 'תרגול (קהוט)', icon: GraduationCap },
];

export default function TopicPage() {
  const params = useParams();
  const topicId = params?.id as string;
  
  const topic = topicsData[topicId];
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-ground" dir="rtl">
        <h1 className="text-4xl font-bold mb-4 text-text-main">הנושא לא נמצא 😕</h1>
        <Link href="/" className="text-brand-primary hover:underline text-lg">&rarr; חזרה למסך הראשי</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface-ground p-8 dir-rtl relative pb-24" dir="rtl">
      <div className="max-w-5xl mx-auto mt-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-[#0000a0] font-medium transition-colors mb-8"
        >
          <ArrowRight size={20} />
          חזרה למסך הראשי
        </Link>
        
        <h1 className="text-4xl font-extrabold text-text-main mb-6">
          {topic.title}
        </h1>

        <Timeline events={topic.timeline || []} />

        <div className="bg-surface-white rounded-voog-lg shadow-voog-card border border-border-subtle overflow-hidden relative z-10">
          
          {/* תפריט הטאבים המעודכן */}
          <div className="flex overflow-x-auto whitespace-nowrap border-b border-border-subtle bg-gray-50/50 scrollbar-hide">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 shrink-0 py-4 px-6 text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200 border-b-4 ${
                    isActive 
                      ? 'bg-white border-[#0000a0]' 
                      : 'border-transparent text-text-muted hover:text-text-main hover:bg-gray-100'
                  }`}
                  style={{ color: isActive ? '#0000a0' : undefined }}
                >
                  <IconComponent size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-8 min-h-[400px]">
            
            {/* --- חומר כתוב --- */}
            {activeTab === 'material' && (
              <div className="animate-fade-in flex flex-col gap-6">
                
                {/* נגן פודקאסט מעודכן */}
                {topic.audioUrl && (
                  <div className="bg-blue-50/50 border border-[#0000a0]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm transition-all hover:shadow-md">
                    <div className="bg-[#0000a0] text-white w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <Headset size={28} />
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-bold text-[#0000a0] mb-3 text-lg">האזן לסיכום (פודקאסט)</h3>
                      <audio controls className="w-full h-11 outline-none rounded-lg">
                        <source src={topic.audioUrl} type="audio/mp4" />
                        <source src={topic.audioUrl} type="audio/mpeg" />
                        הדפדפן שלך אינו תומך בנגן השמע.
                      </audio>
                    </div>
                  </div>
                )}

                {topic.material && (
                  <p className="text-lg leading-relaxed text-gray-800">{topic.material}</p>
                )}
                
                {topic.materialPdf && (
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex justify-end">
                      <a 
                        href={topic.materialPdf} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-brand-secondary text-brand-dark hover:bg-[#0000a0] hover:text-white font-semibold py-2 px-5 rounded-voog-base transition-colors shadow-sm"
                      >
                        <Maximize2 size={18} />
                        <span>פתח במסך מלא</span>
                      </a>
                    </div>
                    <div className="w-full h-[600px] border border-border-subtle rounded-lg overflow-hidden shadow-sm">
                      <iframe 
                        src={topic.materialPdf} 
                        className="w-full h-full" 
                        title="סיכום חומר כתוב PDF"
                      ></iframe>
                    </div>
                  </div>
                )}
                
                {!topic.material && !topic.materialPdf && !topic.audioUrl && (
                  <p className="text-text-muted italic">החומר הכתוב יעודכן בקרוב...</p>
                )}
              </div>
            )}

            {/* --- מצגות --- */}
            {activeTab === 'presentations' && (
              <div className="animate-fade-in flex flex-col gap-8">
                {topic.presentations.length > 0 ? (
                  topic.presentations.map((url, index) => (
                    <div key={index} className="flex flex-col gap-3">
                      {url.endsWith('.pdf') && (
                        <div className="flex justify-end">
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-brand-secondary text-brand-dark hover:bg-[#0000a0] hover:text-white font-semibold py-2 px-5 rounded-voog-base transition-colors shadow-sm"
                          >
                            <Maximize2 size={18} />
                            <span>פתח במסך מלא</span>
                          </a>
                        </div>
                      )}
                      <div className="w-full h-[600px]">
                        <iframe 
                          src={url} 
                          className="w-full h-full rounded-lg shadow-sm border border-border-subtle" 
                          allowFullScreen
                          title={`מצגת או קובץ ${index + 1}`}
                        ></iframe>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-text-muted italic">אין עדיין מצגות בנושא זה.</p>
                )}
              </div>
            )}

            {/* --- סרטונים --- */}
            {activeTab === 'videos' && (
              <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                {topic.videos.length > 0 ? (
                  topic.videos.map((videoId, index) => (
                    <div key={index} className="aspect-video w-full">
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}`} 
                        title="YouTube video player" 
                        className="w-full h-full rounded-lg shadow-sm border border-border-subtle"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))
                ) : (
                  <p className="text-text-muted italic">אין עדיין סרטונים בנושא זה.</p>
                )}
              </div>
            )}

            {/* --- תרגול --- */}
            {activeTab === 'practice' && (
              <div className="animate-fade-in py-4">
                <Quiz questions={topic.practice} />
              </div>
            )}

          </div>
        </div>
      </div>

      <Chatbot 
        topicId={topic.id} 
        topicTitle={topic.title} 
        topicMaterial={topic.material} 
        topicMaterialPdf={topic.materialPdf} 
      />
      
    </main>
  );
}