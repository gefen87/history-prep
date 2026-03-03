import Link from 'next/link';
import { topicsData } from '../lib/data';

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-ground p-4 sm:p-8 dir-rtl" dir="rtl">
      <div className="max-w-5xl mx-auto mt-8 sm:mt-12">
        
        {/* --- אזור הפתיחה (Hero) עם כפתור המחולל --- */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-text-main mb-6 tracking-tight">
            הכנה לבגרות <span className="text-brand-primary">בהיסטוריה</span>
          </h1>
          <p className="text-xl text-text-muted mb-8 leading-relaxed">
            כל החומר למיקוד, מצגות, סיכומים ותרגולים אינטראקטיביים שיעזרו לכם להגיע מוכנים.
          </p>
          
          {/* הכפתור החדש למחולל הבחינות! */}
          <Link 
            href="/exam" 
            className="inline-flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-dark text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="text-2xl">📝</span>
            מחולל בחינות (סימולטור)
          </Link>
        </div>

        {/* --- רשימת נושאי הלימוד --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {Object.values(topicsData).map((topic) => (
            <Link 
              key={topic.id} 
              href={`/topics/${topic.id}`} 
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-border-subtle group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                  {topic.title}
                </h2>
                <span className="text-brand-primary/50 group-hover:text-brand-primary transition-colors text-2xl">
                  &larr;
                </span>
              </div>
              <p className="text-text-muted">לחץ לכניסה לחומרי הלימוד, סיכומים, ציר זמן ותרגול.</p>
            </Link>
          ))}
        </div>
        
      </div>
    </main>
  );
}