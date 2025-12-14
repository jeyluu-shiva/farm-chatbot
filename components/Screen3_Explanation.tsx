import React from 'react';
import { FlaskConical, Pill, Compass } from 'lucide-react';

interface Props {
  onAction: (action: 'ingredients' | 'products' | 'stores') => void;
}

export const ActionOptions: React.FC<Props> = ({ onAction }) => {
  return (
    <div className="flex flex-col gap-2 mb-6 ml-11 animate-fade-in">
      <p className="text-xs text-slate-400 font-medium ml-1 mb-1">ĐỀ XUẤT HÀNH ĐỘNG</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onAction('ingredients')}
          className="flex items-center gap-2 bg-white border border-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-50 transition-all active:scale-95"
        >
          <FlaskConical className="w-4 h-4" />
          <span className="font-medium">Xem hoạt chất</span>
        </button>
        
        <button
          onClick={() => onAction('products')}
          className="flex items-center gap-2 bg-white border border-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-50 transition-all active:scale-95"
        >
          <Pill className="w-4 h-4" />
          <span className="font-medium">Tham khảo thuốc</span>
        </button>

        <button
          onClick={() => onAction('stores')}
          className="flex items-center gap-2 bg-white border border-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-50 transition-all active:scale-95"
        >
          <Compass className="w-4 h-4" />
          <span className="font-medium">Tìm nơi bán</span>
        </button>
      </div>
    </div>
  );
};