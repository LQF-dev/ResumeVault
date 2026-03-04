/**
 * 自适应高度的 textarea 组件
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

import { useRef, useEffect, type TextareaHTMLAttributes } from "react";

interface AutoTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onValueChange: (value: string) => void;
}

export default function AutoTextArea({ value, onValueChange, className = "", ...props }: AutoTextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      rows={3}
      className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 resize-none overflow-hidden ${className}`}
      {...props}
    />
  );
}
