/**
 * BoldText — renders **bold** markdown + line-break formatting.
 *
 * Supports:
 *   **text** → <strong>text</strong>
 *   \n\n    → paragraph break (new <p>)
 *   \n      → single line break (<br>)
 */
export function BoldText({ text }: { text: string }) {
  if (!text) return null;

  // Split on double-newline to create paragraphs
  const paragraphs = text.split(/\n\s*\n/);

  return (
    <>
      {paragraphs.map((para, pi) => {
        // Handle single newlines within a paragraph as <br>
        const lines = para.split("\n");

        return (
          <p key={pi} className="mb-1.5 last:mb-0">
            {lines.map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                <BoldSpan text={line} />
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

/** Renders **bold** spans within a single line of text */
function BoldSpan({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
