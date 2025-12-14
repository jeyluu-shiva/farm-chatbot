import React from 'react';
import { ScanSearch, MapPin, Clock, ChevronRight, Leaf, Calculator, ArrowRight, Trash2 } from 'lucide-react';
import { ChatSession, UserProfile } from '../types';

interface Props {
  user: UserProfile;
  recentSessions: ChatSession[];
  onOpenSession: (id: string) => void;
  onNewChat: () => void;
  onFindStore: () => void;
  onOpenCalculator: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export const HomeScreen: React.FC<Props> = ({ 
  user, 
  recentSessions, 
  onOpenSession, 
  onNewChat,
  onFindStore,
  onOpenCalculator,
  onDeleteSession
}) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Section */}
      <div className="bg-emerald-600 text-white px-6 pt-12 pb-16 rounded-b-[2rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Xin chào,</p>
            <h1 className="text-2xl font-bold">{user.name || 'Nhà nông'}</h1>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
             <span className="text-xs font-medium">Trợ lý 24/7</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-6">
        
        {/* Main Assistant Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
           <div className="flex items-center gap-2 mb-4">
             <Leaf className="w-5 h-5 text-emerald-600" />
             <h2 className="font-bold text-slate-800">Cần hỗ trợ ngay?</h2>
           </div>
           
           <button 
             onClick={onNewChat}
             className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-between group"
           >
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                 <ScanSearch className="w-6 h-6 text-white" />
               </div>
               <div className="text-left">
                 <p className="font-bold text-lg">Chẩn đoán bệnh</p>
                 <p className="text-emerald-100 text-xs">Hỏi đáp về cây trồng & thuốc</p>
               </div>
             </div>
             <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
           </button>
        </div>

        {/* Utilities Grid */}
        <div>
           <h2 className="font-bold text-slate-800 text-lg mb-3 px-1">Tiện ích nhà nông</h2>
           <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={onFindStore}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm active:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Tìm cửa hàng</span>
              </button>

              <button 
                onClick={onOpenCalculator}
                className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm active:bg-slate-50 transition-colors relative overflow-hidden"
              >
                {/* Badge for New Feature */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">Tính tiền khoai</span>
              </button>
           </div>
        </div>

        {/* Recent History */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-slate-800 text-lg">Gần đây</h2>
          </div>

          <div className="space-y-3">
            {recentSessions.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-400 text-sm">Chưa có hội thoại nào</p>
              </div>
            ) : (
              recentSessions.slice(0, 3).map((session) => (
                <div 
                  key={session.id}
                  onClick={() => onOpenSession(session.id)}
                  className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform text-left cursor-pointer group relative"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 text-slate-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-semibold text-slate-800 truncate">{session.title}</h3>
                    <p className="text-xs text-slate-500 truncate">{session.preview}</p>
                  </div>
                  
                  {/* Standard Arrow (hidden on hover/mobile interaction if needed, but keeping for UX) */}
                  <ChevronRight className="w-5 h-5 text-slate-300 absolute right-4 opacity-100 group-hover:opacity-0 transition-opacity" />

                  {/* Delete Button */}
                  <button
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="absolute right-2 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 z-10"
                    title="Xóa hội thoại"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};