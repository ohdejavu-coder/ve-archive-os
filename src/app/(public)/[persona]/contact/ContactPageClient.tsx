"use client";

import { usePersona } from "@/lib/identity/context";
import { useLang } from "@/lib/language/context";
import { useStoredField } from "@/lib/content/useStoredField";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { ContactForm } from "@/components/sections/ContactForm";

export function ContactPageClient({ fileContent }: { fileContent: string }) {
  const persona = usePersona();
  const { lang } = useLang();
  const [content] = useStoredField("page_contact", fileContent);

  return (
    <section className="py-20 md:py-28">
      <Container size="narrow">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--red)]" />
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">Contact</span>
          </div>
          <Typography variant="h1" cinematic>{lang === "en" ? "Contact" : "联系"}</Typography>
        </div>
        <div className="mb-16 max-w-2xl"><MDXRenderer content={content} /></div>
        <div className="mb-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: "01", title: lang === "en" ? "Fill Form" : "填写表单", desc: lang === "en" ? "Tell me about your project" : "告诉我你的需求和合作意图" },
            { step: "02", title: lang === "en" ? "Wait for Reply" : "等待回复", desc: lang === "en" ? "48h response, urgent mark [URGENT]" : "48 小时内回复，紧急标注 [URGENT]" },
            { step: "03", title: lang === "en" ? "Start Working" : "开始合作", desc: lang === "en" ? "Confirm scope and timeline" : "确认方案与周期，正式启动项目" },
          ].map((item) => (
            <div key={item.step} className="space-y-2">
              <span className="text-3xl font-bold text-[var(--red)]">{item.step}</span>
              <Typography variant="body" className="font-medium">{item.title}</Typography>
              <Typography variant="body-sm" className="text-neutral-500">{item.desc}</Typography>
            </div>
          ))}
        </div>
        <div className="max-w-xl">
          <Typography variant="h3" className="mb-6">{lang === "en" ? "Send a Message" : "发送消息"}</Typography>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
