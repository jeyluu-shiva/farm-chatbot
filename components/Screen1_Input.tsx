import React, { useState } from 'react';
import { Send, FlaskConical, Pill, Compass } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  onAction: (action: 'ingredients' | 'products' | 'stores') => void;
  isLoading: boolean;
  inputMode: 'default' | 'actions';
  isConversationStarted: boolean;
}

export const ChatInput: React.FC<Props> = ({ onSend, onAction, isLoading, inputMode, isConversationStarted }) => {
  const [input, setInput] = useState('');

  const suggestions = [
    'Đạo ôn trên lúa',
    'Thán thư',
    'Sâu cuốn lá'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleSuggestionClick = (text: string) => {
    if (!isLoading) {
      onSend(text);
    }
  };

  // Logic for what to show above input
  const showInitialSuggestions = !isConversationStarted && inputMode === 'default';
  const showActions = inputMode === 'actions';

  return (
    <div className="bg-white border-t border-slate-100 p-3 pb-6 sm:pb-3 w-full transition-all shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
      {/* Suggestions or Actions Row - Only show if input is empty */}
      {!input && (
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar py-1 px-1 min-h-[40px]">
          {showInitialSuggestions && (
             // Default Suggestions - Only at start
            suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                disabled={isLoading}
                className="whitespace-nowrap bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium active:bg-emerald-50 active:text-emerald-700 transition-colors animate-fade-in"
              >
                {s}
              </button>
            ))
          )}

          {showActions && (
            // Action Buttons - Only when disease identified
            <>
              <button
                onClick={() => onAction('ingredients')}
                disabled={isLoading}
                className="flex items-center gap-1.5 whitespace-nowrap bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-all hover:bg-emerald-100 animate-fade-in"
              >
                <FlaskConical className="w-4 h-4" />
                Hoạt chất
              </button>
              <button
                onClick={() => onAction('products')}
                disabled={isLoading}
                className="flex items-center gap-1.5 whitespace-nowrap bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-all hover:bg-emerald-100 animate-fade-in"
              >
                <Pill className="w-4 h-4" />
                Thuốc
              </button>
              <button
                onClick={() => onAction('stores')}
                disabled={isLoading}
                className="flex items-center gap-1.5 whitespace-nowrap bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-all hover:bg-emerald-100 animate-fade-in"
              >
                <Compass className="w-4 h-4" />
                Nơi bán
              </button>
            </>
          )}
        </div>
      )}

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={showActions ? "Hỏi thêm về bệnh này..." : "Nhập tên bệnh hoặc câu hỏi..."}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full py-3 pl-4 pr-12 text-slate-800 text-base shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-1.5 p-2 bg-emerald-600 text-white rounded-full disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};