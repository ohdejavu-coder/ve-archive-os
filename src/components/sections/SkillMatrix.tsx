"use client";

import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { usePersona } from "@/lib/identity/context";
import type { ResumeSkill } from "@/types/content";

interface SkillMatrixProps {
  skills: ResumeSkill[];
}

/**
 * Visual skill display. Grouped by category.
 * Emphasized skills (from persona config) get accent color highlight.
 */
export function SkillMatrix({ skills }: SkillMatrixProps) {
  const persona = usePersona();
  const emphasized = persona.emphasizedSkills;

  // Group skills by category
  const grouped = skills.reduce<
    Record<string, ResumeSkill[]>
  >((acc, skill) => {
    const cat = skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  if (skills.length === 0) {
    return (
      <Typography variant="body" className="text-neutral-400">
        暂无技能数据
      </Typography>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          <Typography variant="label" className="mb-3">
            {category}
          </Typography>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => {
              const isEmphasized = emphasized.includes(skill.name);
              return (
                <div
                  key={skill.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  style={
                    isEmphasized
                      ? {
                          borderColor: persona.accentColor,
                          backgroundColor: `${persona.accentColor}10`,
                        }
                      : undefined
                  }
                >
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-neutral-400">{skill.nameEn}</span>
                  {/* Level dots */}
                  <span className="flex gap-0.5 ml-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            i < skill.level
                              ? isEmphasized
                                ? persona.accentColor
                                : "var(--tw-color-neutral-400)"
                              : "var(--tw-color-neutral-200)",
                        }}
                      />
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
