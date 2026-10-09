import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI Student Analytics & Success Platform',
  description: 'Evidence-based, supportive student analytics and success platform with cohort tracking, early alerts, fairness auditing, and ethical AI interventions.',
  openGraph: {
    title: 'AI Student Analytics & Success Platform',
    description: 'Evidence-based, supportive student analytics and success platform with cohort tracking, early alerts, fairness auditing, and ethical AI interventions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Student Analytics & Success Platform',
    description: 'Evidence-based, supportive student analytics and success platform with cohort tracking, early alerts, fairness auditing, and ethical AI interventions.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
