"use client";

import { useState } from "react";
import { ExportPanel } from "./ExportPanel";
import { Plus, Trash2 } from "lucide-react";
import type { Resume, ResumeExperience, ResumeEducation, ResumeSkill } from "@/types/content";

interface Props {
  resume: Resume;
}

/**
 * Interactive resume editor.
 * Edit all resume fields + export final JSON for file replacement.
 */
export function ResumeEditorForm({ resume }: Props) {
  const [data, setData] = useState<Resume>(structuredClone(resume));
  const [showExport, setShowExport] = useState(false);

  function update<T>(setter: (d: Resume) => T) {
    setData((prev) => {
      const next = structuredClone(prev);
      setter(next);
      return next;
    });
  }

  function addExperience() {
    update((d) => {
      d.experience.push({
        company: "", companyEn: "",
        role: "", roleEn: "",
        startDate: "", endDate: "",
        description: "", descriptionEn: "",
        highlights: [],
      });
    });
  }

  function removeExperience(i: number) {
    update((d) => { d.experience.splice(i, 1); });
  }

  function addEducation() {
    update((d) => {
      d.education.push({
        institution: "", institutionEn: "",
        degree: "", degreeEn: "",
        field: "", fieldEn: "",
        startDate: "", endDate: "",
      });
    });
  }

  function removeEducation(i: number) {
    update((d) => { d.education.splice(i, 1); });
  }

  function addSkill() {
    update((d) => {
      d.skills.push({ name: "", nameEn: "", category: "", level: 3 });
    });
  }

  function removeSkill(i: number) {
    update((d) => { d.skills.splice(i, 1); });
  }

  function addAward() {
    update((d) => {
      d.awards.push({ title: "", titleEn: "", year: new Date().getFullYear(), issuer: "" });
    });
  }

  function removeAward(i: number) {
    update((d) => { d.awards.splice(i, 1); });
  }

  const inputClass = "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-neutral-500 mb-1";

  return (
    <div className="space-y-8 max-w-3xl">
      {/* ---- Basics ---- */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="姓名" value={data.basics.name} onChange={(v) => update((d) => { d.basics.name = v; })} />
          <Field label="Name (EN)" value={data.basics.nameEn} onChange={(v) => update((d) => { d.basics.nameEn = v; })} />
          <Field label="职位" value={data.basics.title} onChange={(v) => update((d) => { d.basics.title = v; })} />
          <Field label="Title (EN)" value={data.basics.titleEn} onChange={(v) => update((d) => { d.basics.titleEn = v; })} />
          <Field label="地点" value={data.basics.location} onChange={(v) => update((d) => { d.basics.location = v; })} />
          <Field label="邮箱" value={data.basics.email} onChange={(v) => update((d) => { d.basics.email = v; })} />
          <Field label="网站" value={data.basics.website ?? ""} onChange={(v) => update((d) => { d.basics.website = v; })} />
          <Field label="电话" value={data.basics.phone ?? ""} onChange={(v) => update((d) => { d.basics.phone = v; })} />
        </div>
        <div>
          <label className={labelClass}>个人简介 (中文)</label>
          <textarea className={inputClass} rows={3} value={data.summary}
            onChange={(e) => update((d) => { d.summary = e.target.value; })} />
        </div>
        <div>
          <label className={labelClass}>Summary (EN)</label>
          <textarea className={inputClass} rows={3} value={data.summaryEn}
            onChange={(e) => update((d) => { d.summaryEn = e.target.value; })} />
        </div>
      </section>

      {/* ---- Experience ---- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">工作经历 ({data.experience.length})</h3>
          <button onClick={addExperience} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
            <Plus size={12} /> 添加
          </button>
        </div>
        {data.experience.map((exp, i) => (
          <ExpCard key={i} exp={exp} index={i} onChange={(e) => update((d) => { d.experience[i] = e; })} onRemove={() => removeExperience(i)} />
        ))}
      </section>

      {/* ---- Education ---- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">教育背景 ({data.education.length})</h3>
          <button onClick={addEducation} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
            <Plus size={12} /> 添加
          </button>
        </div>
        {data.education.map((edu, i) => (
          <EduCard key={i} edu={edu} index={i} onChange={(e) => update((d) => { d.education[i] = e; })} onRemove={() => removeEducation(i)} />
        ))}
      </section>

      {/* ---- Skills ---- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">技能 ({data.skills.length})</h3>
          <button onClick={addSkill} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
            <Plus size={12} /> 添加
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {data.skills.map((skill, i) => (
            <SkillRow key={i} skill={skill} index={i} onChange={(s) => update((d) => { d.skills[i] = s; })} onRemove={() => removeSkill(i)} />
          ))}
        </div>
      </section>

      {/* ---- Awards ---- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">获奖与荣誉 ({data.awards.length})</h3>
          <button onClick={addAward} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
            <Plus size={12} /> 添加
          </button>
        </div>
        {data.awards.map((award, i) => (
          <AwardRow key={i} award={award} index={i} onChange={(a) => update((d) => { d.awards[i] = a; })} onRemove={() => removeAward(i)} />
        ))}
      </section>

      {/* ---- Languages ---- */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">语言能力</h3>
        {data.languages.map((lang, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input className={inputClass + " flex-1"} placeholder="语言" value={lang.name}
              onChange={(e) => update((d) => { d.languages[i].name = e.target.value; })} />
            <input className={inputClass + " flex-1"} placeholder="Language (EN)" value={lang.nameEn}
              onChange={(e) => update((d) => { d.languages[i].nameEn = e.target.value; })} />
            <input className={inputClass + " w-24"} placeholder="等级" value={lang.level}
              onChange={(e) => update((d) => { d.languages[i].level = e.target.value; })} />
          </div>
        ))}
      </section>

      {/* ---- Export ---- */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setShowExport(!showExport)}
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
        >
          {showExport ? "隐藏导出" : "导出 JSON"}
        </button>
        {showExport && (
          <div className="mt-4">
            <ExportPanel data={data} targetPath="content/resume/main.json" label="简历数据" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 mb-1">{label}</label>
      <input className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ExpCard({ exp, index, onChange, onRemove }: { exp: ResumeExperience; index: number; onChange: (e: ResumeExperience) => void; onRemove: () => void }) {
  const inputClass = "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent";
  return (
    <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400">#{index + 1}</span>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className={inputClass} placeholder="公司" value={exp.company} onChange={(e) => onChange({ ...exp, company: e.target.value })} />
        <input className={inputClass} placeholder="Company (EN)" value={exp.companyEn} onChange={(e) => onChange({ ...exp, companyEn: e.target.value })} />
        <input className={inputClass} placeholder="职位" value={exp.role} onChange={(e) => onChange({ ...exp, role: e.target.value })} />
        <input className={inputClass} placeholder="Role (EN)" value={exp.roleEn} onChange={(e) => onChange({ ...exp, roleEn: e.target.value })} />
      </div>
      <div className="flex gap-3">
        <input className={inputClass + " w-32"} placeholder="开始" value={exp.startDate} onChange={(e) => onChange({ ...exp, startDate: e.target.value })} />
        <input className={inputClass + " w-32"} placeholder="结束" value={exp.endDate ?? ""} onChange={(e) => onChange({ ...exp, endDate: e.target.value || undefined })} />
      </div>
      <textarea className={inputClass} rows={2} placeholder="描述 (中文)" value={exp.description} onChange={(e) => onChange({ ...exp, description: e.target.value })} />
      <textarea className={inputClass} rows={2} placeholder="Description (EN)" value={exp.descriptionEn} onChange={(e) => onChange({ ...exp, descriptionEn: e.target.value })} />
    </div>
  );
}

function EduCard({ edu, index, onChange, onRemove }: { edu: ResumeEducation; index: number; onChange: (e: ResumeEducation) => void; onRemove: () => void }) {
  const inputClass = "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent";
  return (
    <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400">#{index + 1}</span>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className={inputClass} placeholder="学校" value={edu.institution} onChange={(e) => onChange({ ...edu, institution: e.target.value })} />
        <input className={inputClass} placeholder="Institution (EN)" value={edu.institutionEn} onChange={(e) => onChange({ ...edu, institutionEn: e.target.value })} />
        <input className={inputClass} placeholder="学位" value={edu.degree} onChange={(e) => onChange({ ...edu, degree: e.target.value })} />
        <input className={inputClass} placeholder="Degree (EN)" value={edu.degreeEn} onChange={(e) => onChange({ ...edu, degreeEn: e.target.value })} />
        <input className={inputClass} placeholder="专业" value={edu.field} onChange={(e) => onChange({ ...edu, field: e.target.value })} />
        <input className={inputClass} placeholder="Field (EN)" value={edu.fieldEn} onChange={(e) => onChange({ ...edu, fieldEn: e.target.value })} />
      </div>
      <div className="flex gap-3">
        <input className={inputClass + " w-32"} placeholder="开始" value={edu.startDate} onChange={(e) => onChange({ ...edu, startDate: e.target.value })} />
        <input className={inputClass + " w-32"} placeholder="结束" value={edu.endDate} onChange={(e) => onChange({ ...edu, endDate: e.target.value })} />
      </div>
    </div>
  );
}

function SkillRow({ skill, index, onChange, onRemove }: { skill: ResumeSkill; index: number; onChange: (s: ResumeSkill) => void; onRemove: () => void }) {
  const inputClass = "w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent";
  return (
    <div className="flex items-center gap-2 p-2 rounded-md border border-neutral-100 dark:border-neutral-800">
      <input className={inputClass + " flex-1"} placeholder="技能名" value={skill.name} onChange={(e) => onChange({ ...skill, name: e.target.value })} />
      <input className={inputClass + " flex-1"} placeholder="Name (EN)" value={skill.nameEn} onChange={(e) => onChange({ ...skill, nameEn: e.target.value })} />
      <input className={inputClass + " w-20"} placeholder="类别" value={skill.category} onChange={(e) => onChange({ ...skill, category: e.target.value })} />
      <select className={inputClass + " w-16"} value={skill.level} onChange={(e) => onChange({ ...skill, level: Number(e.target.value) })}>
        {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <button onClick={onRemove} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={12} /></button>
    </div>
  );
}

function AwardRow({ award, index, onChange, onRemove }: { award: { title: string; titleEn: string; year: number; issuer: string }; index: number; onChange: (a: typeof award) => void; onRemove: () => void }) {
  const inputClass = "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent";
  return (
    <div className="flex items-center gap-3 p-3 rounded-md border border-neutral-100 dark:border-neutral-800">
      <span className="text-xs text-neutral-400">#{index + 1}</span>
      <input className={inputClass + " flex-1"} placeholder="奖项名称" value={award.title} onChange={(e) => onChange({ ...award, title: e.target.value })} />
      <input className={inputClass + " flex-1"} placeholder="Title (EN)" value={award.titleEn} onChange={(e) => onChange({ ...award, titleEn: e.target.value })} />
      <input className={inputClass + " w-24"} placeholder="年份" type="number" value={award.year} onChange={(e) => onChange({ ...award, year: Number(e.target.value) })} />
      <input className={inputClass + " flex-1"} placeholder="颁发机构" value={award.issuer} onChange={(e) => onChange({ ...award, issuer: e.target.value })} />
      <button onClick={onRemove} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
    </div>
  );
}
