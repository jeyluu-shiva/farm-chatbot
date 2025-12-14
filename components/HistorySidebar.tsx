import React from 'react';
import { X, MessageSquarePlus, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { ChatSession } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export const HistorySidebar: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat,
  onDeleteSession
}) => {
  // Sort sessions by newest first
  const sortedSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-[85%] max-w-[300px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Lịch sử tư vấn
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-all hover:bg-emerald-700"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Cuộc hội thoại mới
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-2">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-slate-400 text-sm">Chưa có lịch sử hội thoại nào.</p>
            </div>
          ) : (
            sortedSessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
                className={`
                  group relative p-3 rounded-xl border transition-all cursor-pointer
                  ${session.id === currentSessionId 
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                  }
                `}
              >
                <div className="pr-8">
                  <h3 className={`font-semibold text-sm mb-1 truncate ${session.id === currentSessionId ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {session.title || 'Hội thoại mới'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {session.preview}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {formatDate(session.timestamp)}
                  </span>
                </div>
                
                {/* Delete Action */}
                <button
                  onClick={(e) => onDeleteSession(session.id, e)}
                  className="absolute right-2 top-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400">Dữ liệu được lưu trên thiết bị của bạn</span>
        </div>
      </div>
    </>
  );
};