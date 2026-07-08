import { BoldText } from "./BoldText";

/**
 * PrintProfile — short professional summary paragraph.
 */
interface PrintProfileProps {
  text: string;
}

export function PrintProfile({ text }: PrintProfileProps) {
  return (
    <div>
      <p className="text-[12pt] leading-relaxed text-[#333333]">
        <BoldText text={text} />
      </p>
    </div>
  );
}
