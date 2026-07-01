import type { Metadata } from "next";
import { CCRShell } from "./CCRShell";

export const metadata: Metadata = {
  title: "编辑 — VE Archive OS",
  description: "内容编辑",
  robots: "noindex, nofollow",
};

export default function CCRLayout({ children }: { children: React.ReactNode }) {
  return <CCRShell>{children}</CCRShell>;
}
