
import { GoogleGenAI, Type } from "@google/genai";
import { EmployeeData, AIInsight } from "../types";

// 每次調用時重新初始化，以獲取最新的 API Key (符合 guidelines)
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeEmployeeData = async (data: EmployeeData): Promise<AIInsight> => {
  const ai = getAI();
  
  // 針對個人進行深度解析，強化備註內容的影響力
  const prompt = `
    請作為專業 HR 戰略顧問，針對以下員工資料進行深度潛力分析：
    員工資料：${JSON.stringify(data)}
    
    重點注意事項（來自 HR 的備註）："${data.notes || '尚無備註'}"
    
    請提供：
    1. 人才價值定位：結合其 MBTI (${data.mbti}) 與專業技能 (${data.topSkills.join(', ')})，描述其在團隊中的獨特貢獻。
    2. 戰略匹配度：分析其在 ${data.department} 部門擔任 ${data.position} 的長期適配性。
    3. 個人化留才或培訓建議：根據 HR 備註與期望 (${data.expectations})，給出具體的管理建議。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // 升級為 Pro 以處理複雜戰略推理
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }, // 啟用思考功能以獲取更深度的戰略建議
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            talentSummary: { type: Type.STRING },
            strategicFit: { type: Type.STRING },
            onboardingAdvice: { type: Type.STRING }
          },
          required: ["talentSummary", "strategicFit", "onboardingAdvice"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      talentSummary: "分析生成失敗，請檢查網路或 API 設定。",
      strategicFit: "正在等待數據重新計算...",
      onboardingAdvice: "請參考內部標準人才發展手冊。"
    };
  }
};

export const getMarketInsights = async (employees: EmployeeData[]): Promise<string> => {
  const ai = getAI();
  const prompt = `
    身為企業首席人才官 (CHRO)，請分析這份人才庫資料：${JSON.stringify(employees)}
    
    分析目標：
    1. 團隊組成趨勢 (例如 MBTI 偏好、語言優勢)。
    2. 根據 HR 在 "notes" 中反應的人員狀況，指出潛在的組織風險或機會。
    3. 給出未來一季的「公司戰略人才發展」行動建議。
    
    請使用專業、有力且具備前瞻性的語氣。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });
    return response.text;
  } catch (error) {
    return "目前無法生成全域戰略洞察。";
  }
};
