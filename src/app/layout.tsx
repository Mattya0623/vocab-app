import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/contexts/I18nContext';
import { AppProvider } from '@/contexts/AppContext';

export const metadata: Metadata = {
  title: 'VOCAB',
  description: 'Lexicon · Constellation · β',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full">
        <I18nProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
