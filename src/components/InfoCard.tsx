/**
 * 信息分类卡片组件，支持折叠展开
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

import { useState } from "react";
import CopyableField from "./CopyableField";

interface FieldData {
  label: string;
  value: string;
}

interface ItemData {
  heading: string;
  fields: FieldData[];
}

interface InfoCardProps {
  title: string;
  fields?: FieldData[];
  items?: ItemData[];
  searchTerm: string;
  onCopy: (text: string) => void;
}

export default function InfoCard({ title, fields, items, searchTerm, onCopy }: InfoCardProps) {
  const [expanded, setExpanded] = useState(true);

  const matchesSearch = (f: FieldData) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      f.label.toLowerCase().includes(term) ||
      f.value.toLowerCase().includes(term)
    );
  };

  const filteredFields = fields?.filter(matchesSearch);
  const filteredItems = items?.map((item) => ({
    ...item,
    fields: item.fields.filter(matchesSearch),
  })).filter((item) => item.fields.length > 0);

  const hasContent =
    (filteredFields && filteredFields.length > 0) ||
    (filteredItems && filteredItems.length > 0);

  if (!hasContent) return null;

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-1 py-1">
          {filteredFields?.map((f, i) => (
            <CopyableField key={i} label={f.label} value={f.value} onCopy={onCopy} />
          ))}
          {filteredItems?.map((item, i) => (
            <div key={i} className="mt-1">
              {filteredItems.length > 1 && (
                <div className="px-2 py-1 text-xs text-gray-500 font-medium">
                  {item.heading}
                </div>
              )}
              {item.fields.map((f, j) => (
                <CopyableField key={j} label={f.label} value={f.value} onCopy={onCopy} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
