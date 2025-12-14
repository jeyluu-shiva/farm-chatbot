export interface Ingredient {
  id: string;
  name: string;
  mechanism: string;
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

export type MessageType = 
  | 'text' 
  | 'actions'
  | 'ingredients' 
  | 'products' 
  | 'stores';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  type: MessageType;
  content?: string;
  data?: any; // Stores Ingredient[], Product[], Store[], or actions config
}

export type UserIntent = 'chat' | 'show_ingredients' | 'show_products' | 'show_stores';

export interface ChatResponse {
  text: string;
  isDiseaseIdentified: boolean;
  diseaseName?: string;
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

export type AppView = 'onboarding' | 'home' | 'chat' | 'profile' | 'calculator';

export interface UserProfile {
  name: string;
  phoneNumber?: string;
  avatar?: string;
  crops?: string[];
}