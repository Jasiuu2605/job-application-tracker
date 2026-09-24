import type { Metadata } from 'next';
import { themeInitializationScript } from '@/src/utils/theme';

import { AuthProvider } from '@/src/context/AuthProvider';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Job Application Tracker',
    template: '%s | Job Application Tracker',
  },
  applicationName: 'Job Application Tracker',
  description:
    'Organize your job search in one place. Track applications, interviews and offers, keep recruitment notes, and plan your next follow-up.',
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
