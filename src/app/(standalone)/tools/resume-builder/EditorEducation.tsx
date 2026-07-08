interface EduEntry {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface EditorEducationProps {
  index: number;
  data: EduEntry;
  onChange: (field: string, value: string) => void;
  onRemove: () => void;
}

const IC = "w-full px-2.5 py-1.5 text-[13px] border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:border-transparent transition-colors";

export function EditorEducation({ index, data, onChange, onRemove }: EditorEducationProps) {
  return (
    <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-neutral-500">教育 #{index + 1}</span>
        <button onClick={onRemove} className="text-[13px] text-red-400 hover:text-red-600 transition-colors">
          删除
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">学校</label>
          <input className={IC} value={data.institution} onChange={(e) => onChange("institution", e.target.value)} placeholder="学校名称" />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">学位</label>
          <input className={IC} value={data.degree} onChange={(e) => onChange("degree", e.target.value)} placeholder="本科" />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">专业</label>
          <input className={IC} value={data.field} onChange={(e) => onChange("field", e.target.value)} placeholder="专业名称" />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">开始日期</label>
          <input className={IC} value={data.startDate} onChange={(e) => onChange("startDate", e.target.value)} placeholder="2024.09" />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-neutral-400 mb-0.5">结束日期</label>
          <input className={IC} value={data.endDate} onChange={(e) => onChange("endDate", e.target.value)} placeholder="至今" />
        </div>
      </div>
    </div>
  );
}
