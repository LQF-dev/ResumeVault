/**
 * Side Panel - 常驻侧边栏，信息展示与一键复制
 * 通过 Port 连接与 service worker 通信，实现可靠的 toggle
 *
 * @author QinFeng Luo
 * @date 2026/03/05
 */

import { useState, useEffect } from "react";
import { useStorage } from "@/hooks/useStorage";
import type { ResumeData } from "@/types/resume";
import InfoCard from "@/components/InfoCard";
import Toast from "@/components/Toast";

export default function SidePanel() {
  const { data, loading } = useStorage<ResumeData>("resumeData");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    let port: chrome.runtime.Port;
    let unmounted = false;

    function connect() {
      port = chrome.runtime.connect({ name: "sidepanel" });
      port.onMessage.addListener((msg: { type: string }) => {
        if (msg.type === "close-panel") window.close();
      });
      port.onDisconnect.addListener(() => {
        if (!unmounted) setTimeout(connect, 200);
      });
    }

    connect();

    return () => {
      unmounted = true;
      try { port.disconnect(); } catch {}
    };
  }, []);

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
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400 text-sm">加载中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-5 bg-white px-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-800 mb-1">ResumeVault</h1>
          <p className="text-sm text-gray-400">还没有保存的信息</p>
        </div>
        <div className="flex flex-col gap-2.5 w-full max-w-[240px]">
          <button
            onClick={() => openOptions("upload")}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            上传简历开始填写
          </button>
          <button
            onClick={() => openOptions("basic")}
            className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            直接手动填写
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 顶部工具栏：搜索 + 编辑 + 关闭 */}
      <div className="px-3 pt-3 pb-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="搜索字段..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder:text-gray-300"
          />
          <button
            onClick={() => openOptions()}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer shrink-0"
            title="编辑信息"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            onClick={() => window.close()}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
            title="关闭侧边栏"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 信息卡片区 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
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

      {/* 底部 */}
      <div className="px-3 py-1.5 border-t border-gray-100 text-center shrink-0">
        <p className="text-[11px] text-gray-300">点击字段即可复制 · 数据仅存本地</p>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
