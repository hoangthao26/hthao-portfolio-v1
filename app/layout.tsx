import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hoàng Thao | Portfolio",
  icons: { icon: "/logo/HT_logo.png", apple: "/logo/HT_logo.png" },
  description:
    "Portfolio of Phan Đỗ Hoàng Thao — Final-year Software Engineering student at FPT University, specializing in SAP Technical development (ABAP, RAP, Fiori) and modern frontend applications with React, Next.js, and React Native.",
  keywords: [
    "Hoang Thao",
    "Frontend Developer",
    "SAP ABAP",
    "React",
    "Next.js",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
