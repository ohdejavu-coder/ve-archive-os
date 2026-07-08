interface ExpEntry {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EditorExperienceProps {
  index: number;
  data: ExpEntry;
  onChange: (field: string, value: string) => void;
  onRemove: () => void;
}

const IC = "w-full px-2.5 py-1.5 text-[13px] border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:border-transparent transition-colors";

export function EditorExperience({ index, data, onChange, onRemove }: EditorExperienceProps) {
  return (
    <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-neutral-500">经历 #{index + 1}</span>
        <button onClick={onRemove} className="text-[13px] text-red-400 hover:text-red-600 transition-colors">
          删除
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">公司 / 项目</label>
          <input className={IC} value={data.company} onChange={(e) => onChange("company", e.target.value)} placeholder="公司名称" />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">职位</label>
          <input className={IC} value={data.role} onChange={(e) => onChange("role", e.target.value)} placeholder="岗位名称" />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">开始日期</label>
          <input className={IC} value={data.startDate} onChange={(e) => onChange("startDate", e.target.value)} placeholder="2024.01" />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">结束日期</label>
          <input className={IC} value={data.endDate} onChange={(e) => onChange("endDate", e.target.value)} placeholder="至今" />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">
          描述与成果 <span className="text-neutral-300">（支持 **粗体** 和换行）</span>
        </label>
        <textarea
          className={IC + " resize-y font-mono text-[13px] leading-relaxed"}
          rows={5}
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder={"描述工作内容和项目成果...\n\n· 成果 1\n· 成果 2"}
        />
      </div>
    </div>
  );
}
