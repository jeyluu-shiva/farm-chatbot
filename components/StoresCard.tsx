import React from 'react';
import { Compass, Phone, MapPin, Tag } from 'lucide-react';
import { Store } from '../types';

interface Props {
  stores: Store[];
}

export const StoresCard: React.FC<Props> = ({ stores }) => {
  return (
    <div className="mb-6 ml-11 max-w-[95%] animate-fade-in-up">
       <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-800">Cửa hàng đề xuất</span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-emerald-100 text-emerald-600 font-medium">
            {stores.length} kết quả
          </span>
        </div>

        <div className="p-3 space-y-3">
          {stores.map((store) => (
            <div key={store.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold text-slate-800 leading-tight pr-2">{store.name}</h3>
                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg flex-shrink-0">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-bold text-xs whitespace-nowrap">
                    {store.distance}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 text-xs leading-relaxed">{store.address}</p>
              </div>
              
              {/* Tags */}
              {store.tags && store.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {store.tags.map((tag, idx) => (
                    <div key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-500">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <a 
                  href={`tel:${store.phone}`}
                  className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-semibold active:bg-slate-50 transition-colors hover:border-emerald-200 hover:text-emerald-700 group"
                >
                  <Phone className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                  <span>Gọi điện</span>
                </a>
                <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-emerald-200 active:scale-95 transition-all hover:bg-emerald-700">
                  <MapPin className="w-4 h-4" />
                  Chỉ đường
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-slate-50 text-center border-t border-slate-100">
             <p className="text-[10px] text-slate-400 italic">Kết quả dựa trên vị trí của bạn</p>
        </div>
      </div>
    </div>
  );
};