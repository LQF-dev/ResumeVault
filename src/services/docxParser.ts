/**
 * Word (.docx) 文本提取服务（基于 mammoth）
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

import mammoth from "mammoth";

export async function extractTextFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}
