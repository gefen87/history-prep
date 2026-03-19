import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. ייבוא הרכיב של גוגל אנליטיקס
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

// 2. הגדרת אובייקט הסכמה (Schema) לקידום בגוגל
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://history-prep.vercel.app/#website",
      "url": "https://history-prep.vercel.app/",
      "name": "History-Prep",
      "description": "פלטפורמה אינטראקטיבית לתרגול והכנה למבחנים בהיסטוריה. לימוד באמצעות צירי זמן, סיכומים ושאלות תרגול.",
      "inLanguage": "he"
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://history-prep.vercel.app/#organization",
      "name": "History-Prep",
      "url": "https://history-prep.vercel.app/",
      "founder": {
        "@type": "Person",
        "name": "Nadav Gefen",
        "jobTitle": "מייסד ומפתח",
        "description": "מורה להיסטוריה בעבר ובעל תואר שני בהיסטוריה.",
        "sameAs": [
          "https://www.linkedin.com/in/nadav-gefen"
        ]
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // הגדרת שפה לעברית וכיווניות ימין-לשמאל
    <html lang="he" dir="rtl">
      {/* 3. הוספת תגית head מפורשת עבור הסכמה */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* 4. האנליטיקס בתוך ה-body */}
        <GoogleAnalytics gaId="G-TK2ZJK375X" />
      </body>
    </html>
  );
}