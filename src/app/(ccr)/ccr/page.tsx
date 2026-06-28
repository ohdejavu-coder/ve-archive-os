import { loadWorks } from "@/lib/content/works";
import { UnifiedEditor } from "@/components/ccr/UnifiedEditor";

export default function CCRDashboard() {
  const works = loadWorks();

  return (
    <div className="max-w-6xl">
      <UnifiedEditor works={works} />
    </div>
  );
}
