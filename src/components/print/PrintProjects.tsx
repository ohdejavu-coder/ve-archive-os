/**
 * PrintProjects — selected projects with thumbnail grid.
 * 3-column grid, each project shows thumbnail + name + type + outcome.
 */
interface ProjectItem {
  name: string;
  type: string;
  outcome: string;
  thumbnail: string;
}

interface PrintProjectsProps {
  projects: ProjectItem[];
}

export function PrintProjects({ projects }: PrintProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <div className="print-avoid-break mb-6">
      <div className="grid grid-cols-3 gap-4">
        {projects.map((proj, i) => (
          <div key={i} className="print-avoid-break">
            {/* Thumbnail */}
            <div className="aspect-[4/3] bg-[#f5f5f5] rounded overflow-hidden mb-2 border border-[#e8e8e8]">
              {proj.thumbnail ? (
                <img
                  src={proj.thumbnail}
                  alt={proj.name}
                  className="w-full h-full object-cover print-thumb"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#cccccc] text-[7pt]">
                  {proj.name.slice(0, 1)}
                </div>
              )}
            </div>
            {/* Project info */}
            <p className="text-[8.5pt] font-semibold text-[#111111] leading-snug">
              {proj.name}
            </p>
            <p className="text-[7.5pt] text-[#888888] leading-snug">{proj.type}</p>
            <p className="text-[7.5pt] text-[#999999] leading-snug mt-0.5">{proj.outcome}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
