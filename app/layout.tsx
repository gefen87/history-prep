import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. ייבוא הרכיב של גוגל אנליטיקס (חייב להיות למעלה יחד עם שאר הייבואים)
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // כותרת שתמשוך תלמידים בתוצאות החיפוש
  title: "הכנה לבגרות בהיסטוריה 2026 | סיכומים, תרגול ומורה AI | History Prep",
  
  // תיאור שיווקי שגוגל יציג (חשוב להקליקביליות)
  description: "הצליחו בבגרות בהיסטוריה עם History Prep: סיכומים מדויקים, מחולל שאלות בגרות וצ'אטבוט AI חכם שמלווה אתכם לציון 100. מותאם לנייד ללמידה מכל מקום.",
  
  // האימות של גוגל - רק המחרוזת בתוך הגרשיים
  verification: {
    google: "xQ06qcnm2y3fpUH2RZmo6RsS2NgEPYBXJ78egZvD8LM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // הגדרת שפה לעברית וכיווניות ימין-לשמאל
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      
      {/* 2. הטמעת האנליטיקס עם ה-ID שלך ממש לפני סגירת ה-html */}
      <GoogleAnalytics gaId="G-TK2ZJK375X" />
    </html>
  );
}