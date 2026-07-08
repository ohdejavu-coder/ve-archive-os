import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Builder — VE Archive",
  robots: "noindex, nofollow",
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
