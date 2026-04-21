import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scanner App',
  description: 'Warehouse Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}