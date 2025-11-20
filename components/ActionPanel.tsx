import React from 'react';
import { Download, RefreshCw, Copy } from 'lucide-react';

interface ActionPanelProps {
  onGenerate: () => void;
  onDownload: () => void;
  isGenerating: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onGenerate, onDownload, isGenerating }) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-slate-700 flex gap-2 z-50">
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all font-sans
            ${isGenerating ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:scale-95'}
        `}
      >
        <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? '扫描新闻中...' : '重新生成'}
      </button>

      <div className="w-px bg-slate-700 mx-1"></div>

      <button
        onClick={onDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white hover:bg-slate-800 transition-all active:scale-95 font-sans"
      >
        <Download className="w-5 h-5" />
        保存图片
      </button>
    </div>
  );
};
