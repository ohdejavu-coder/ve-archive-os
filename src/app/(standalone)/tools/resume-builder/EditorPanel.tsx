import { EditorSection } from "./EditorSection";
import { EditorExperience } from "./EditorExperience";
import { EditorEducation } from "./EditorEducation";
import type { BuilderData } from "./defaultData";

interface EditorPanelProps {
  data: BuilderData;
  setData: React.Dispatch<React.SetStateAction<BuilderData>>;
  updateBasic: (key: string, value: string) => void;
  reset: () => void;
}

export function EditorPanel({ data, setData, updateBasic, reset }: EditorPanelProps) {
  const { basics, summary, experience, education } = data;

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const updateExperience = (i: number, field: string, value: string) => {
    setData((prev) => {
      const n = [...prev.experience];
      n[i] = { ...n[i], [field]: value };
      return { ...prev, experience: n };
    });
  };

  const removeExperience = (i: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, j) => j !== i),
    }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", field: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const updateEducation = (i: number, field: string, value: string) => {
    setData((prev) => {
      const n = [...prev.education];
      n[i] = { ...n[i], [field]: value };
      return { ...prev, education: n };
    });
  };

  const removeEducation = (i: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, j) => j !== i),
    }));
  };

  const IC = "w-full px-3 py-2 text-[13px] border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:border-transparent transition-colors";
  const LC = "block text-[12px] font-medium text-neutral-500 mb-1.5";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">简历排版工具</h1>
          <p className="text-xs text-neutral-400 mt-0.5">填表 → 右侧实时预览 → 打印导出 PDF</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="px-3 py-1.5 text-xs rounded border border-neutral-300 text-neutral-500 hover:bg-neutral-50 transition-colors">
            重置
          </button>
          <button onClick={() => window.print()} className="px-4 py-1.5 text-xs rounded font-medium bg-neutral-900 text-white hover:opacity-80 transition-opacity">
            导出 PDF
          </button>
        </div>
      </div>

      {/* Basics */}
      <EditorSection title="基本信息" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-medium text-neutral-500 mb-1">姓名</label>
            <input className={IC} value={basics.name} onChange={(e) => updateBasic("name", e.target.value)} placeholder="你的姓名" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-neutral-500 mb-1">主身份</label>
            <input className={IC + " text-[13px]"} value={basics.title} onChange={(e) => updateBasic("title", e.target.value)} placeholder="AI-Powered Content Creator" />
          </div>
          <div className="col-span-2">
            <label className="block text-[12px] font-medium text-neutral-500 mb-1">
              副身份 <span className="text-neutral-300">（每行一个，显示在姓名下方）</span>
            </label>
            <textarea
              className={IC + " text-[13px] resize-y"}
              rows={2}
              value={(basics as any).alternateTitles ?? ""}
              onChange={(e) => updateBasic("alternateTitles", e.target.value)}
              placeholder={"Film Production Student\nVisual Storytelling"}
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-neutral-500 mb-1">邮箱</label>
            <input className={IC} value={basics.email} onChange={(e) => updateBasic("email", e.target.value)} placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-neutral-500 mb-1">电话</label>
            <input className={IC} value={basics.phone} onChange={(e) => updateBasic("phone", e.target.value)} placeholder="手机号码" />
          </div>
          <div className="col-span-2">
            <label className="block text-[12px] font-medium text-neutral-500 mb-1">网站</label>
            <input className={IC} value={basics.website} onChange={(e) => updateBasic("website", e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </EditorSection>

      {/* Summary */}
      <EditorSection title="简介" defaultOpen>
        <div>
          <label className="block text-[12px] font-medium text-neutral-500 mb-1">
            个人简介 <span className="text-neutral-300">（支持 **粗体** 和换行）</span>
          </label>
          <textarea
            className={IC + " resize-y"}
            rows={3}
            value={summary}
            onChange={(e) => setData((prev) => ({ ...prev, summary: e.target.value }))}
            placeholder="简短介绍你的职业背景和核心能力..."
          />
        </div>
      </EditorSection>

      {/* Experience */}
      <EditorSection title={`工作经历（${experience.length}）`} defaultOpen>
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <EditorExperience
              key={i}
              index={i}
              data={exp}
              onChange={(field, value) => updateExperience(i, field, value)}
              onRemove={() => removeExperience(i)}
            />
          ))}
          <button onClick={addExperience} className="w-full py-2 text-xs font-medium text-neutral-500 border border-dashed border-neutral-300 rounded hover:border-neutral-500 hover:text-neutral-700 transition-colors">
            + 添加工作经历
          </button>
        </div>
      </EditorSection>

      {/* Education */}
      <EditorSection title={`教育背景（${education.length}）`} defaultOpen>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <EditorEducation
              key={i}
              index={i}
              data={edu}
              onChange={(field, value) => updateEducation(i, field, value)}
              onRemove={() => removeEducation(i)}
            />
          ))}
          <button onClick={addEducation} className="w-full py-2 text-xs font-medium text-neutral-500 border border-dashed border-neutral-300 rounded hover:border-neutral-500 hover:text-neutral-700 transition-colors">
            + 添加教育背景
          </button>
        </div>
      </EditorSection>

      {/* Footer */}
      <div className="pt-4 border-t border-neutral-200 text-[10px] text-neutral-400 leading-relaxed">
        <p>数据自动保存到浏览器本地存储。点击「导出 PDF」或 Ctrl+P 打印。</p>
        <p className="mt-1">提示：打印前在浏览器打印对话框中取消勾选「页眉和页脚」。</p>
      </div>
    </div>
  );
}
