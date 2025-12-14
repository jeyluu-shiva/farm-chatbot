import React, { useState } from 'react';
import { User, Settings, Shield, LogOut, ChevronRight, Edit2 } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onOpenSettings: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ user, onUpdateUser, onOpenSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  const handleSaveName = () => {
    onUpdateUser({ ...user, name: nameInput });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white pt-12 pb-6 px-6 border-b border-slate-100">
         <h1 className="text-2xl font-bold text-slate-800 mb-6">Tài khoản</h1>
         
         <div className="flex items-center gap-4">
           <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border-4 border-white shadow-sm">
             <User className="w-10 h-10" />
           </div>
           
           <div className="flex-1">
             {isEditing ? (
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={nameInput}
                   onChange={(e) => setNameInput(e.target.value)}
                   className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                   autoFocus
                 />
                 <button 
                  onClick={handleSaveName}
                  className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold"
                 >
                   Lưu
                 </button>
               </div>
             ) : (
               <div className="flex items-center gap-2">
                 <h2 className="text-xl font-bold text-slate-800">{user.name || 'Người dùng'}</h2>
                 <button onClick={() => setIsEditing(true)} className="p-1 text-slate-400 hover:text-emerald-600">
                   <Edit2 className="w-4 h-4" />
                 </button>
               </div>
             )}
             <p className="text-sm text-slate-500">Nông dân</p>
           </div>
         </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Cài đặt ứng dụng</h3>
        
        <button 
          onClick={onOpenSettings}
          className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 active:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Settings className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-slate-800">Cấu hình Chatbot</h3>
            <p className="text-xs text-slate-500">Giọng đọc, phong cách trả lời</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mt-6">Thông tin khác</h3>
        
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center gap-3 border-b border-slate-50 active:bg-slate-50">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
              <Shield className="w-4 h-4" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-slate-700">Chính sách bảo mật</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
          
          <button className="w-full p-4 flex items-center gap-3 active:bg-slate-50 text-red-600">
            <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="flex-1 text-left text-sm font-medium">Đặt lại dữ liệu</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Phiên bản 1.0.0
        </p>
      </div>
    </div>
  );
};