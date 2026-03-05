import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonetaApp - מערכת ניהול חווה",
  description: "יישום פשוט לניהול תוצרת חקלאית",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-orange-50">
        {children}
      </body>
    </html>
  );
}
