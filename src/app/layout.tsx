import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EV Manufacturing Management System",
  description: "Management Information System for Electric Vehicle Production - Track production, inventory, quality control, and costs.",
  keywords: ["EV", "Electric Vehicle", "Manufacturing", "MIS", "Production", "Quality Control"],
  authors: [{ name: "EV Manufacturing Team" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
