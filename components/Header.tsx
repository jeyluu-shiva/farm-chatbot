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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Left Side: Back Button OR Menu Button */}
        {showBack ? (
          <button 
            onClick={onBack}
            className="p-1.5 -ml-2 mr-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          onOpenHistory && (
            <button 
              onClick={onOpenHistory}
              className="p-1.5 -ml-2 mr-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          )
        )}
        
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Leaf className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-800 leading-tight">
            Trợ lý thuốc BVTV
          </h1>
          <span className="text-xs text-slate-500 font-medium">
            Tư vấn trung lập
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Right Side: History (only if Back is shown) & Settings */}
        
        {/* If we are in Chat mode (showBack is true), show a dedicated History button on the right 
            so the user can still access the list without going back home */}
        {showBack && onOpenHistory && (
          <button 
            onClick={onOpenHistory}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            title="Lịch sử chat"
          >
            <Clock className="w-6 h-6" />
          </button>
        )}

        {onOpenSettings && (
          <button 
            onClick={onOpenSettings}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};