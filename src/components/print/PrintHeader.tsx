/**
 * PrintHeader — top section of the A4 resume.
 * Large name + English subtitle + single-line contact info.
 */
interface PrintHeaderProps {
  name: string;
  subtitle: string[];
  email: string;
  phone?: string;
  website?: string;
}

export function PrintHeader({ name, subtitle, email, phone, website }: PrintHeaderProps) {
  const contactParts = [email, phone, website].filter(Boolean);

  return (
    <div className="text-center mb-6">
      {/* Name — visual first tier */}
      <h1 className="text-[40pt] font-bold leading-none tracking-[-0.5pt] text-[#111111] mb-3">
        {name}
      </h1>

      {/* English subtitle — one line each */}
      <div className="mb-4">
        {subtitle.map((line, i) => (
          <p key={i} className="text-[14pt] leading-relaxed text-[#555555]">
            {line}
          </p>
        ))}
      </div>

      {/* Divider line */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px bg-[#e0e0e0] flex-1 max-w-[80px]" />
        <div className="w-2 h-2 rounded-full print-accent-bg" />
        <div className="h-px bg-[#e0e0e0] flex-1 max-w-[80px]" />
      </div>

      {/* Contact line — single row */}
      {contactParts.length > 0 && (
        <p className="text-[10pt] text-[#888888]">
          {contactParts.join("  ·  ")}
        </p>
      )}
    </div>
  );
}
