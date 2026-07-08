import { PrintSection } from "@/components/print/PrintSection";
import { PrintHeader } from "@/components/print/PrintHeader";
import { PrintProfile } from "@/components/print/PrintProfile";
import { PrintExperienceList } from "@/components/print/PrintExperienceList";
import { PrintEducation } from "@/components/print/PrintEducation";
import type { BuilderData } from "./defaultData";

interface A4PreviewProps {
  data: BuilderData;
}

export function A4Preview({ data }: A4PreviewProps) {
  const { basics, summary, experience, education } = data;

  const titleMain = basics.title.split("/").map((s) => s.trim()).filter(Boolean);
  const titleAlt = (basics as any).alternateTitles
    ? (basics as any).alternateTitles.split("\n").map((s: string) => s.trim()).filter(Boolean)
    : [];
  const subtitleLines = [...titleMain, ...titleAlt];

  const expEntries = experience.map((e) => ({
    role: e.role,
    company: e.company,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
    highlights: [] as string[],
  }));

  return (
    <div className="print-a4-page" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)", borderRadius: 2 }}>
      <PrintHeader
        name={basics.name}
        subtitle={subtitleLines}
        email={basics.email}
        phone={basics.phone}
        website={basics.website}
      />

      <PrintSection label="简介">
        <PrintProfile text={summary} />
      </PrintSection>

      {expEntries.length > 0 && (
        <PrintSection label="工作经历">
          <PrintExperienceList experiences={expEntries} />
        </PrintSection>
      )}

      {education.length > 0 && (
        <PrintSection label="教育背景">
          {education.map((edu, i) => (
            <div key={i} className="mb-3">
              <p className="text-[10.5pt] text-[#333333] leading-relaxed">
                <span className="font-semibold">{edu.institution}</span>
                <span className="text-[#888888] mx-1.5">·</span>
                <span>{edu.degree} — {edu.field}</span>
                <span className="text-[#888888] mx-1.5">·</span>
                <span className="text-[#888888]">{edu.startDate} – {edu.endDate}</span>
              </p>
            </div>
          ))}
        </PrintSection>
      )}
    </div>
  );
}
