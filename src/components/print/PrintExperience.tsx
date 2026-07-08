import { BoldText } from "./BoldText";

/**
 * PrintExperience — single experience entry.
 * Two-column layout: left = date/company, right = role + description + highlights.
 */
interface PrintExperienceProps {
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}

export function PrintExperience({
  role,
  company,
  startDate,
  endDate,
  description,
  highlights,
}: PrintExperienceProps) {
  const dateStr = endDate ? `${startDate} — ${endDate}` : `${startDate} — Present`;

  return (
    <div className="print-avoid-break mb-5">
      <div className="flex gap-5">
        {/* Left column: date + company */}
        <div className="w-[140px] shrink-0">
          <p className="text-[10pt] text-[#666666] leading-snug mb-0.5">{dateStr}</p>
          <p className="text-[10pt] text-[#888888] leading-snug"><BoldText text={company} /></p>
        </div>

        {/* Right column: role + description + highlights */}
        <div className="flex-1 min-w-0">
          <p className="text-[13pt] font-semibold text-[#111111] leading-snug mb-1.5">
            <BoldText text={role} />
          </p>
          <p className="text-[12pt] text-[#444444] leading-relaxed mb-2.5">
            <BoldText text={description} />
          </p>
          {highlights.length > 0 && (
            <ul className="space-y-1.5">
              {highlights.map((h, j) => (
                <li key={j} className="text-[11pt] text-[#555555] leading-relaxed flex items-start gap-1.5">
                  <span className="text-[#888888] mt-[3px] shrink-0">·</span>
                  <span><BoldText text={h} /></span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
