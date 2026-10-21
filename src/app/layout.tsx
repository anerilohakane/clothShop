import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VogueCraft POS & ERP | Cloth Boutique & Shop Management',
  description: 'All-in-one boutique and apparel store manager: POS Quick Billing, Inventory tracking, Staff & Attendance, and Salary Payroll.',
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
