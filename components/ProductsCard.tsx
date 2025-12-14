import React, { useState } from 'react';
import { Pill, AlertTriangle, ChevronDown, ChevronUp, MapPin, Info, Droplet } from 'lucide-react';
import { Product } from '../types';

interface Props {
  products: Product[];
  onFindStore: (productName: string) => void;
}

export const ProductsCard: React.FC<Props> = ({ products, onFindStore }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="mb-6 ml-11 max-w-[90%] animate-fade-in-up">
      <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-800">Thuốc tham khảo</span>
        </div>
        
        <div className="p-2 space-y-2">
          {products.map((prod) => {
            const isExpanded = expandedId === prod.id;
            return (
              <div 
                key={prod.id} 
                className={`
                  bg-white rounded-xl border transition-all duration-200 overflow-hidden
                  ${isExpanded ? 'border-emerald-200 shadow-md ring-1 ring-emerald-100' : 'border-slate-100 shadow-sm hover:border-emerald-100'}
                `}
              >
                {/* Header (Always Visible) */}
                <button 
                  onClick={() => toggleExpand(prod.id)}
                  className="w-full p-3 flex justify-between items-start text-left"
                >
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className={`text-base font-bold transition-colors ${isExpanded ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {prod.name}
                      </h3>
                      <div className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 uppercase border border-slate-200">
                        {prod.formulation}
                      </div>
                    </div>
                    
                    <p className="text-slate-500 text-xs">
                      Hoạt chất: <span className="font-medium text-slate-700">{prod.activeIngredient}</span>
                    </p>
                  </div>
                  
                  <div className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 animate-fade-in">
                    <div className="border-t border-slate-100 my-2"></div>
                    
                    <div className="space-y-3 mb-4">
                      {prod.description && (
                        <div className="flex gap-2">
                          <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <div>
                             <p className="text-xs font-bold text-slate-700 mb-0.5">Công dụng:</p>
                             <p className="text-xs text-slate-600 leading-relaxed">{prod.description}</p>
                          </div>
                        </div>
                      )}
                      
                      {prod.usage && (
                        <div className="flex gap-2">
                          <Droplet className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                             <p className="text-xs font-bold text-slate-700 mb-0.5">Liều dùng:</p>
                             <p className="text-xs text-slate-600 leading-relaxed">{prod.usage}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onFindStore(prod.name);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-100 active:scale-95 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      Tìm cửa hàng có bán
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-amber-50 p-3 flex gap-2 items-start border-t border-amber-100/50">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 leading-tight">
            Vui lòng đọc kỹ hướng dẫn sử dụng in trên bao bì.
          </p>
        </div>
      </div>
    </div>
  );
};