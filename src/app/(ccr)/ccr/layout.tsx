import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { CCRSidebar } from "./CCRSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Control Room — VE Archive OS",
  description: "创作者控制中心",
  robots: "noindex, nofollow",
};

/**
 * Creator Control Room layout.
 *
 * The CCR is the user's daily interface for managing their brand.
 * Per Project Goal Section 9: this is not a CMS — it's a control room.
 *
 * In Phase 1, the CCR shows read-only views of content + edit instructions.
 * Content editing happens by modifying files directly in CodeSandbox.
 */
export default async function CCRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Sidebar */}
      <CCRSidebar />

      {/* Main workspace */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center px-6">
          <Typography variant="h4" className="text-sm">
            创作者控制中心
          </Typography>
          <span className="ml-auto text-xs text-neutral-400">VE Archive OS</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
