import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { NewsCard } from './components/NewsCard';
import { ActionPanel } from './components/ActionPanel';
import { fetchDailyTechNews } from './services/gemini';
import { NewsItem, GenerationState } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'demo-1',
    category: 'Artificial Intelligence' as any,
    title: '欢迎使用 TechBrief.AI',
    summary: '点击“重新生成”以扫描今天的头条科技新闻。本工具使用 Google Gemini 搜索、分析并可视化人工智能、科技巨头及全球政策领域的最新突破。',
    impact: '为科技专业人士提供高效的信息获取方式，适合微信公众号发布。',
    dataPoint: '4 大分类',
    source: '系统消息'
  }
];

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    lastUpdated: new Date(),
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Date formatting for Chinese
  const todayStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const handleGenerate = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Fetch real news using Gemini + Google Search (date passed is for prompt context)
      const articles = await fetchDailyTechNews(todayStr);
      setNews(articles);
      setState(prev => ({ ...prev, isLoading: false, lastUpdated: new Date() }));
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "获取新闻失败，请重试。请确保 API Key 有效。"
      }));
    }
  }, [todayStr]);

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) {
      return;
    }

    try {
      // Small delay to ensure fonts/layout stable
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `tech-brief-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Could not generate image', err);
      alert('生成图片失败，请重试。');
    }
  }, [cardRef]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4 pb-32 font-sans">
      
      {/* App Header */}
      <div className="max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sans">TechBrief.AI 编辑器</h1>
        <p className="text-slate-600">
          生成专业、数据驱动的科技新闻简报，专为微信公众号设计。
        </p>
      </div>

      {/* Error State */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2 max-w-md">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{state.error}</p>
        </div>
      )}

      {/* Loading Overlay */}
      {state.isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
           <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-400" />
           <h2 className="text-xl font-bold tracking-wide">正在扫描全球科技新闻...</h2>
           <p className="text-slate-300 mt-2">正在分析深度影响并提取关键数据</p>
        </div>
      )}

      {/* The Canvas/Preview Area */}
      <div className="relative">
        <NewsCard 
          date={todayStr} 
          news={news} 
          forwardRef={cardRef} 
        />
      </div>

      {/* Floating Controls */}
      <ActionPanel 
        onGenerate={handleGenerate} 
        onDownload={handleDownload}
        isGenerating={state.isLoading}
      />

    </div>
  );
};

export default App;