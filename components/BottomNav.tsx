import React from 'react';
import { Home, User, Plus } from 'lucide-react';
import { AppView } from '../types';

interface Props {
  currentView: AppView;
  onChange: (view: AppView) => void;
  onNewChat: () => void;
}

export const BottomNav: React.FC<Props> = ({ currentView, onChange, onNewChat }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 pb-5 flex items-end justify-between z-40 max-w-md mx-auto shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
      
      {/* Home Button */}
      <button 
        onClick={() => onChange('home')}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${
          currentView === 'home' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className={`w-6 h-6 ${currentView === 'home' ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-medium">Trang chủ</span>
      </button>

      {/* FAB - New Chat */}
      <div className="relative -top-5">
        <button 
          onClick={onNewChat}
          className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 active:scale-90 transition-transform hover:bg-emerald-700"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Profile Button */}
      <button 
        onClick={() => onChange('profile')}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${
          currentView === 'profile' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User className={`w-6 h-6 ${currentView === 'profile' ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-medium">Cá nhân</span>
      </button>

    </div>
  );
};