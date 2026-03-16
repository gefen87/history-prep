import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // דוגמה לדף שלא תרצה שיופיע בגוגל בעתיד
    },
    sitemap: 'https://history-prep.vercel.app/sitemap.xml',
  };
}