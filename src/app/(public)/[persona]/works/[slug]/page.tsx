import { notFound } from "next/navigation";
import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadWorkBySlug } from "@/lib/content/works";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { WorkViewer } from "@/components/content/WorkViewer";
import { createMetadata } from "@/lib/utils/metadata";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string; slug: string }>;
}) {
  const { persona: personaId, slug } = await params;
  const work = loadWorkBySlug(slug);
  const identity = resolveIdentity(personaId);

  if (!work) {
    return createMetadata({
      title: "作品未找到",
      description: "该作品不存在",
      path: `/${identity.persona.id}/works/${slug}`,
    });
  }

  return createMetadata({
    title: `${work.title} — ${identity.persona.name}`,
    description: work.titleEn,
    path: `/${identity.persona.id}/works/${work.slug}`,
    ogImage: work.thumbnail,
  });
}

/**
 * Work detail page.
 * Shows: Media gallery → MDX content → Metadata
 */
export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ persona: string; slug: string }>;
}) {
  const { persona: personaId, slug } = await params;
  const work = loadWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const identity = resolveIdentity(personaId);

  const categoryLabel = {
    photography: "摄影",
    film: "影视",
    ai: "AI",
    "new-media": "新媒体",
  }[work.category];

  return (
    <IdentityProvider identity={identity}>
      <article className="py-16">
        <Container size="narrow">
          {/* Back link */}
          <div className="mb-8">
            <Button
              href={`/${identity.persona.id}/works`}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft size={16} className="mr-1" />
              返回作品列表
            </Button>
          </div>

          {/* Header */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
              <Badge color={identity.persona.accentColor}>{categoryLabel}</Badge>
              <Typography variant="caption">{work.year}</Typography>
              {work.client && (
                <>
                  <span className="text-neutral-300">·</span>
                  <Typography variant="caption">{work.client}</Typography>
                </>
              )}
            </div>

            <Typography variant="h1">{work.title}</Typography>
            <Typography variant="body" className="text-neutral-500">
              {work.titleEn}
            </Typography>

            {work.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Media Gallery */}
          <div className="mb-12">
            <WorkViewer media={work.media} />
          </div>

          <Divider className="mb-10" />

          {/* MDX Content */}
          <div className="mb-12">
            <MDXRenderer
              content={typeof work.content === "string" ? work.content : ""}
            />
          </div>
        </Container>
      </article>
    </IdentityProvider>
  );
}
