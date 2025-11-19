import { GoogleGenAI } from "@google/genai";
import { NewsItem, NewsCategory } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const fetchDailyTechNews = async (dateStr: string): Promise<NewsItem[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing in process.env");
  }

  const prompt = `
    Act as a Senior Tech Editor for a top-tier Chinese technology media outlet (like 36Kr or TMTPost). 
    Search for the most important technology news for today, ${dateStr}.
    
    Focus strictly on these areas:
    1. AI/Artificial Intelligence breakthroughs (Global & China).
    2. US Big 7 Tech Giants (Apple, Google, Microsoft, Amazon, Meta, Tesla, Nvidia).
    3. China Big 7 Tech Giants (Tencent, Alibaba, Baidu, JD, Xiaomi, ByteDance, Meituan) and Huawei.
    4. Global Tech Regulation & Policy.

    For each key story found, extract the following information and translate/write it in Simplified Chinese (简体中文):
    - Title: Concise, professional headline in Chinese (max 20 chars).
    - Category: One of "Artificial Intelligence", "US Tech Giants", "China Tech Giants", or "Global Policy" (Keep these enum values EXACTLY in English for parsing).
    - Summary: A 60-100 word overview of the event in Chinese.
    - Impact: A 30-50 word analysis of why this matters in Chinese.
    - Data Point: A specific number, percentage, or financial figure found in the news (e.g., "股价上涨5%", "100亿人民币", "100万用户").
    - Source: The name of the reputable media outlet.

    Select the top 4-6 most impactful stories total.
    
    IMPORTANT FORMATTING:
    Return the output as a JSON array inside a JSON code block.
    The keys must be in English ("category", "title", "summary", "impact", "dataPoint", "source").
    The values must be in Simplified Chinese (except for 'category').

    Example format:
    \`\`\`json
    [
      {
        "category": "Artificial Intelligence",
        "title": "Gemini 1.5 Pro 发布",
        "summary": "谷歌推出了其最新的多模态模型，大幅提升了长文本处理能力...",
        "impact": "这标志着大模型上下文窗口竞争进入新阶段...",
        "dataPoint": "100万 token 上下文",
        "source": "Google Blog"
      }
    ]
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4, 
      },
    });

    const text = response.text || "";
    
    // Extract JSON from code block
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      const parsedData = JSON.parse(jsonMatch[1].trim());
      
      // Map to NewsItem interface and add IDs
      return parsedData.map((item: any, index: number) => ({
        id: `news-${Date.now()}-${index}`,
        category: mapCategory(item.category),
        title: item.title,
        summary: item.summary,
        impact: item.impact,
        dataPoint: item.dataPoint,
        source: item.source
      }));
    } else {
      console.error("Failed to parse JSON from response", text);
      throw new Error("无法解析 AI 返回的新闻数据。");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const mapCategory = (raw: string): NewsCategory => {
  // Helper to map potentially messy model output to strict Enums
  // The prompt asks for English Enums, but we add safety checks
  if (raw.includes("China") || raw.includes("Chinese") || raw.includes("Tencent") || raw.includes("Alibaba")) return NewsCategory.CN_BIG7;
  if (raw.includes("US") || raw.includes("America") || raw.includes("Apple") || raw.includes("Google")) return NewsCategory.US_BIG7;
  if (raw.includes("Policy") || raw.includes("Regulation")) return NewsCategory.POLICY;
  return NewsCategory.AI;
};