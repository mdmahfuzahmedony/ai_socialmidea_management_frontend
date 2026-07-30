import type { Metadata } from 'next';
import './globals.css'; // স্ক্রিনশট অনুযায়ী globals.css এখানে আছে
import Navbar from '@/components/ui/Navbar';
import Fotter from '@/components/ui/Fotter';

export const metadata: Metadata = {
  title: 'Loopline — AI social media management',
  description:
    'Connect your social pages and let Loopline write, design and publish your posts automatically.',
};

// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children} {/* এখানে কোনো Navbar বা Fotter থাকবে না */}
      </body>
    </html>
  );
}