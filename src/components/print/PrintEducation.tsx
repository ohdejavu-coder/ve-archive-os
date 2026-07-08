/**
 * PrintEducation — minimal education entry.
 * Single line: institution · degree · field · dates
 */
interface PrintEducationProps {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export function PrintEducation({
  institution,
  degree,
  field,
  startDate,
  endDate,
}: PrintEducationProps) {
  return (
    <div className="print-avoid-break mb-6">
      <p className="text-[12pt] text-[#333333] leading-relaxed">
        <span className="font-semibold">{institution}</span>
        <span className="text-[#888888] mx-1.5">·</span>
        <span>{degree} — {field}</span>
        <span className="text-[#888888] mx-1.5">·</span>
        <span className="text-[#888888]">{startDate} – {endDate}</span>
      </p>
    </div>
  );
}
