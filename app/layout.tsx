import type { Metadata } from 'next';
import { themeInitializationScript } from '@/src/utils/theme';

import { AuthProvider } from '@/src/context/AuthProvider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Job Application Tracker',
  description: 'A simple client-side tracker for job applications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full antialiased' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
      </head>
      <body className='min-h-full flex flex-col'>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
