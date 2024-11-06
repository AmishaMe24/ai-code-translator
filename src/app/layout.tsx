import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: "AI Code Translator",
  description: "Translate code between programming languages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
