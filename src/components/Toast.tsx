/**
 * 复制成功提示组件
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
