"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

/**
 * Contact form placeholder.
 * In Phase 1, this shows contact info + a note about email.
 * Future: Connect to email API or form service.
 *
 * Per Principle 02: AI does not create content.
 * All form labels and CTAs come from code, not generated.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In Phase 1, the form collects data but doesn't send.
    // Future: integrate with email service (Resend, SendGrid, etc.)
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-3">
        <Typography variant="h4">感谢你的来信！</Typography>
        <Typography variant="body" className="text-neutral-500">
          我们会在 48 小时内回复。如需紧急联系，请直接发送邮件至 hello@vearchive.com。
        </Typography>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">
          姓名 <span className="text-neutral-400">(必填)</span>
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors"
          placeholder="你的姓名"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          邮箱 <span className="text-neutral-400">(必填)</span>
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          合作类型
        </label>
        <select className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors">
          <option>请选择</option>
          <option>摄影项目</option>
          <option>影视制作</option>
          <option>AI 创作</option>
          <option>其他合作</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          留言 <span className="text-neutral-400">(必填)</span>
        </label>
        <textarea
          required
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors resize-y"
          placeholder="请描述你的合作需求..."
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
        发送消息
      </Button>
    </form>
  );
}
