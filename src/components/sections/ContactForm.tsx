"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useLang } from "@/lib/language/context";
import { Mail, Send } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const { lang } = useLang();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setError(err.error || "发送失败");
      }
    } catch {
      setError(lang === "en" ? "Network error. Please email ohdejavu@163.com directly." : "网络错误，请直接发送邮件至 ohdejavu@163.com");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-2">
          <Send size={24} className="text-neutral-400" />
        </div>
        <Typography variant="h4">
          {lang === "en" ? "Thank you for your message" : "感谢你的来信"}
        </Typography>
        <Typography variant="body" className="text-neutral-500 max-w-sm mx-auto">
          {lang === "en"
            ? "We'll reply within 48 hours. For urgent matters, email ohdejavu@163.com with [URGENT] in the subject."
            : "我们会在 48 小时内回复。紧急合作请直接发送邮件至 ohdejavu@163.com，标题注明 [URGENT]。"}
        </Typography>
      </div>
    );
  }

  const labels = {
    name: lang === "en" ? "Name" : "姓名",
    nameRequired: lang === "en" ? "Required" : "必填",
    namePlaceholder: lang === "en" ? "Your name" : "你的姓名",
    email: lang === "en" ? "Email" : "邮箱",
    emailPlaceholder: "your@email.com",
    type: lang === "en" ? "Project type" : "合作类型",
    typeOptions: lang === "en"
      ? ["Select type", "Photography", "Film Production", "AI Creation", "Other"]
      : ["请选择合作类型", "摄影项目", "影视制作", "AI 创作", "其他合作"],
    message: lang === "en" ? "Message" : "留言",
    messagePlaceholder: lang === "en"
      ? "Describe your project, timeline, budget..."
      : "请描述你的合作需求、项目周期、预算范围...",
    send: lang === "en" ? "Send Message" : "发送消息",
    orEmail: lang === "en" ? "Or email directly:" : "或直接邮件：",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          {labels.name} <span className="text-neutral-400 text-xs">· {labels.nameRequired}</span>
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors"
          placeholder={labels.namePlaceholder}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {labels.email} <span className="text-neutral-400 text-xs">· {labels.nameRequired}</span>
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors"
          placeholder={labels.emailPlaceholder}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{labels.type}</label>
        <select name="type" className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors">
          {labels.typeOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {labels.message} <span className="text-neutral-400 text-xs">· {labels.nameRequired}</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-colors resize-y"
          placeholder={labels.messagePlaceholder}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={sending}>
        <Send size={16} className="mr-2" />
        {sending ? (lang === "en" ? "Sending..." : "发送中...") : labels.send}
      </Button>

      <p className="flex items-center gap-1.5 text-xs text-neutral-400 text-center justify-center pt-2">
        <Mail size={12} />
        {labels.orEmail} ohdejavu@163.com
      </p>
    </form>
  );
}
