import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, topicTitle, topicMaterial, topicMaterialPdf, activeQuestion } = body;

    // --- השם הרשמי והיציב ביותר שתומך בקריאת קבצים ---
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt = '';

    if (activeQuestion) {
      // 1. מצב תרגול (בדיקה מול מחוון)
      prompt = `
        אתה מורה מומחה להיסטוריה המכין תלמידים לבגרות. התלמיד מתרגל עכשיו וענה על השאלה הבאה:
        השאלה: "${activeQuestion.questionText}"
        
        נקודות חובה לתשובה (המחוון לבדיקה):
        ${activeQuestion.rubric.map((point: string) => `- ${point}`).join('\n')}
        
        תשובת התלמיד: "${message}"

        הוראות לבדיקה:
        1. קרא את תשובת התלמיד והשווה אותה *אך ורק* לנקודות החובה שבמחוון.
        2. פתח בפידבק חיובי ומעודד על מה שהתלמיד כתב נכון (השתמש באימוג'י קל כמו 👍 או 🌟).
        3. אם חסרות נקודות מהמחוון בתשובת התלמיד, הוסף פסקה נעימה שמתחילה ב-"שים לב ש..." או "כדי לקבל את מלוא הנקודות בבגרות, כדאי להוסיף ש..." וציין במדויק את העובדות החסרות מהמחוון.
        4. ענה בצורה תמציתית, ברורה, ולא ארוכה מדי.
        5. אל תמציא עובדות היסטוריות שאינן קשורות למחוון, התמקד רק בבדיקת התשובה.
      `;
    } else {
      // 2. מצב שיחה חופשית
      const historyText = history && history.length > 0 ? history.map((msg: any) => 
        `${msg.role === 'user' ? 'תלמיד' : 'מורה'}: ${msg.content}`
      ).join('\n') : '';

      prompt = `
        אתה מורה פרטי להיסטוריה, תומך ומקצועי, שעוזר לתלמידי תיכון להתכונן לבחינת הבגרות.
        הנושא שעליו אתם מדברים כעת הוא: "${topicTitle || 'היסטוריה'}".
        
        זהו חומר הלימוד הטקסטואלי שיש במערכת:
        ---
        ${topicMaterial || 'אין חומר טקסטואלי.'}
        ---
        
        היסטוריית השיחה עד כה:
        ${historyText}

        השאלה החדשה של התלמיד היא: "${message}"

        הנחיות חובה עבורך:
        1. ענה בעברית ברורה, נעימה ומעודדת.
        2. התבסס קודם כל על חומר הלימוד (הטקסט למעלה ו/או קובץ ה-PDF שמצורף). 
        3. אם המידע לא נמצא בחומרים אלו, מותר לך לענות מתוך הידע הכללי העצום שלך כמורה להיסטוריה, אך ציין בקצרה שהוספת מידע כללי. בשום אופן אל תשאיר את התלמיד ללא תשובה!
        4. אל תיתן את התשובה המלאה מיד - נסה להכווין את התלמיד לחשוב בעצמו אם מדובר בשאלה פתוחה.
        5. היה תמציתי וממוקד.
      `;
    }

    const contents: any[] = [{ role: 'user', parts: [{ text: prompt }] }];

    if (topicMaterialPdf) {
      try {
        const relativePath = topicMaterialPdf.startsWith('/') ? topicMaterialPdf.slice(1) : topicMaterialPdf;
        const filePath = path.join(process.cwd(), 'public', relativePath);
        const fileBuffer = await fs.readFile(filePath);
        
        contents[0].parts.push({
          inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType: "application/pdf"
          }
        });
      } catch (error) {
        console.error('Error reading PDF file:', error);
      }
    }

    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error('Error in API Route:', error);
    return NextResponse.json({ error: error.message || 'שגיאה בעיבוד הבקשה.' }, { status: 500 });
  }
}