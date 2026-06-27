import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadJSON } from "@/lib/content/loader";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Divider";
import { Timeline } from "@/components/sections/Timeline";
import { SkillMatrix } from "@/components/sections/SkillMatrix";
import { CTA } from "@/components/sections/CTA";
import { createMetadata } from "@/lib/utils/metadata";
import { Mail, MapPin, Globe } from "lucide-react";
import type { Resume } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const identity = resolveIdentity(persona);

  return createMetadata({
    title: `简历 — ${identity.persona.name}`,
    description: `${identity.persona.name}的工作经历与技能`,
    path: `/${identity.persona.id}/resume`,
  });
}

/**
 * Resume page — experience, education, skills, awards.
 * Content filters by persona: only shows sections listed in persona.resumeSections.
 */
export default async function ResumePage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaId } = await params;
  const identity = resolveIdentity(personaId);
  const resume = loadJSON<Resume>("resume/main.json");
  const { persona } = identity;

  const showSection = (name: string) => persona.resumeSections.includes(name);

  return (
    <IdentityProvider identity={identity}>
      <section className="py-16">
        <Container size="narrow">
          {/* Header */}
          <div className="mb-12">
            <Typography variant="h1">简历</Typography>
            <Typography variant="body" className="text-neutral-500 mt-2">
              当前展示身份：{persona.name}
            </Typography>
          </div>

          {/* Basics */}
          <div className="mb-10 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <Typography variant="h2" className="mb-1">
              {resume.basics.name}
            </Typography>
            <Typography variant="body" className="text-neutral-500 mb-3">
              {resume.basics.title}
            </Typography>

            <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {resume.basics.location}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={14} />
                {resume.basics.email}
              </span>
              {resume.basics.website && (
                <span className="flex items-center gap-1">
                  <Globe size={14} />
                  {resume.basics.website}
                </span>
              )}
            </div>

            <Divider className="my-4" />

            <Typography variant="body">
              {resume.summary}
            </Typography>
          </div>

          {/* Experience */}
          {showSection("experience") && resume.experience.length > 0 && (
            <div className="mb-12">
              <Typography variant="h3" className="mb-6">
                工作经历
              </Typography>
              <Timeline items={resume.experience} type="experience" />
            </div>
          )}

          {/* Skills */}
          {showSection("skills") && resume.skills.length > 0 && (
            <div className="mb-12">
              <Typography variant="h3" className="mb-6">
                技能
              </Typography>
              <SkillMatrix skills={resume.skills} />
            </div>
          )}

          {/* Education */}
          {showSection("education") && resume.education.length > 0 && (
            <div className="mb-12">
              <Typography variant="h3" className="mb-6">
                教育背景
              </Typography>
              <Timeline items={resume.education} type="education" />
            </div>
          )}

          {/* Awards */}
          {showSection("awards") && resume.awards.length > 0 && (
            <div className="mb-12">
              <Typography variant="h3" className="mb-6">
                获奖与荣誉
              </Typography>
              <div className="space-y-3">
                {resume.awards.map((award, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-md border border-neutral-100 dark:border-neutral-800"
                  >
                    <span className="text-xs text-neutral-400 font-mono mt-0.5">
                      {award.year}
                    </span>
                    <div>
                      <Typography variant="body" className="font-medium">
                        {award.title}
                      </Typography>
                      <Typography variant="caption">{award.issuer}</Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {resume.languages.length > 0 && (
            <div className="mb-12">
              <Typography variant="h3" className="mb-4">
                语言能力
              </Typography>
              <div className="flex flex-wrap gap-4">
                {resume.languages.map((lang, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 text-sm"
                  >
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-neutral-400 mx-1">·</span>
                    <span className="text-neutral-500">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>

        <CTA />
      </section>
    </IdentityProvider>
  );
}
