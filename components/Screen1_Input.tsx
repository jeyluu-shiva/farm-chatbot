import React, { useState, useRef, useEffect } from 'react';
import { Send, FlaskConical, Pill, Compass, Mic, StopCircle } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  onAction: (action: 'ingredients' | 'products' | 'stores') => void;
  isLoading: boolean;
  inputMode: 'default' | 'actions';
  isConversationStarted: boolean;
}

export const ChatInput: React.FC<Props> = ({ onSend, onAction, isLoading, inputMode, isConversationStarted }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const suggestions = [
    'Đạo ôn trên lúa',
    'Thán thư',
    'Sâu cuốn lá'
  ];

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome hoặc Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Lỗi nhận diện giọng nói:", event.error);
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setInput(prev => {
          const text = prev.trim();
          return text ? `${text} ${finalTranscript}` : finalTranscript;
        });
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

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
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Đang nghe..." : (showActions ? "Hỏi thêm về bệnh này..." : "Nhập tên bệnh hoặc câu hỏi...")}
            className={`w-full bg-slate-50 border rounded-full py-3 pl-4 pr-12 text-slate-800 text-base shadow-sm focus:outline-none transition-all ${
              isListening 
                ? 'border-red-400 ring-2 ring-red-100 placeholder-red-400' 
                : 'border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
            }`}
          />
          
          {/* Mic Button (Inside Input) */}
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-md' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {/* Send Button (Outside Input) */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-emerald-600 text-white rounded-full disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-sm active:scale-95 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};