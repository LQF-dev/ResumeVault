import { useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import type { ResumeData } from "@/types/resume";
import InfoCard from "@/components/InfoCard";
import Toast from "@/components/Toast";

export default function Popup() {
  const { data, loading } = useStorage<ResumeData>("resumeData");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState("");

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("已复制");
      setTimeout(() => setToast(""), 1500);
    } catch {
      setToast("复制失败");
      setTimeout(() => setToast(""), 1500);
    }
  };

  const openOptions = (hash?: string) => {
    const url = chrome.runtime.getURL("src/options/index.html");
    chrome.tabs.create({ url: hash ? `${url}#${hash}` : url });
  };

  if (loading) {
    return (
      <div className="w-[380px] h-[520px] flex items-center justify-center bg-white">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-[380px] h-[520px] flex flex-col items-center justify-center gap-6 bg-white px-8">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            ResumeVault
          </h1>
          <p className="text-sm text-gray-500">
            一次录入，随处粘贴
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => openOptions("upload")}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            上传简历开始填写
          </button>
          <button
            onClick={() => openOptions("basic")}
            className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            直接手动填写
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[380px] h-[520px] flex flex-col bg-white">
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="搜索字段..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={() => openOptions()}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title="编辑信息"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        <InfoCard
          title="基本信息"
          fields={[
            { label: "姓名", value: data.basicInfo.name },
            { label: "性别", value: data.basicInfo.gender },
            { label: "出生日期", value: data.basicInfo.birthDate },
            { label: "手机号", value: data.basicInfo.phone },
            { label: "邮箱", value: data.basicInfo.email },
            { label: "政治面貌", value: data.basicInfo.politicalStatus },
            { label: "民族", value: data.basicInfo.ethnicity },
            { label: "籍贯", value: data.basicInfo.hometown },
            { label: "现居城市", value: data.basicInfo.currentCity },
          ]}
          searchTerm={searchTerm}
          onCopy={handleCopy}
        />

        {data.education.length > 0 && (
          <InfoCard
            title="教育经历"
            items={data.education.map((edu) => ({
              heading: `${edu.school} - ${edu.major}`,
              fields: [
                { label: "学校", value: edu.school },
                { label: "专业", value: edu.major },
                { label: "学历", value: edu.degree },
                { label: "GPA", value: edu.gpa },
                { label: "时间", value: `${edu.startDate} - ${edu.endDate}` },
                { label: "描述", value: edu.description },
              ],
            }))}
            searchTerm={searchTerm}
            onCopy={handleCopy}
          />
        )}

        {data.internship.length > 0 && (
          <InfoCard
            title="实习经历"
            items={data.internship.map((item) => ({
              heading: `${item.company} - ${item.position}`,
              fields: [
                { label: "公司", value: item.company },
                { label: "职位", value: item.position },
                { label: "时间", value: `${item.startDate} - ${item.endDate}` },
                { label: "工作内容", value: item.description },
              ],
            }))}
            searchTerm={searchTerm}
            onCopy={handleCopy}
          />
        )}

        {data.project.length > 0 && (
          <InfoCard
            title="项目经历"
            items={data.project.map((item) => ({
              heading: item.name,
              fields: [
                { label: "项目名称", value: item.name },
                { label: "角色", value: item.role },
                { label: "技术栈", value: item.techStack },
                { label: "时间", value: `${item.startDate} - ${item.endDate}` },
                { label: "项目描述", value: item.description },
              ],
            }))}
            searchTerm={searchTerm}
            onCopy={handleCopy}
          />
        )}

        {data.skills && (
          <InfoCard
            title="技能"
            fields={[{ label: "技能", value: data.skills }]}
            searchTerm={searchTerm}
            onCopy={handleCopy}
          />
        )}

        {data.awards.length > 0 && (
          <InfoCard
            title="荣誉/证书"
            items={data.awards.map((item) => ({
              heading: item.name,
              fields: [
                { label: "名称", value: item.name },
                { label: "时间", value: item.date },
                { label: "描述", value: item.description },
              ],
            }))}
            searchTerm={searchTerm}
            onCopy={handleCopy}
          />
        )}

        {data.selfEvaluation && (
          <InfoCard
            title="自我评价"
            fields={[{ label: "自我评价", value: data.selfEvaluation }]}
            searchTerm={searchTerm}
            onCopy={handleCopy}
          />
        )}

        {data.custom.length > 0 && (
          <InfoCard
            title="自定义字段"
            fields={data.custom.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            searchTerm={searchTerm}
            onCopy={handleCopy}
          />
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={() => openOptions()}
          className="w-full py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
        >
          编辑信息
        </button>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
