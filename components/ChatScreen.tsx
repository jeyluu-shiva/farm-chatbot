import React, { useRef, useEffect } from 'react';
import { Header } from './Header';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { IngredientsCard } from './IngredientsCard';
import { ProductsCard } from './ProductsCard';
import { StoresCard } from './StoresCard';
import { Message } from '../types';

interface Props {
  messages: Message[];
  onSend: (text: string) => void;
  onAction: (action: 'ingredients' | 'products' | 'stores') => void;
  onFindStoreForProduct: (productName: string) => void;
  onPlayAudio: (text: string) => Promise<void>;
  isLoading: boolean;
  inputMode: 'default' | 'actions';
  onBack: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const ChatScreen: React.FC<Props> = ({
  messages,
  onSend,
  onAction,
  onFindStoreForProduct,
  onPlayAudio,
  isLoading,
  inputMode,
  onBack,
  onOpenHistory,
  onOpenSettings
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
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
          if (msg.type === 'stores') {
            return <StoresCard key={msg.id} stores={msg.data} />;
          }
          return null;
        })}
        
        {isLoading && (
          <div className="flex gap-3 mb-6 animate-fade-in">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-400 italic text-sm">
              Đang suy nghĩ...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

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