import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'A product of LTP Company',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ background: 'linear-gradient(#ECFCFF, #B2FCFF)', height: '100vh', display: 'flex' }}> {children} </div>;
}
