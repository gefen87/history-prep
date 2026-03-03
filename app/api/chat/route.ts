import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, topicTitle, topicMaterial, topicMaterialPdf } = body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // הופכים את היסטוריית השיחה לטקסט רציף כדי שלמודל יהיה הקשר
    const historyText = history ? history.map((msg: any) => 
      `${msg.role === 'user' ? 'תלמיד' : 'מורה'}: ${msg.content}`
    ).join('\n') : '';

    const prompt = `
      אתה מורה פרטי להיסטוריה, תומך ומקצועי, שעוזר לתלמידי תיכון להתכונן לבחינת הבגרות.
      הנושא שעליו אתם מדברים כעת הוא: "${topicTitle}".
      
      זהו חומר הלימוד הטקסטואלי שיש במערכת:
      ---
      ${topicMaterial || 'אין חומר טקסטואלי.'}
      ---
      
      היסטוריית השיחה עד כה (אם קיימת):
      ${historyText}

      השאלה החדשה של התלמיד היא: "${message}"

      הנחיות חובה עבורך:
      1. ענה בעברית ברורה, נעימה ומעודדת.
      2. התבסס *אך ורק* על חומר הלימוד (הטקסט למעלה ו/או קובץ ה-PDF שמצורף לבקשה זו). אם התשובה לא נמצאת בחומרים אלו, אמור לו שהמידע לא מופיע בסיכום.
      3. אל תיתן את התשובה המלאה מיד - הכוון את התלמיד לחשוב בעצמו.
      4. היה תמציתי וממוקד.
    `;

    // בונים את הבקשה עבור ה-AI (המערך הזה יכול להכיל גם טקסט וגם קבצים)
    const contents: any[] = [{ role: 'user', parts: [{ text: prompt }] }];

    // אם קיים קובץ PDF, אנחנו קוראים אותו מהמחשב ומצרפים לבקשה
    if (topicMaterialPdf) {
      try {
        // מסירים לוכסן התחלתי אם קיים כדי למצוא את הקובץ המדויק
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

  } catch (error) {
    console.error('Error in API Route:', error);
    return NextResponse.json({ error: 'שגיאה בעיבוד הבקשה.' }, { status: 500 });
  }
}