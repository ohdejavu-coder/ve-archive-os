import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { loadSiteConfig, loadJSON, loadFile } from "@/lib/content/loader";
import { loadPersonas } from "@/lib/content/loader";
import type { SiteConfig, Resume } from "@/types/content";
import type { Persona } from "@/types/persona";
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
  // Load ALL content at root level — passed to ContentProvider
  const site = loadSiteConfig();
  const personas = loadPersonas();
  let resume: Resume;
  try { resume = loadJSON<Resume>("resume/main.json"); } catch {
    resume = { basics: {} as Resume["basics"], summary: "", summaryEn: "", experience: [], education: [], skills: [], languages: [], awards: [] } as Resume;
  }
  let aboutPage = "";
  let contactPage = "";
  try { aboutPage = loadFile("pages/about.mdx"); } catch { /* ignore */ }
  try { contactPage = loadFile("pages/contact.mdx"); } catch { /* ignore */ }

  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ContentProviderClient
          initialSite={site}
          initialPersonas={personas}
          initialResume={resume}
          initialPages={{ about: aboutPage, contact: contactPage }}
        >
          {children}
        </ContentProviderClient>
      </body>
    </html>
  );
}
