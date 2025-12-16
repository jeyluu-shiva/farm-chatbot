export interface Ingredient {
  id: string;
  name: string;
  mechanism: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface Product {
  id: string;
  name: string;
  activeIngredient: string;
  formulation: string;
  description?: string; // e.g. "Uses/Benefits"
  usage?: string;       // e.g. "Dosage"
}

export interface Store {
  id: string;
  name: string;
  distance: string; // e.g., "1.2 km"
  tags: string[];
  phone: string;
  address: string;
}

export interface AnalysisResult {
  summary: {
    crop: string;
    disease: string;
    stage: string;
    severity: string;
  };
  decision: {
    action: 'spray' | 'no_spray' | 'monitor';
    label: string; // e.g., "Có thể cân nhắc phun", "Chưa cần phun"
    reason: string;
  };
  ingredients: Ingredient[];
  products: Product[];
  warnings: string[]; // Resistance risk, weather notes
}

export type MessageType = 
  | 'text' 
  | 'actions'
  | 'analysis_result'
  | 'stores'
  | 'ingredients'
  | 'products';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  type: MessageType;
  content?: string;
  data?: any; // Stores AnalysisResult, Store[], etc.
}

export type UserIntent = 'chat' | 'analyze_disease' | 'show_stores';

export interface ChatResponse {
  text: string;
  isAnalysisComplete: boolean;
  analysisResult?: AnalysisResult;
  intent?: UserIntent;
}

export type BotTone = 'friendly' | 'expert' | 'humorous' | 'western';
export type BotLength = 'concise' | 'detailed';
export type BotVoice = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Aoede';

export interface BotConfig {
  tone: BotTone;
  length: BotLength;
  voice: BotVoice;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
  preview: string; // Short preview of the last message or topic
}

export type AppView = 'onboarding' | 'home' | 'chat' | 'profile' | 'calculator' | 'result';

export interface UserProfile {
  name: string;
  phoneNumber?: string;
  avatar?: string;
  crops?: string[];
}