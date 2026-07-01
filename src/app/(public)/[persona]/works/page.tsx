import { resolveIdentity } from "@/lib/identity/resolver";
import { loadWorksByPersona } from "@/lib/content/works";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { CTA } from "@/components/sections/CTA";
import { createMetadata } from "@/lib/utils/metadata";
import Link from "next/link";
import type { Work, WorkCategory } from "@/types/work";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const identity = resolveIdentity(persona);
  return createMetadata({ title: `作品集 — ${identity.persona.name}`, description: `${identity.persona.name}的作品展示`, path: `/${identity.persona.id}/works` });
}

const CATS: { id: WorkCategory | "all"; label: string }[] = [
  { id: "all", label: "全部" }, { id: "photography", label: "摄影" }, { id: "film", label: "影视" }, { id: "ai", label: "AI" }, { id: "new-media", label: "新媒体" },
];

// Sub-tags for photography
const PHOTO_TAGS = ["环境", "人像", "街拍", "光影", "城市"];
const FILM_TAGS = ["短片", "剧情", "纪录片", "实验"];
const AI_TAGS = ["生成影像", "Stable Diffusion", "Prompt 工程", "AI 视频"];
const NEW_MEDIA_TAGS = ["交互", "VR", "生成艺术"];

function getSubTags(cat: WorkCategory): string[] {
  const m: Record<WorkCategory, string[]> = {
    photography: PHOTO_TAGS, film: FILM_TAGS, ai: AI_TAGS, "new-media": NEW_MEDIA_TAGS,
  };
  return m[cat] ?? [];
}

export default async function WorksPage({
  params, searchParams,
}: {
  params: Promise<{ persona: string }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { persona: personaId } = await params;
  const sp = await searchParams;
  const identity = resolveIdentity(personaId);
  let works = loadWorksByPersona(identity.persona.id);

  const activeCat = sp.category as WorkCategory | undefined;
  const activeTag = sp.tag;

  if (activeCat && activeCat !== "all") {
    works = works.filter((w) => w.category === activeCat);
    if (activeTag) {
      works = works.filter((w) => w.tags.includes(activeTag));
    }
  }

  const counts: Record<string, number> = { all: loadWorksByPersona(identity.persona.id).length };
  for (const w of loadWorksByPersona(identity.persona.id)) {
    counts[w.category] = (counts[w.category] ?? 0) + 1;
  }

  const base = `/${identity.persona.id}/works`;
  const personAccent = identity.persona.accentColor;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[var(--red)]" />
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">Works</span>
          </div>
          <Typography variant="h1" cinematic>作品</Typography>
        </div>

        {/* Category filter — real <a> links, full page reload */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CATS.map((cat) => {
            const isActive = (activeCat ?? "all") === cat.id;
            const count = counts[cat.id] ?? 0;
            if (cat.id !== "all" && count === 0) return null;
            return (
              <a
                key={cat.id}
                href={cat.id === "all" ? base : `${base}?category=${cat.id}`}
                className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={isActive ? { backgroundColor: personAccent, color: "#fff" } : {}}
              >
                {cat.label}
                {count > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-medium" style={isActive ? { backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" } : {}}>
                    {count}
                  </span>
                )}
                {!isActive && <span className="text-neutral-600 dark:text-neutral-400">{count > 0 ? "" : ""}</span>}
              </a>
            );
          })}
        </div>

        {/* Sub-tags — appear when a category is active */}
        {activeCat && activeCat !== "all" && getSubTags(activeCat).length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-8">
            <span className="text-xs text-neutral-400 mr-2">细分：</span>
            <a
              href={`${base}?category=${activeCat}`}
              className="px-3 py-1 rounded-full text-xs border transition-colors"
              style={!activeTag ? { borderColor: personAccent, color: personAccent } : { borderColor: "var(--tw-color-neutral-200)", color: "var(--tw-color-neutral-500)" }}
            >
              全部
            </a>
            {getSubTags(activeCat).map((tag) => (
              <a
                key={tag}
                href={`${base}?category=${activeCat}&tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full text-xs border transition-colors"
                style={activeTag === tag ? { borderColor: personAccent, color: personAccent, backgroundColor: `${personAccent}10` } : { borderColor: "var(--tw-color-neutral-200)", color: "var(--tw-color-neutral-500)" }}
              >
                {tag}
              </a>
            ))}
          </div>
        )}

        {/* Grid */}
        {works.length === 0 ? (
          <div className="text-center py-16">
            <Typography variant="h3" className="text-neutral-300">暂无作品</Typography>
            <Typography variant="body" className="text-neutral-400 mt-2">{activeTag ? `该标签下暂无作品` : `该分类下暂无作品`}</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((w) => (
              <Link key={w.slug} href={`/${identity.persona.id}/works/${w.slug}`} className="group block rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-200 hover:shadow-md">
                <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  {w.thumbnail ? (
                    <img src={w.thumbnail} alt={w.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-600 text-xs">{w.titleEn}</div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full text-xs font-medium" style={{ border: `1px solid ${personAccent}`, color: personAccent, backgroundColor: `${personAccent}10` }}>
                      {w.category === "photography" ? "摄影" : w.category === "film" ? "影视" : w.category === "ai" ? "AI" : "新媒体"}
                    </span>
                    <span className="text-xs text-neutral-400">{w.year}</span>
                  </div>
                  <div className="font-semibold text-sm group-hover:opacity-70 transition-opacity">{w.title}</div>
                  <div className="text-xs text-neutral-500 line-clamp-2">{w.titleEn}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
      <CTA />
    </section>
  );
}
