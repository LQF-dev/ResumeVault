/**
 * 简历原文参考面板
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

interface TextReferenceProps {
  text: string;
  onClose: () => void;
}

export default function TextReference({ text, onClose }: TextReferenceProps) {
  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">简历原文参考</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed select-text">
          {text}
        </pre>
      </div>
      <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-400">
        提示：选中文字后可直接 Ctrl+C 复制到右侧表单
      </div>
    </div>
  );
}
