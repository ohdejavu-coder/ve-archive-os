"use client";

import { type ReactNode } from "react";
import { ContentProvider } from "@/lib/content/ContentContext";
import type { SiteConfig, Resume } from "@/types/content";
import type { Persona } from "@/types/persona";

export function ContentProviderClient({
  children,
  initialSite,
  initialPersonas,
  initialResume,
  initialPages,
}: {
  children: ReactNode;
  initialSite: SiteConfig;
  initialPersonas: Persona[];
  initialResume: Resume;
  initialPages: { about: string; contact: string };
}) {
  return (
    <ContentProvider
      initialSite={initialSite}
      initialPersonas={initialPersonas}
      initialResume={initialResume}
      initialPages={initialPages}
    >
      {children}
    </ContentProvider>
  );
}
