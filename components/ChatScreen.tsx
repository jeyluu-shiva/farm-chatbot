import React, { useRef, useEffect, useState } from 'react';
import { Header } from './Header';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { IngredientsCard } from './IngredientsCard';
import { ProductsCard } from './ProductsCard';
import { StoresCard } from './StoresCard';
import { RatingSheet } from './RatingSheet';
import { Message, AnalysisResult } from '../types';
import { ArrowRight, FileText } from 'lucide-react';

interface Props {
  messages: Message[];
  onSend: (text: string) => void;
  onAction: (action: 'ingredients' | 'products' | 'stores') => void;
  onFindStoreForProduct: (productName: string) => void;
  onPlayAudio: (text: string) => Promise<void>;
  onViewResult?: (result: AnalysisResult) => void;
  isLoading: boolean;
  inputMode: 'default' | 'actions';
  onBack: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onRateSession?: (rating: number, feedback: string) => void;
}

export const ChatScreen: React.FC<Props> = ({
  messages,
  onSend,
  onAction,
  onFindStoreForProduct,
  onPlayAudio,
  onViewResult,
  isLoading,
  inputMode,
  onBack,
  onOpenHistory,
  onOpenSettings,
  onRateSession
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showRating, setShowRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const timerRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Inactivity Timer Logic
  useEffect(() => {
    setShowRating(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    const lastMessage = messages[messages.length - 1];
    
    if (!isLoading && !hasRated && messages.length > 1 && lastMessage?.role === 'bot') {
      timerRef.current = setTimeout(() => {
        setShowRating(true);
      }, 30000); 
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [messages, isLoading, hasRated]);

  const handleRate = (stars: number, feedback: string) => {
    setHasRated(true);
    if (onRateSession) {
      onRateSession(stars, feedback);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-slate-50">
      <Header 
        showBack={true}
        onBack={onBack}
        onOpenHistory={onOpenHistory}
        onOpenSettings={onOpenSettings}
      />
      
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        {messages.map((msg) => {
          if (msg.type === 'text') {
            return (
              <ChatMessage 
                key={msg.id} 
                role={msg.role} 
                content={msg.content || ''} 
                onPlayAudio={onPlayAudio} 
              />
            );
          }
          if (msg.type === 'analysis_result' && msg.data) {
            // Replaced inline card with a discrete button
            return (
              <div key={msg.id} className="flex justify-start mb-6 animate-fade-in-up">
                 <button 
                   onClick={() => onViewResult && onViewResult(msg.data)}
                   className="flex items-center gap-3 bg-white border border-emerald-100 text-emerald-700 px-5 py-4 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 active:scale-95 transition-all w-full max-w-[85%]"
                 >
                   <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                     <FileText className="w-5 h-5 text-emerald-600" />
                   </div>
                   <div className="flex-1 text-left">
                     <span className="block font-bold text-slate-800">Kết quả phân tích</span>
                     <span className="text-xs text-slate-500">Nhấn để xem chi tiết</span>
                   </div>
                   <ArrowRight className="w-5 h-5 text-emerald-400" />
                 </button>
              </div>
            );
          }
          if (msg.type === 'stores') {
            return <StoresCard key={msg.id} stores={msg.data} />;
          }
          // Legacy support or specific requested actions
          if (msg.type === 'ingredients') {
            return <IngredientsCard key={msg.id} ingredients={msg.data} />;
          }
          if (msg.type === 'products') {
            return (
              <ProductsCard 
                key={msg.id} 
                products={msg.data} 
                onFindStore={onFindStoreForProduct}
              />
            );
          }
          return null;
        })}
        
        {isLoading && (
          <div className="flex gap-3 mb-6 animate-fade-in">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-400 italic text-sm shadow-sm">
              Đang phân tích...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <RatingSheet 
        isOpen={showRating} 
        onClose={() => {
          setShowRating(false);
          setHasRated(true);
        }}
        onRate={handleRate}
      />

      <ChatInput 
        onSend={onSend} 
        onAction={onAction} 
        isLoading={isLoading} 
        inputMode={inputMode}
        isConversationStarted={messages.length > 1}
      />
    </div>
  );
};