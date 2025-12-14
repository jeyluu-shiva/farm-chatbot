import React, { useState } from 'react';
import { Sprout, Volume2, Square } from 'lucide-react';

interface Props {
  role: 'user' | 'bot';
  content: string;
  onPlayAudio?: (text: string) => Promise<void>;
}

export const ChatMessage: React.FC<Props> = ({ role, content, onPlayAudio }) => {
  const isBot = role === 'bot';
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayClick = async () => {
    if (onPlayAudio && !isPlaying) {
      setIsPlaying(true);
      await onPlayAudio(content);
      setIsPlaying(false);
    }
  };

  return (
    <div className={`flex gap-3 mb-6 animate-fade-in ${!isBot ? 'flex-row-reverse' : ''}`}>
      {isBot && (
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Sprout className="w-5 h-5 text-emerald-600" />
        </div>
      )}
      
      <div 
        className={`
          max-w-[85%] p-4 rounded-2xl shadow-sm text-base leading-relaxed relative group
          ${isBot 
            ? 'bg-white border border-slate-100 rounded-tl-none text-slate-800' 
            : 'bg-emerald-600 text-white rounded-tr-none'
          }
        `}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        
        {isBot && (
          <div className="mt-2 flex justify-end">
            <button 
              onClick={handlePlayClick}
              disabled={isPlaying}
              className={`
                flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors
                ${isPlaying 
                  ? 'bg-emerald-100 text-emerald-700 animate-pulse' 
                  : 'bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                }
              `}
            >
              {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3" />}
              {isPlaying ? 'Đang đọc...' : 'Nghe'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};