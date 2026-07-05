import { loadJSON } from "@/lib/content/loader";
import type { Resume } from "@/types/content";
import { CCREditor } from "./CCREditor";

export default function CCRPage() {
  let fileResume: Resume;
  try {
    fileResume = loadJSON<Resume>("resume/main.json");
  } catch {
    fileResume = { basics: {} as Resume["basics"], summary: "", summaryEn: "", experience: [], education: [], skills: [], languages: [], awards: [] } as Resume;
  }

  return <CCREditor fileResume={fileResume} />;
}
