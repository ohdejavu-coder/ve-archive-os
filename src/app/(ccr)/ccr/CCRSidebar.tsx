"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  FolderOpen,
  UserCircle,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "仪表盘", href: "/ccr", icon: LayoutDashboard },
  { label: "作品管理", href: "/ccr/works", icon: FolderOpen },
  { label: "身份配置", href: "/ccr/persona", icon: UserCircle },
  { label: "简历编辑", href: "/ccr/resume", icon: FileText },
  { label: "网站设置", href: "/ccr/settings", icon: Settings },
];

export function CCRSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/ccr" className="font-semibold text-sm tracking-tight">
          VE Archive <span className="text-neutral-400 font-normal">CCR</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-100",
                isActive
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          target="_blank"
        >
          ← 打开网站
        </Link>
      </div>
    </aside>
  );
}
