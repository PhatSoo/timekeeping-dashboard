import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import 'bootstrap/dist/css/bootstrap.min.css';
// import './global.css';
import Layout from '@/components/App.Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'A product of LTP Company',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={(inter.className, 'bg-secondary')}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
