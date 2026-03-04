/**
 * Options 设置页 - 完整的信息管理界面
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

import { useState, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import type {
  ResumeData,
  EducationItem,
  InternshipItem,
  ProjectItem,
  AwardItem,
  CustomField,
} from "@/types/resume";
import { createEmptyResumeData, generateId } from "@/types/resume";
import ResumeUploader from "@/components/ResumeUploader";
import TextReference from "@/components/TextReference";
import AutoTextArea from "@/components/AutoTextArea";
import {
  IconUpload,
  IconUser,
  IconAcademic,
  IconBriefcase,
  IconRocket,
  IconWrench,
  IconTrophy,
  IconChat,
  IconCog,
  IconDatabase,
} from "@/components/Icons";
import { extractTextFromPDF } from "@/services/pdfParser";
import { extractTextFromDocx } from "@/services/docxParser";
import type { ReactNode } from "react";

type TabKey =
  | "upload"
  | "basic"
  | "education"
  | "internship"
  | "project"
  | "skills"
  | "awards"
  | "selfEvaluation"
  | "custom"
  | "data";

interface TabDef {
  key: TabKey;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
  group: "main" | "extra" | "system";
}

const TABS: TabDef[] = [
  { key: "upload", label: "简历解析", icon: IconUpload, group: "main" },
  { key: "basic", label: "基本信息", icon: IconUser, group: "main" },
  { key: "education", label: "教育经历", icon: IconAcademic, group: "main" },
  { key: "internship", label: "实习经历", icon: IconBriefcase, group: "main" },
  { key: "project", label: "项目经历", icon: IconRocket, group: "main" },
  { key: "skills", label: "技能", icon: IconWrench, group: "extra" },
  { key: "awards", label: "荣誉/证书", icon: IconTrophy, group: "extra" },
  { key: "selfEvaluation", label: "自我评价", icon: IconChat, group: "extra" },
  { key: "custom", label: "自定义字段", icon: IconCog, group: "extra" },
  { key: "data", label: "数据管理", icon: IconDatabase, group: "system" },
];

export default function Options() {
  const initialTab = (window.location.hash.slice(1) || "upload") as TabKey;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const { data, setData, loading } = useStorage<ResumeData>("resumeData");
  const [referenceText, setReferenceText] = useState("");
  const [saved, setSaved] = useState(false);

  const resumeData = data ?? createEmptyResumeData();

  const handleSave = useCallback(
    async (updated: ResumeData) => {
      await setData(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    },
    [setData],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  const mainTabs = TABS.filter((t) => t.group === "main");
  const extraTabs = TABS.filter((t) => t.group === "extra");
  const systemTabs = TABS.filter((t) => t.group === "system");

  const renderTabButton = (tab: TabDef) => (
    <li key={tab.key}>
      <button
        onClick={() => {
          setActiveTab(tab.key);
          window.location.hash = tab.key;
        }}
        className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer flex items-center gap-2.5 ${
          activeTab === tab.key
            ? "bg-blue-600 text-white font-medium shadow-sm"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        }`}
      >
        <tab.icon
          className={`w-[18px] h-[18px] shrink-0 ${
            activeTab === tab.key ? "text-white" : "text-gray-400"
          }`}
        />
        {tab.label}
      </button>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-100/70 flex">
      {/* 左侧导航 */}
      <nav className="w-56 bg-white border-r border-gray-200/80 min-h-screen flex flex-col shrink-0">
        <div className="px-5 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-gray-800 leading-tight">ResumeVault</h1>
              <p className="text-[11px] text-gray-400">简历信息管理</p>
            </div>
          </div>
        </div>

        <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          <div>
            <div className="px-3 mb-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              核心
            </div>
            <ul className="space-y-0.5">{mainTabs.map(renderTabButton)}</ul>
          </div>
          <div>
            <div className="px-3 mb-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              补充
            </div>
            <ul className="space-y-0.5">{extraTabs.map(renderTabButton)}</ul>
          </div>
          <div>
            <div className="px-3 mb-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              系统
            </div>
            <ul className="space-y-0.5">{systemTabs.map(renderTabButton)}</ul>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 text-[11px] text-gray-300">
          v1.0.0 · 数据仅存本地
        </div>
      </nav>

      {/* 右侧内容区 */}
      <div className="flex-1 flex min-h-screen">
        {referenceText && (
          <div className="w-[420px] shrink-0 border-r border-gray-200/80 bg-white">
            <TextReference
              text={referenceText}
              onClose={() => setReferenceText("")}
            />
          </div>
        )}

        <main className="flex-1 py-8 px-10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-8 relative">
              {saved && (
                <div className="absolute top-5 right-6 text-[13px] text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium animate-pulse">
                  已保存
                </div>
              )}

              {activeTab === "upload" && (
                <UploadTab
                  onTextExtracted={setReferenceText}
                  onNavigate={(tab: TabKey) => {
                    setActiveTab(tab);
                    window.location.hash = tab;
                  }}
                />
              )}
              {activeTab === "basic" && (
                <BasicInfoTab data={resumeData} onSave={handleSave} />
              )}
              {activeTab === "education" && (
                <EducationTab data={resumeData} onSave={handleSave} />
              )}
              {activeTab === "internship" && (
                <InternshipTab data={resumeData} onSave={handleSave} />
              )}
              {activeTab === "project" && (
                <ProjectTab data={resumeData} onSave={handleSave} />
              )}
              {activeTab === "skills" && (
                <SkillsTab data={resumeData} onSave={handleSave} />
              )}
              {activeTab === "awards" && (
                <AwardsTab data={resumeData} onSave={handleSave} />
              )}
              {activeTab === "selfEvaluation" && (
                <SelfEvaluationTab data={resumeData} onSave={handleSave} />
              )}
              {activeTab === "custom" && (
                <CustomTab data={resumeData} onSave={handleSave} />
              )}
              {activeTab === "data" && (
                <DataManagementTab data={resumeData} onImport={handleSave} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ==================== Upload Tab ==================== */

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {desc && <p className="text-sm text-gray-400 mt-1">{desc}</p>}
    </div>
  );
}

