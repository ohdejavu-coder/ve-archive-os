"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Mail, Send } from "lucide-react";

/**
 * Clean contact form with generous spacing.
 * In Phase 1, form submits locally (no email API).
 * Future: Connect to Resend / SendGrid.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-2">
          <Send size={24} className="text-neutral-400" />
        </div>
        <Typography variant="h4">感谢你的来信</Typography>
        <Typography variant="body" className="text-neutral-500 max-w-sm mx-auto">
          我们会在 48 小时内回复。紧急合作请直接发送邮件至 hello@vearchive.com，标题注明 [URGENT]。
        </Typography>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          姓名 <span className="text-neutral-400 text-xs">· 必填</span>
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors"
          placeholder="你的姓名"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          邮箱 <span className="text-neutral-400 text-xs">· 必填</span>
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">合作类型</label>
        <select className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors">
          <option>请选择合作类型</option>
          <option>摄影项目</option>
          <option>影视制作</option>
          <option>AI 创作</option>
          <option>其他合作</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          留言 <span className="text-neutral-400 text-xs">· 必填</span>
        </label>
        <textarea
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors resize-y"
          placeholder="请描述你的合作需求、项目周期、预算范围..."
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        <Send size={16} className="mr-2" />
        发送消息
      </Button>

      <p className="flex items-center gap-1.5 text-xs text-neutral-400 text-center justify-center pt-2">
        <Mail size={12} />
        或直接邮件：hello@vearchive.com
      </p>
    </form>
  );
}
