import React from 'react';
import { NewsItem, NewsCategory } from '../types';
import { Bot, Globe2, Building2, Cpu, TrendingUp, Quote } from 'lucide-react';

interface NewsCardProps {
  date: string;
  news: NewsItem[];
  forwardRef: React.Ref<HTMLDivElement>;
}

const CategoryBadge = ({ category }: { category: NewsCategory }) => {
    let colorClass = "bg-gray-100 text-gray-800";
    let label = category as string;

    // Map categories to Chinese labels
    switch (category) {
        case NewsCategory.AI: 
            colorClass = "bg-blue-100 text-blue-800 border-blue-200"; 
            label = "人工智能";
            break;
        case NewsCategory.US_BIG7: 
            colorClass = "bg-indigo-100 text-indigo-800 border-indigo-200"; 
            label = "美国巨头";
            break;
        case NewsCategory.CN_BIG7: 
            colorClass = "bg-red-50 text-red-800 border-red-200"; 
            label = "中国科技";
            break;
        case NewsCategory.POLICY: 
            colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200"; 
            label = "全球政策";
            break;
    }

    return (
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${colorClass} tracking-wide`}>
            {label}
        </span>
    );
};

export const NewsCard: React.FC<NewsCardProps> = ({ date, news, forwardRef }) => {
  return (
    <div className="flex justify-center w-full overflow-hidden">
      {/* This container is what gets screenshot */}
      <div 
        ref={forwardRef}
        className="w-[480px] bg-white min-h-[800px] shadow-2xl flex flex-col relative"
        style={{ fontFamily: "'Noto Sans SC', 'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-mono tracking-widest uppercase">TechBrief.AI</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-2 leading-tight">
                    每日<span className="text-blue-400">科技</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium border-l-2 border-blue-500 pl-3">
                    {date} | 深度简报
                </p>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-8 bg-slate-50">
          {news.map((item, index) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
              
              {/* Decorative Index Number */}
              <div className="absolute -right-4 -top-4 text-[80px] font-black text-slate-50 leading-none select-none z-0">
                {index + 1}
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <CategoryBadge category={item.category} />
                    <span className="text-[10px] text-slate-400 font-mono">REF: {index + 1}.0</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3 group-hover:text-blue-700 transition-colors text-justify">
                    {item.title}
                </h3>

                <div className="space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed text-justify">
                        {item.summary}
                    </p>
                    
                    <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> 深度影响
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed text-justify">
                            {item.impact}
                        </p>
                    </div>

                    {/* Data Point */}
                    <div className="flex items-center gap-3 mt-2 pt-3 border-t border-slate-100">
                        <div className="flex-1">
                             <span className="text-xs font-semibold text-slate-400">关键数据</span>
                             <div className="text-lg font-bold text-blue-600 font-mono tracking-tight">
                                {item.dataPoint}
                             </div>
                        </div>
                        <div className="text-right">
                             <span className="text-[10px] text-slate-400 block">信息来源</span>
                             <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                                {item.source}
                             </span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white p-6 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    TB
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">TechBrief.AI</span>
                    <span className="text-[10px] text-slate-400">由 Gemini 2.5 生成</span>
                </div>
            </div>
            <div className="text-[10px] text-slate-300 font-mono">
                {new Date().toLocaleDateString('zh-CN')}
            </div>
        </div>
      </div>
    </div>
  );
};