function UploadTab({
  onTextExtracted,
  onNavigate,
}: {
  onTextExtracted: (text: string) => void;
  onNavigate: (tab: TabKey) => void;
}) {
  const [extracting, setExtracting] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = async (file: File) => {
    setExtracting(true);
    setFileName(file.name);
    try {
      let text: string;
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        text = await extractTextFromPDF(file);
      } else {
        text = await extractTextFromDocx(file);
      }
      onTextExtracted(text);
      onNavigate("basic");
    } catch (err) {
      alert("文件解析失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div>
      <SectionHeader title="上传简历" desc="上传 PDF 或 Word 简历，插件将在本地提取文本内容，显示在左侧供你参考填写。" />
      <ResumeUploader onFileSelected={handleFile} loading={extracting} />
      {fileName && !extracting && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2.5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          已解析: {fileName}，请在左侧查看原文，切换到各 Tab 填写信息。
        </div>
      )}
    </div>
  );
}

/* ==================== Basic Info Tab ==================== */

function BasicInfoTab({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [form, setForm] = useState(data.basicInfo);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fields: { key: keyof typeof form; label: string; placeholder: string }[] = [
    { key: "name", label: "姓名", placeholder: "请输入姓名" },
    { key: "gender", label: "性别", placeholder: "如：男 / 女" },
    { key: "birthDate", label: "出生日期", placeholder: "如：2000-01-01" },
    { key: "phone", label: "手机号", placeholder: "请输入手机号" },
    { key: "email", label: "邮箱", placeholder: "请输入邮箱" },
    { key: "politicalStatus", label: "政治面貌", placeholder: "如：共青团员" },
    { key: "ethnicity", label: "民族", placeholder: "如：汉族" },
    { key: "hometown", label: "籍贯", placeholder: "如：广东广州" },
    { key: "currentCity", label: "现居城市", placeholder: "如：北京" },
  ];

  return (
    <div>
      <SectionHeader title="基本信息" desc="填写你的个人基础信息，点击保存后即可在弹窗中一键复制。" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((f) => (
          <FormInput
            key={f.key}
            label={f.label}
            value={form[f.key]}
            onChange={(v) => handleChange(f.key, v)}
            placeholder={f.placeholder}
          />
        ))}
      </div>
      <SaveButton onClick={() => onSave({ ...data, basicInfo: form })} />
    </div>
  );
}

