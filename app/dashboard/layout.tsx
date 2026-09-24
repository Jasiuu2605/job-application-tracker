import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Manage your job applications, update recruitment statuses, and review your notes and follow-up dates.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
