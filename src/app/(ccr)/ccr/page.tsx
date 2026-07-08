import { loadJSON } from "@/lib/content/loader";
import type { Resume } from "@/types/content";
import { CCREditor } from "./CCREditor";

export default function CCRPage() {
  let fileResume: Resume;
  try {
    fileResume = loadJSON<Resume>("resume/main.json");
  } catch {
    fileResume = {
      basics: { name: "", nameEn: "", title: "", titleEn: "", location: "", email: "" },
      summary: "", summaryEn: "",
      coreStrengths: [], experience: [], education: [], skills: [], languages: [], awards: [], projects: [],
    } as Resume;
  }

  return <CCREditor fileResume={fileResume} />;
}
