import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { BotConfig, Message, UserIntent } from "../types";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzeDisease = async (
  input: string, 
  config: BotConfig, 
  history: Message[]
): Promise<{ text: string, isDiseaseIdentified: boolean, diseaseName?: string, intent?: UserIntent }> => {
  if (!ai) {
    console.warn("API Key not found, using mock response");
    const isDisease = input.toLowerCase().includes('đạo ôn') || input.toLowerCase().includes('bệnh');
    return {
      text: isDisease 
        ? "Dựa trên mô tả, có thể cây trồng đang bị bệnh Đạo ôn (cháy lá). Bệnh do nấm Pyricularia oryzae gây ra."
        : "Chào bạn, tôi là trợ lý nông nghiệp. Bạn có thể hỏi tôi về các loại bệnh trên cây trồng.",
      isDiseaseIdentified: isDisease,
      diseaseName: isDisease ? "Đạo ôn" : undefined,
      intent: 'chat'
    };
  }

  // Construct System Prompt based on Config
  let toneInstruction = "Keep the tone professional, friendly, and simple.";
  if (config.tone === 'friendly') {
    toneInstruction = "Bạn là người bạn nhà nông, dùng từ ngữ cực kỳ gần gũi, xưng hô 'tôi' và 'bác/anh/chị', giọng văn ấm áp, động viên.";
  } else if (config.tone === 'expert') {
    toneInstruction = "Bạn là kỹ sư nông nghiệp đầu ngành. Dùng thuật ngữ chính xác, phong thái nghiêm túc, khoa học, khách quan.";
  } else if (config.tone === 'humorous') {
    toneInstruction = "Bạn là trợ lý vui tính. Hãy trả lời một cách hài hước, dùng các ví von thú vị, làm cho người nông dân cười nhưng vẫn cung cấp đủ thông tin.";
  } else if (config.tone === 'western') {
    toneInstruction = "Bạn là một lão nông tri điền người Miền Tây Nam Bộ, nói chuyện rặt tiếng miền Tây, hào sảng, chất phác. BẮT BUỘC dùng từ ngữ địa phương (tui, hông, nghen, đa, mần, trển, bển, dìa...). Xưng hô 'Tui' và gọi người dùng là 'Bà con', 'Bác Ba', 'Anh Tư', 'Chị Năm'. Phong thái chân tình, nồng hậu, coi người dùng như người nhà.";
  }

  let lengthInstruction = "Answer in 2-3 short sentences.";
  if (config.length === 'concise') lengthInstruction = "Trả lời cực kỳ ngắn gọn, súc tích, đi thẳng vào vấn đề. Không quá 40 từ.";
  if (config.length === 'detailed') lengthInstruction = "Trả lời chi tiết, giải thích rõ nguyên nhân, cơ chế và hướng dẫn cụ thể. Cung cấp đầy đủ bối cảnh.";

  // Format History
  // We take the last 10 messages to maintain context without overloading tokens
  const contextMessages = history
    .filter(m => m.type === 'text')
    .slice(-10)
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a Vietnamese agricultural assistant helping farmers.
      
      TONE INSTRUCTION: ${toneInstruction}
      LENGTH INSTRUCTION: ${lengthInstruction}

      CONTEXT FROM PREVIOUS CHAT:
      ${contextMessages}

      CURRENT USER INPUT: "${input}"

      INSTRUCTIONS:
      1. Answer the user's input based on the previous context if applicable.
      2. If the user mentions a NEW crop disease, identify it and return isDiseaseIdentified = true.
      3. If the user is asking a follow-up question about a previously identified disease, keep the context but return isDiseaseIdentified = false.
      4. INTENT DETECTION:
         - If user asks for "active ingredients", "chemicals", "substances" (hoạt chất), set intent = 'show_ingredients'.
         - If user asks for "medicines", "products", "drugs", "treatment" (thuốc, cách trị bằng thuốc), set intent = 'show_products'.
         - If user asks for "stores", "where to buy", "locations" (cửa hàng, mua ở đâu, đại lý), set intent = 'show_stores'.
         - Otherwise, set intent = 'chat'.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The response to the user in Vietnamese." },
            isDiseaseIdentified: { type: Type.BOOLEAN, description: "True if a SPECIFIC plant disease was identified in this turn." },
            diseaseName: { type: Type.STRING, description: "The name of the disease if identified." },
            intent: { 
              type: Type.STRING, 
              enum: ['chat', 'show_ingredients', 'show_products', 'show_stores'],
              description: "The user's intent to view specific app sections." 
            }
          },
          required: ["text", "isDiseaseIdentified"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      text: result.text || "Xin lỗi, tôi chưa rõ câu hỏi.",
      isDiseaseIdentified: !!result.isDiseaseIdentified,
      diseaseName: result.diseaseName,
      intent: result.intent as UserIntent || 'chat'
    };
  } catch (error) {
    console.error("Gemini API Error", error);
    return {
      text: "Xin lỗi, hiện tại tôi không thể kết nối tới máy chủ.",
      isDiseaseIdentified: false,
      intent: 'chat'
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
    // Return raw base64 string because it is PCM data, not MP3
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error", error);
    return null;
  }
};