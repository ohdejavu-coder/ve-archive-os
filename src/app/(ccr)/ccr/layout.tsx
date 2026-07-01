import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "编辑 — VE Archive OS",
  robots: "noindex, nofollow",
};

export default function CCRLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
