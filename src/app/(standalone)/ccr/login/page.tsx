"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "1") {
      setError("密码错误，请重试");
    }
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = password.trim();
    if (!val) { setError("请输入密码"); return; }
    document.cookie = `ve-ccr-auth=${encodeURIComponent(val)};path=/;max-age=86400`;
    router.push("/ccr");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold tracking-tight text-white uppercase">VE Archive</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63946]" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-1">创作者控制中心</h1>
          <p className="text-sm text-neutral-400">请输入密码以继续</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="输入密码"
            autoFocus
            className="w-full px-4 py-3 rounded-md border border-neutral-700 bg-neutral-900 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:border-transparent transition-colors"
          />
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-md text-sm font-medium bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            进入 CCR
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-neutral-600">
          VE Archive OS · Creator Control Room
        </p>
      </div>
    </div>
  );
}

export default function CCRLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

