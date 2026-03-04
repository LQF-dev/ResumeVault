/**
 * 可复制的字段行组件
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

import { useState } from "react";

interface CopyableFieldProps {
  label: string;
  value: string;
  onCopy: (text: string) => void;
}

export default function CopyableField({ label, value, onCopy }: CopyableFieldProps) {
  const [justCopied, setJustCopied] = useState(false);

  if (!value) return null;

  const isMultiline = value.includes("\n");
  const preview = isMultiline
    ? value.split("\n").slice(0, 2).join("\n") + (value.split("\n").length > 2 ? "..." : "")
    : value;

  const handleClick = () => {
    onCopy(value);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1500);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-blue-50 cursor-pointer group transition-colors"
    >
      <span className="text-xs text-gray-400 min-w-[56px] pt-0.5 shrink-0">
        {label}
      </span>
      <span className="flex-1 text-sm text-gray-700 whitespace-pre-wrap break-all line-clamp-2">
        {preview}
      </span>
      <span className="shrink-0 pt-0.5">
        {justCopied ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
    </div>
  );
}
