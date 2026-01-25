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

// src/app/layout.tsx mein metadata update karein

export const metadata = {
  title: 'BaseRise',
  description: 'The premier Launchpad on Base Network.',
  icons: {
    icon: [
      {
        // SVG ko refine kiya gaya hai taake 'B' bilkul centre mein aaye
        url: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2225%22 fill=%22%232563eb%22/><text x=%2250%22 y=%2255%22 font-size=%2265%22 font-weight=%22800%22 fill=%22white%22 font-family=%22sans-serif%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>B</text></svg>`,
        type: 'image/svg+xml',
      },
    ],
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
