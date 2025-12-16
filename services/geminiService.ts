import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { BotConfig, Message, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzeDisease = async (
  input: string, 
  config: BotConfig, 
  history: Message[]
): Promise<{ text: string, isAnalysisComplete: boolean, analysisResult?: AnalysisResult }> => {
  if (!ai) {
    console.warn("API Key not found, using mock response");
    // Mock logic for demo without API key
    const isReady = history.length > 2; // Simple mock check
    if (!isReady) {
      return {
        text: "Để tư vấn chính xác, bác cho tôi biết bệnh này xuất hiện ở giai đoạn nào của cây lúa? (Mạ, đẻ nhánh, hay trổ chín?)",
        isAnalysisComplete: false
      };
    }
    
    return {
      text: "Đã có đủ thông tin. Dưới đây là kết quả phân tích:",
      isAnalysisComplete: true,
      analysisResult: {
        summary: {
          crop: "Lúa",
          disease: "Đạo ôn lá",
          stage: "Đẻ nhánh",
          severity: "Vừa phải"
        },
        decision: {
          action: "spray",
          label: "Có thể cân nhắc phun",
          reason: "Bệnh chớm xuất hiện nhưng điều kiện thời tiết âm u, ẩm độ cao thuận lợi cho nấm phát triển. Nên phun phòng ngừa lây lan."
        },
        ingredients: [
          { id: "i1", name: "Tricyclazole", mechanism: "Nội hấp, lưu dẫn mạnh, hiệu lực kéo dài.", priority: "High" },
          { id: "i2", name: "Isoprothiolane", mechanism: "Đặc trị đạo ôn, giúp cây phục hồi nhanh.", priority: "Medium" }
        ],
        products: [
          { id: "p1", name: "Beam 75WP", activeIngredient: "Tricyclazole", formulation: "WP", usage: "18g/bình 16L" },
          { id: "p2", name: "Fuji-One 40EC", activeIngredient: "Isoprothiolane", formulation: "EC", usage: "30ml/bình 16L" }
        ],
        warnings: [
          "Lưu ý thời tiết: Không phun khi trời sắp mưa.",
          "Nguy cơ kháng thuốc: Nên luân phiên các gốc thuốc khác nhau nếu phải phun lại lần 2.",
          "Tuân thủ nguyên tắc 4 đúng."
        ]
      }
    };
  }

  // Format History
  const contextMessages = history
    .filter(m => m.type === 'text')
    .slice(-10)
    .map(m => `${m.role === 'user' ? 'Farmer' : 'Officer'}: ${m.content}`)
    .join('\n');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a professional Agricultural Officer (Cán bộ BVTV) helping a farmer.
      
      YOUR GOAL: Provide a neutral, safe, and professional consultation. Do NOT act like a salesperson.
      
      PROCESS:
      1.  **Information Collection**: You must collect the following 4 pieces of information before giving advice. Ask ONE question at a time if information is missing.
          - Crop type (Cây gì)
          - Disease/Symptoms (Bệnh gì/Triệu chứng)
          - Growth Stage (Giai đoạn sinh trưởng)
          - Severity/Location (Mức độ/Vị trí)
      2.  **Analysis**: Once you have all 4 pieces of information, output the analysis result.

      TONE:
      - Professional, calm, trustworthy, field-oriented.
      - Use "Cân nhắc" (Consider) instead of "Phải" (Must).
      - Use "Phù hợp" (Suitable) instead of "Tốt nhất" (Best).

      CONTEXT FROM CHAT:
      ${contextMessages}

      CURRENT INPUT: "${input}"

      INSTRUCTIONS:
      - If information is missing, set 'isAnalysisComplete' to false and ask the next question in 'text'. Explain WHY you are asking (e.g., "Để chọn thuốc đúng, bác cho biết lúa đang giai đoạn nào?").
      - If information is sufficient, set 'isAnalysisComplete' to true, set 'text' to a short confirmation (e.g., "Tôi đã nắm được tình hình. Đang phân tích..."), and fill the 'analysisResult' object.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The response text (question or confirmation)." },
            isAnalysisComplete: { type: Type.BOOLEAN, description: "True ONLY if crop, disease, stage, and severity are known." },
            analysisResult: {
              type: Type.OBJECT,
              description: "Structured analysis result. Only required if isAnalysisComplete is true.",
              properties: {
                summary: {
                  type: Type.OBJECT,
                  properties: {
                    crop: { type: Type.STRING },
                    disease: { type: Type.STRING },
                    stage: { type: Type.STRING },
                    severity: { type: Type.STRING }
                  }
                },
                decision: {
                  type: Type.OBJECT,
                  properties: {
                    action: { type: Type.STRING, enum: ['spray', 'no_spray', 'monitor'] },
                    label: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  }
                },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      mechanism: { type: Type.STRING },
                      priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                    }
                  }
                },
                products: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      activeIngredient: { type: Type.STRING },
                      formulation: { type: Type.STRING },
                      usage: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                warnings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }
          },
          required: ["text", "isAnalysisComplete"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      text: result.text || "Xin lỗi, tôi chưa rõ câu hỏi.",
      isAnalysisComplete: !!result.isAnalysisComplete,
      analysisResult: result.analysisResult
    };
  } catch (error) {
    console.error("Gemini API Error", error);
    return {
      text: "Xin lỗi, hiện tại tôi không thể kết nối tới máy chủ.",
      isAnalysisComplete: false
    };
  }
};

export const speakText = async (text: string, voiceName: string): Promise<string | null> => {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say the following text in Vietnamese: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error", error);
    return null;
  }
};