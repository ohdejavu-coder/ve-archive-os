import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadMDX } from "@/lib/content/loader";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { ContactForm } from "@/components/sections/ContactForm";
import { createMetadata } from "@/lib/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const identity = resolveIdentity(persona);

  return createMetadata({
    title: `联系 — ${identity.persona.name}`,
    description: `与${identity.persona.name}取得联系`,
    path: `/${identity.persona.id}/contact`,
  });
}

/**
 * Contact page — vertical layout.
 *
 * Top: Explanatory text (from MDX file) + process steps.
 * Bottom: Contact form with generous spacing.
 *
 * Goal: partner reads the intro, understands the process, then fills the form.
 * No side-by-side crowding. Clear visual hierarchy.
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const { persona } = identity;
  const { content } = loadMDX("pages/contact.mdx");

  return (
    <IdentityProvider identity={identity}>
      <section className="py-16 md:py-24">
        <Container size="narrow">
          {/* ---- Top: Page heading ---- */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-8 h-px"
                style={{ backgroundColor: persona.accentColor }}
              />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium">
                Contact
              </span>
            </div>
            <Typography variant="h1" cinematic>
              联系
            </Typography>
          </div>

          {/* ---- Middle: Explanatory content ---- */}
          <div className="mb-16 max-w-2xl">
            <MDXRenderer content={content} />
          </div>

          {/* ---- Process steps ---- */}
          <div className="mb-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "填写表单",
                desc: "告诉我你的需求和合作意图",
              },
              {
                step: "02",
                title: "等待回复",
                desc: "48 小时内邮件回复，紧急请标注 [URGENT]",
              },
              {
                step: "03",
                title: "开始合作",
                desc: "确认方案与周期，正式启动项目",
              },
            ].map((item) => (
              <div key={item.step} className="space-y-2">
                <span
                  className="text-3xl font-bold"
                  style={{ color: persona.accentColor }}
                >
                  {item.step}
                </span>
                <Typography variant="body" className="font-medium">
                  {item.title}
                </Typography>
                <Typography variant="body-sm" className="text-neutral-500">
                  {item.desc}
                </Typography>
              </div>
            ))}
          </div>

          {/* ---- Bottom: Contact form ---- */}
          <div className="max-w-xl">
            <Typography variant="h3" className="mb-6">
              发送消息
            </Typography>
            <ContactForm />
          </div>
        </Container>
      </section>
    </IdentityProvider>
  );
}
