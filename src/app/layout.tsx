import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ContentProviderClient } from "./ContentProviderClient";
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
  title: "VE Archive OS",
  description: "Personal Brand Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="afterInteractive"
        />
        <Script id="tailwind-config" strategy="afterInteractive">
          {`tailwind.config={darkMode:"class",theme:{extend:{colors:{background:"var(--bg)",foreground:"var(--fg)",accent:"var(--red)"}}}}`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <ContentProviderClient>
          {children}
        </ContentProviderClient>
      </body>
    </html>
  );
}
