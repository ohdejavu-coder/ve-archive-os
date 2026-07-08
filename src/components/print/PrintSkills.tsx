/**
 * PrintSkills — visual skill bars (name + filled bar).
 * Avoids the "boring list" look — each skill has a name on the left
 * and a proportional bar on the right.
 */
interface SkillItem {
  name: string;
  level: number; // 1–5
}

interface PrintSkillsProps {
  skills: SkillItem[];
}

export function PrintSkills({ skills }: PrintSkillsProps) {
  return (
    <div className="print-avoid-break mb-6">
      <div className="grid grid-cols-1 gap-2">
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Skill name — fixed width for alignment */}
            <span className="text-[9pt] text-[#333333] w-[150px] shrink-0">
              {skill.name}
            </span>
            {/* Bar */}
            <div className="flex-1 print-skill-bar">
              <div
                className="print-skill-bar-fill"
                style={{ width: `${(skill.level / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
