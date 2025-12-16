import React from 'react';
import { Leaf, Settings, Menu, ChevronLeft, Clock } from 'lucide-react';

interface Props {
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<Props> = ({ onOpenSettings, onOpenHistory, showBack, onBack }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Left Side: Back Button OR Menu Button */}
        {showBack ? (
          <button 
            onClick={onBack}
            className="p-1.5 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          onOpenHistory && (
            <button 
              onClick={onOpenHistory}
              className="p-1.5 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          )
        )}
        
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">
            Tư vấn BVTV
          </h1>
          <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
            Hỗ trợ ra quyết định - Không thay thế cán bộ chuyên môn
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {showBack && onOpenHistory && (
          <button 
            onClick={onOpenHistory}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
            title="Lịch sử"
          >
            <Clock className="w-5 h-5" />
          </button>
        )}

        {onOpenSettings && (
          <button 
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};