"use client";

import { usePersona } from "@/lib/identity/context";
import { useSiteContent } from "@/lib/content/ContentContext";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { ContactForm } from "@/components/sections/ContactForm";

export function ContactPageClient({ fileContent }: { fileContent: string }) {
  const persona = usePersona();
  const { pages } = useSiteContent();
  const content = pages.contact || fileContent;

  return (
    <section className="py-20 md:py-28">
      <Container size="narrow">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--red)]" />
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">Contact</span>
          </div>
          <Typography variant="h1" cinematic>联系</Typography>
        </div>

        {/* Intro text */}
        <div className="mb-16 max-w-2xl">
          <MDXRenderer content={content} />
        </div>

        {/* Process steps */}
        <div className="mb-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: "01", title: "填写表单", desc: "告诉我你的需求和合作意图" },
            { step: "02", title: "等待回复", desc: "48 小时内回复，紧急标注 [URGENT]" },
            { step: "03", title: "开始合作", desc: "确认方案与周期，正式启动项目" },
          ].map((item) => (
            <div key={item.step} className="space-y-2">
              <span className="text-3xl font-bold text-[var(--red)]">{item.step}</span>
              <Typography variant="body" className="font-medium">{item.title}</Typography>
              <Typography variant="body-sm" className="text-neutral-500">{item.desc}</Typography>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-xl">
          <Typography variant="h3" className="mb-6">发送消息</Typography>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
