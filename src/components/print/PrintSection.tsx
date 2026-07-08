/**
 * PrintSection — generic section wrapper for the A4 print resume.
 * Renders a section label with a red accent line, then children below.
 */
interface PrintSectionProps {
  label: string;
  children: React.ReactNode;
}

export function PrintSection({ label, children }: PrintSectionProps) {
  return (
    <div className="mb-5">
      {/* Red accent line + label */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-px print-accent-bg" />
        <span
          className="text-[15pt] font-semibold uppercase tracking-[0.15em] text-[#111111]"
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