/* ==================== Education Tab ==================== */

function EducationTab({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [items, setItems] = useState<EducationItem[]>(data.education);

  const addItem = () => {
    setItems([
      ...items,
      { id: generateId(), school: "", major: "", degree: "", gpa: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, key: keyof EducationItem, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  };

  return (
    <div>
      <ListSectionHeader title="教育经历" desc="添加你的教育背景信息。" onAdd={addItem} />
      {items.length === 0 && <EmptyHint text="暂无教育经历，点击右上角「新增」添加" />}
      <div className="space-y-5">
        {items.map((item, idx) => (
          <ItemCard key={item.id} index={idx} onRemove={() => removeItem(item.id)}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <FormInput label="学校" value={item.school} onChange={(v) => updateItem(item.id, "school", v)} placeholder="如：清华大学" />
              <FormInput label="专业" value={item.major} onChange={(v) => updateItem(item.id, "major", v)} placeholder="如：计算机科学与技术" />
              <FormInput label="学历/学位" value={item.degree} onChange={(v) => updateItem(item.id, "degree", v)} placeholder="如：本科 / 硕士" />
              <FormInput label="GPA/排名" value={item.gpa} onChange={(v) => updateItem(item.id, "gpa", v)} placeholder="如：3.8/4.0" />
              <FormInput label="开始时间" value={item.startDate} onChange={(v) => updateItem(item.id, "startDate", v)} placeholder="如：2020-09" />
              <FormInput label="结束时间" value={item.endDate} onChange={(v) => updateItem(item.id, "endDate", v)} placeholder="如：2024-06" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">描述</label>
              <AutoTextArea value={item.description} onValueChange={(v) => updateItem(item.id, "description", v)} placeholder="主修课程、学术成果等（支持多行）" />
            </div>
          </ItemCard>
        ))}
      </div>
      <SaveButton onClick={() => onSave({ ...data, education: items })} />
    </div>
  );
}

/* ==================== Internship Tab ==================== */

function InternshipTab({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [items, setItems] = useState<InternshipItem[]>(data.internship);

  const addItem = () => {
    setItems([...items, { id: generateId(), company: "", position: "", startDate: "", endDate: "", description: "" }]);
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
  const updateItem = (id: string, key: keyof InternshipItem, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  };

  return (
    <div>
      <ListSectionHeader title="实习经历" desc="添加你的实习/工作经历。" onAdd={addItem} />
      {items.length === 0 && <EmptyHint text="暂无实习经历，点击右上角「新增」添加" />}
      <div className="space-y-5">
        {items.map((item, idx) => (
          <ItemCard key={item.id} index={idx} onRemove={() => removeItem(item.id)}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <FormInput label="公司" value={item.company} onChange={(v) => updateItem(item.id, "company", v)} placeholder="如：字节跳动" />
              <FormInput label="职位" value={item.position} onChange={(v) => updateItem(item.id, "position", v)} placeholder="如：前端开发实习生" />
              <FormInput label="开始时间" value={item.startDate} onChange={(v) => updateItem(item.id, "startDate", v)} placeholder="如：2024-06" />
              <FormInput label="结束时间" value={item.endDate} onChange={(v) => updateItem(item.id, "endDate", v)} placeholder="如：2024-09" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">工作内容</label>
              <AutoTextArea value={item.description} onValueChange={(v) => updateItem(item.id, "description", v)} placeholder="工作职责、成果描述等（支持多行，所见即所得）" />
            </div>
          </ItemCard>
        ))}
      </div>
      <SaveButton onClick={() => onSave({ ...data, internship: items })} />
    </div>
  );
}

/* ==================== Project Tab ==================== */

function ProjectTab({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [items, setItems] = useState<ProjectItem[]>(data.project);

  const addItem = () => {
    setItems([...items, { id: generateId(), name: "", role: "", techStack: "", startDate: "", endDate: "", description: "" }]);
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
  const updateItem = (id: string, key: keyof ProjectItem, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  };

  return (
    <div>
      <ListSectionHeader title="项目经历" desc="添加你参与过的项目。" onAdd={addItem} />
      {items.length === 0 && <EmptyHint text="暂无项目经历，点击右上角「新增」添加" />}
      <div className="space-y-5">
        {items.map((item, idx) => (
          <ItemCard key={item.id} index={idx} onRemove={() => removeItem(item.id)}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <FormInput label="项目名称" value={item.name} onChange={(v) => updateItem(item.id, "name", v)} placeholder="如：ResumeVault" />
              <FormInput label="角色" value={item.role} onChange={(v) => updateItem(item.id, "role", v)} placeholder="如：前端负责人" />
              <FormInput label="技术栈" value={item.techStack} onChange={(v) => updateItem(item.id, "techStack", v)} placeholder="如：React, TypeScript, Vite" />
              <div />
              <FormInput label="开始时间" value={item.startDate} onChange={(v) => updateItem(item.id, "startDate", v)} placeholder="如：2024-03" />
              <FormInput label="结束时间" value={item.endDate} onChange={(v) => updateItem(item.id, "endDate", v)} placeholder="如：2024-06" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">项目描述</label>
              <AutoTextArea value={item.description} onValueChange={(v) => updateItem(item.id, "description", v)} placeholder="项目背景、你的贡献、成果等（支持多行，所见即所得）" />
            </div>
          </ItemCard>
        ))}
      </div>
      <SaveButton onClick={() => onSave({ ...data, project: items })} />
    </div>
  );
}

/* ==================== Skills Tab ==================== */

function SkillsTab({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [value, setValue] = useState(data.skills);

  return (
    <div>
      <SectionHeader title="技能" desc="自由输入你的技能描述，格式完全由你控制。复制时原样复制。" />
      <AutoTextArea
        value={value}
        onValueChange={setValue}
        placeholder={"如：\n- 熟练掌握 Java、Python、Go\n- 熟悉 React、Vue 等前端框架\n- 了解 MySQL、Redis 等数据库"}
      />
      <SaveButton onClick={() => onSave({ ...data, skills: value })} />
    </div>
  );
}

/* ==================== Awards Tab ==================== */

function AwardsTab({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [items, setItems] = useState<AwardItem[]>(data.awards);

  const addItem = () => {
    setItems([...items, { id: generateId(), name: "", date: "", description: "" }]);
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
  const updateItem = (id: string, key: keyof AwardItem, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  };

  return (
    <div>
      <ListSectionHeader title="荣誉/证书" desc="添加你获得的荣誉和证书。" onAdd={addItem} />
      {items.length === 0 && <EmptyHint text="暂无荣誉/证书，点击右上角「新增」添加" />}
      <div className="space-y-5">
        {items.map((item, idx) => (
          <ItemCard key={item.id} index={idx} onRemove={() => removeItem(item.id)}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <FormInput label="名称" value={item.name} onChange={(v) => updateItem(item.id, "name", v)} placeholder="如：国家奖学金" />
              <FormInput label="获得时间" value={item.date} onChange={(v) => updateItem(item.id, "date", v)} placeholder="如：2024-10" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">描述</label>
              <AutoTextArea value={item.description} onValueChange={(v) => updateItem(item.id, "description", v)} placeholder="可选，补充说明" />
            </div>
          </ItemCard>
        ))}
      </div>
      <SaveButton onClick={() => onSave({ ...data, awards: items })} />
    </div>
  );
}

/* ==================== Self Evaluation Tab ==================== */

function SelfEvaluationTab({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [value, setValue] = useState(data.selfEvaluation);

  return (
    <div>
      <SectionHeader title="自我评价" desc="自由输入你的自我评价，格式完全由你控制。" />
      <AutoTextArea value={value} onValueChange={setValue} placeholder="输入你的自我评价..." />
      <SaveButton onClick={() => onSave({ ...data, selfEvaluation: value })} />
    </div>
  );
}

/* ==================== Custom Fields Tab ==================== */

function CustomTab({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [items, setItems] = useState<CustomField[]>(data.custom);

  const addItem = () => {
    setItems([...items, { id: generateId(), label: "", value: "" }]);
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
  const updateItem = (id: string, key: keyof CustomField, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  };

  return (
    <div>
      <ListSectionHeader title="自定义字段" desc="添加任意自定义字段，如「期望薪资」「可到岗时间」等。" onAdd={addItem} />
      {items.length === 0 && <EmptyHint text="暂无自定义字段，点击右上角「新增」添加" />}
      <div className="space-y-5">
        {items.map((item, idx) => (
          <ItemCard key={item.id} index={idx} onRemove={() => removeItem(item.id)}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <FormInput label="字段名" value={item.label} onChange={(v) => updateItem(item.id, "label", v)} placeholder="如：期望薪资" />
              <div />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">内容</label>
              <AutoTextArea value={item.value} onValueChange={(v) => updateItem(item.id, "value", v)} placeholder="字段内容（支持多行）" />
            </div>
          </ItemCard>
        ))}
      </div>
      <SaveButton onClick={() => onSave({ ...data, custom: items })} />
    </div>
  );
}

/* ==================== Data Management Tab ==================== */

function DataManagementTab({ data, onImport }: { data: ResumeData; onImport: (d: ResumeData) => void }) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resumevault-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = JSON.parse(text) as ResumeData;
        onImport(imported);
      } catch {
        alert("导入失败：文件格式不正确");
      }
    };
    input.click();
  };

  const handleClear = async () => {
    if (confirm("确定要清空所有数据吗？此操作不可恢复。")) {
      await chrome.storage.local.remove("resumeData");
      window.location.reload();
    }
  };

  return (
    <div>
      <SectionHeader title="数据管理" desc="导出备份、导入恢复或清空所有数据。" />
      <div className="space-y-4">
        <DataCard
          title="导出数据"
          desc="将所有个人信息导出为 JSON 文件作为本地备份。"
          btnText="导出 JSON"
          onClick={handleExport}
        />
        <DataCard
          title="导入数据"
          desc="从 JSON 备份文件恢复数据，将覆盖当前数据。"
          btnText="导入 JSON"
          onClick={handleImport}
        />
        <div className="p-5 border border-red-200/60 rounded-xl bg-red-50/30">
          <h3 className="text-sm font-medium text-red-600 mb-1.5">清空数据</h3>
          <p className="text-xs text-gray-500 mb-3">删除所有已保存的个人信息，此操作不可恢复。</p>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-100/50 transition-colors cursor-pointer"
          >
            清空所有数据
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== Shared Components ==================== */

function ListSectionHeader({ title, desc, onAdd }: { title: string; desc: string; onAdd: () => void }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">{desc}</p>
      </div>
      <button
        onClick={onAdd}
        className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        新增
      </button>
    </div>
  );
}

function ItemCard({ index, onRemove, children }: { index: number; onRemove: () => void; children: ReactNode }) {
  return (
    <div className="border border-gray-200/80 rounded-xl p-5 bg-gray-50/30 hover:border-gray-300/80 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
          #{index + 1}
        </span>
        <button
          onClick={onRemove}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          删除
        </button>
      </div>
      {children}
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-shadow placeholder:text-gray-300"
      />
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-8 flex justify-end">
      <button
        onClick={onClick}
        className="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer shadow-sm shadow-blue-600/20"
      >
        保存
      </button>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="text-center py-12 text-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function DataCard({
  title,
  desc,
  btnText,
  onClick,
}: {
  title: string;
  desc: string;
  btnText: string;
  onClick: () => void;
}) {
  return (
    <div className="p-5 border border-gray-200/80 rounded-xl hover:border-gray-300/80 transition-colors">
      <h3 className="text-sm font-medium text-gray-700 mb-1.5">{title}</h3>
      <p className="text-xs text-gray-400 mb-3">{desc}</p>
      <button
        onClick={onClick}
        className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {btnText}
      </button>
    </div>
  );
}
