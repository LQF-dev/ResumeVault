/**
 * Popup 弹窗 - 精简入口页，引导用户使用侧边栏
 *
 * @author QinFeng Luo
 * @date 2026/03/05
 */

import { useStorage } from "@/hooks/useStorage";
import type { ResumeData } from "@/types/resume";

export default function Popup() {
  const { data, loading } = useStorage<ResumeData>("resumeData");

  const openSidePanel = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.sidePanel.open({ tabId: tab.id });
      }
    } catch (err) {
      console.error("Failed to open side panel:", err);
    }
    window.close();
  };

  const openOptions = (hash?: string) => {
    const url = chrome.runtime.getURL("src/options/index.html");
    chrome.tabs.create({ url: hash ? `${url}#${hash}` : url });
    window.close();
  };

  if (loading) {
    return (
      <div className="w-[300px] py-10 flex items-center justify-center bg-white">
        <div className="text-gray-400 text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className="w-[300px] bg-white">
      {/* 头部 */}
      <div className="px-5 pt-5 pb-4 text-center">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </div>
        <h1 className="text-base font-bold text-gray-800">ResumeVault</h1>
        <p className="text-xs text-gray-400 mt-0.5">一次录入，随处粘贴</p>
      </div>

      {/* 操作按钮区 */}
      <div className="px-5 pb-5 space-y-2.5">
        {data ? (
          <>
            <button
              onClick={openSidePanel}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              打开侧边栏
            </button>
            <button
              onClick={() => openOptions()}
              className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              编辑信息
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* 底部快捷键提示 */}
      <div className="px-5 py-2.5 border-t border-gray-100 text-center">
        <p className="text-[11px] text-gray-300">
          快捷键 <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded text-[10px] font-mono">Alt+Shift+V</kbd> 开关侧边栏
          <span className="mx-1">·</span>
          <a
            href="chrome://extensions/shortcuts"
            onClick={(e) => {
              e.preventDefault();
              chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
              window.close();
            }}
            className="text-blue-400 hover:text-blue-500 cursor-pointer"
          >
            自定义快捷键
          </a>
        </p>
      </div>
    </div>
  );
}
