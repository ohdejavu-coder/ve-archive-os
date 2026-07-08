import { PrintExperience } from "./PrintExperience";

interface ExpEntry {
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}

interface PrintExperienceListProps {
  experiences: ExpEntry[];
}

export function PrintExperienceList({ experiences }: PrintExperienceListProps) {
  if (experiences.length === 0) return null;

  return (
    <div>
      {experiences.map((exp, i) => (
        <PrintExperience
          key={i}
          role={exp.role}
          company={exp.company}
          startDate={exp.startDate}
          endDate={exp.endDate}
          description={exp.description}
          highlights={exp.highlights}
        />
      ))}
    </div>
  );
}
