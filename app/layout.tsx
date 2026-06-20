import type { Metadata } from 'next';
import './globals.css';
import { AppDataProvider } from '@/components/AppDataProvider';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Recipe Price Calculator',
  description:
    'Calculate ingredient costs, sale prices and profit margins for your recipes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppDataProvider>
          <Navigation />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
          <footer className="border-t border-brand-border bg-surface">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-sm text-slate-500">
              Recipe Price Calculator &mdash; data is stored locally in your
              browser.
            </div>
          </footer>
        </AppDataProvider>
      </body>
    </html>
  );
}
