import type { Metadata } from 'next';
import { themeInitializationScript } from '@/src/utils/theme';

import { AuthProvider } from '@/src/context/AuthProvider';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://job-application-tracker-drab-delta.vercel.app'),
  title: {
    default: 'Job Application Tracker',
    template: '%s | Job Application Tracker',
  },
  applicationName: 'Job Application Tracker',
  description:
    'Organize your job search in one place. Track applications, interviews and offers, keep recruitment notes, and plan your next follow-up.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Job Application Tracker',
    title: 'Job Application Tracker',
    description:
      'Your applications, interviews and next steps. Together in one place.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Application Tracker',
    description:
      'Your applications, interviews and next steps. Together in one place.',
    images: [{ url: '/opengraph-image', alt: 'Job Application Tracker: applications, interviews and follow-ups in one place.' }],
  },
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
