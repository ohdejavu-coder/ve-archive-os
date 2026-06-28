import { loadWorks } from "@/lib/content/works";
import { WorksEditor } from "@/components/ccr/WorksEditor";

export default function CCRWorksPage() {
  const works = loadWorks();

  return (
    <div className="max-w-5xl">
      <WorksEditor works={works} />
    </div>
  );
}
