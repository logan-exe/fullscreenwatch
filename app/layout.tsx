import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for SEO
export const metadata: Metadata = {
  title: "Free Dynamic Timer and Clock App | Real-Time Countdown, Timer & Clock",
  description:
    "Discover a free and powerful timer and clock app built with Next.js. Featuring real-time current time display, customizable countdowns, and an incrementing timer. Enjoy a clean, modern interface with fullscreen support, large dynamic fonts, and user-friendly controls. Perfect for time tracking, productivity, and personal use!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Ensure responsive and optimized design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Free Timer App, Free Clock App, Free Countdown Timer, Productivity Timer, Timer Next.js" />
        <meta name="author" content="Your Name or Brand" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
