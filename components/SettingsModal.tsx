import React from 'react';
import { X, Settings, Volume2, MessageSquare, Clock } from 'lucide-react';
import { BotConfig, BotTone, BotLength, BotVoice } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: BotConfig;
  onSave: (config: BotConfig) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, config, onSave }) => {
  if (!isOpen) return null;

  const handleToneChange = (tone: BotTone) => onSave({ ...config, tone });
  const handleLengthChange = (length: BotLength) => onSave({ ...config, length });
  const handleVoiceChange = (voice: BotVoice) => onSave({ ...config, voice });

  const toneOptions = [
    { id: 'friendly', label: 'Thân thiện' },
    { id: 'expert', label: 'Chuyên gia' },
    { id: 'humorous', label: 'Hài hước' },
    { id: 'western', label: 'Miền Tây' }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative z-10 animate-fade-in-up">
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Cấu hình Chatbot</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          
          {/* Tone Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Phong cách trả lời</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleToneChange(opt.id as BotTone)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    config.tone === opt.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Độ dài câu trả lời</span>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'concise', label: 'Ngắn gọn' },
                { id: 'detailed', label: 'Chi tiết, đầy đủ' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleLengthChange(opt.id as BotLength)}
                  className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium border transition-all ${
                    config.length === opt.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <span>Giọng đọc (TTS)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Kore', 'Puck', 'Fenrir', 'Aoede', 'Charon'].map((voice) => (
                <button
                  key={voice}
                  onClick={() => handleVoiceChange(voice as BotVoice)}
                  className={`py-2 px-1 rounded-lg text-sm font-medium border transition-all ${
                    config.voice === voice
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {voice}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};