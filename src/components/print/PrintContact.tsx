/**
 * PrintContact — minimal contact footer.
 * Single line at the bottom of page 2.
 */
interface PrintContactProps {
  email: string;
  phone?: string;
  website?: string;
}

export function PrintContact({ email, phone, website }: PrintContactProps) {
  const parts = [
    email ? `Email: ${email}` : "",
    phone ? `Phone: ${phone}` : "",
    website ? `Web: ${website}` : "",
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <div className="print-avoid-break">
      <p className="text-[10pt] text-[#888888] leading-relaxed">
        {parts.join("  ·  ")}
      </p>
    </div>
  );
}
