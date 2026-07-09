import { notFound } from "next/navigation";
import { resolveIdentity } from "@/lib/identity/resolver";
import { IdentityProvider } from "@/lib/identity/context";
import { loadWorkBySlug, loadWorksByPersona } from "@/lib/content/works";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { WorkViewer } from "@/components/content/WorkViewer";
import { createMetadata } from "@/lib/utils/metadata";
import { ArrowLeft, ArrowRight, Calendar, Building2, Tag } from "lucide-react";

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
 * Work detail page — cinematic layout.
 *
 * Structure:
 *  1. Full-width hero image (first media item or thumbnail)
 *  2. Back link
 *  3. Two-column content:
 *     - Left (70%): Media gallery + MDX body
 *     - Right (30%): Work metadata sidebar (sticky)
 *  4. Previous / Next work navigation
 */
export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ persona: string; slug: string }>;
}) {
  const { persona: personaId, slug } = await params;
  const work = loadWorkBySlug(slug);
  const identity = resolveIdentity(personaId);
  const allWorks = loadWorksByPersona(identity.persona.id);

  if (!work) {
    notFound();
  }

  const currentIndex = allWorks.findIndex((w) => w.slug === slug);
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
  const nextWork =
    currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

  const categoryLabel = {
    photography: "摄影",
    film: "影视",
    ai: "AI",
    "new-media": "新媒体",
  }[work.category];

  // Hero image: use poster for video, first media image, or thumbnail
  let heroImage = work.thumbnail;
  if (work.media.length > 0) {
    const first = work.media[0];
    if (first.type === "video" && first.poster) {
      heroImage = first.poster;
    } else if (first.type === "image") {
      heroImage = first.src;
    }
  }

  return (
    <IdentityProvider identity={identity}>
      <article>
        {/* ---- Full-width Hero Image ---- */}
        <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage}
              alt={work.title}
              className="w-full h-full object-cover hero-image-reveal"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Typography variant="h2" className="text-neutral-300">
                {work.titleEn}
              </Typography>
            </div>
          )}

          {/* Dark overlay for text readability on any background */}
          <div className={`absolute inset-0 ${work.darkOverlay ? "bg-black/30" : ""}`} />

          {/* Gradient overlay at bottom for readability */}
          <div className={`absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t ${work.darkOverlay ? "from-black/80 via-black/30" : "from-white dark:from-neutral-950"} to-transparent`} />

          {/* Title overlay on hero */}
          <div className="absolute bottom-8 left-0 right-0 z-10">
            <Container>
              <div className="flex items-center gap-3 mb-3">
                <Badge color={identity.persona.accentColor}>
                  {categoryLabel}
                </Badge>
                <span className="text-sm text-white/80">{work.year}</span>
              </div>
              <Typography variant="h1" className="text-white">
                {work.title}
              </Typography>
              <Typography variant="body" className="text-white/70 mt-1">
                {work.titleEn}
              </Typography>
            </Container>
          </div>
        </div>

        {/* ---- Back link ---- */}
        <Container className="mt-6 mb-4">
          <Button
            href={`/${identity.persona.id}/works`}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            返回作品列表
          </Button>
        </Container>

        {/* ---- Two-column body ---- */}
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-8">
            {/* Left: Media + MDX content */}
            <div className="lg:col-span-8 space-y-12">
              {/* Bilibili video embed */}
              {work.bilibiliBV && (
                <section>
                  <Typography variant="label" className="mb-4">
                    视频
                  </Typography>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={`//player.bilibili.com/player.html?bvid=${work.bilibiliBV}&page=1&high_quality=1`}
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: "none" }}
                    />
                  </div>
                </section>
              )}

              {/* Media Gallery: all media + thumbnail */}
              {work.media.length > 0 && (
                <section>
                  <Typography variant="label" className="mb-4">
                    作品图集
                  </Typography>
                  <WorkViewer media={(() => {
                    // Include thumbnail in the gallery if it exists and isn't already the hero
                    const all = [...work.media];
                    if (work.thumbnail && work.thumbnail !== work.media[0]?.src) {
                      all.unshift({ type: "image" as const, src: work.thumbnail, alt: "封面" });
                    }
                    return all;
                  })()} />
                </section>
              )}

              {/* MDX Body */}
              <section>
                <Typography variant="label" className="mb-4">
                  作品介绍
                </Typography>
                <MDXRenderer
                  content={
                    typeof work.content === "string" ? work.content : ""
                  }
                />
              </section>
            </div>

            {/* Right: Metadata sidebar — sticky */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-8">
                {/* Key metadata */}
                <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
                  <Typography variant="h4" className="text-sm">
                    作品信息
                  </Typography>

                  <div className="space-y-3 text-sm">
                    <MetaRow
                      icon={<Calendar size={14} />}
                      label="年份"
                      value={String(work.year)}
                    />
                    {work.client && (
                      <MetaRow
                        icon={<Building2 size={14} />}
                        label="客户"
                        value={work.client}
                      />
                    )}
                    <MetaRow
                      icon={<Tag size={14} />}
                      label="类别"
                      value={categoryLabel ?? ""}
                    />
                  </div>

                  {/* Tags */}
                  {work.tags.length > 0 && (
                    <>
                      <Divider />
                      <div className="flex flex-wrap gap-1.5">
                        {work.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* CTA */}
                <Button
                  href={`/${identity.persona.id}/contact`}
                  variant="primary"
                  className="w-full"
                >
                  对类似作品感兴趣？联系我
                </Button>
              </div>
            </aside>
          </div>
        </Container>

        {/* ---- Previous / Next ---- */}
        <Divider className="mt-16" />
        <Container>
          <div className="flex items-center justify-between py-10">
            {prevWork ? (
              <Button
                href={`/${identity.persona.id}/works/${prevWork.slug}`}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft size={14} className="mr-1" />
                <span className="max-w-[200px] truncate">
                  {prevWork.title}
                </span>
              </Button>
            ) : (
              <div />
            )}

            {nextWork ? (
              <Button
                href={`/${identity.persona.id}/works/${nextWork.slug}`}
                variant="ghost"
                size="sm"
              >
                <span className="max-w-[200px] truncate">
                  {nextWork.title}
                </span>
                <ArrowRight size={14} className="ml-1" />
              </Button>
            ) : (
              <div />
            )}
          </div>
        </Container>
      </article>
    </IdentityProvider>
  );
}

/** Small metadata row with icon */
function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-neutral-400 shrink-0">{icon}</span>
      <span className="text-neutral-500 text-xs w-10">{label}</span>
      <span className="font-medium truncate">{value}</span>
    </div>
  );
}
