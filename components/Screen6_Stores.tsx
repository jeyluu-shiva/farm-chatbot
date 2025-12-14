import React from 'react';
import { Compass, Phone, MapPin } from 'lucide-react';
import { Store } from '../types';

interface Props {
  stores: Store[];
}

export const StoresCard: React.FC<Props> = ({ stores }) => {
  return (
    <div className="mb-6 ml-11 max-w-[95%] animate-fade-in-up">
       <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
        <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-800">Cửa hàng gần bạn</span>
        </div>

        <div className="p-3 space-y-3">
          {stores.map((store) => (
            <div key={store.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-bold text-slate-900">{store.name}</h3>
                <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                  {store.distance}
                </span>
              </div>
              
              <p className="text-slate-500 text-xs mb-3 truncate">{store.address}</p>

              <div className="flex gap-2">
                <a 
                  href={`tel:${store.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-semibold active:bg-emerald-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Gọi
                </a>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold shadow-sm active:scale-95 transition-transform">
                  <MapPin className="w-4 h-4" />
                  Chỉ đường
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 text-center border-t border-slate-100">
             <span className="text-[10px] text-slate-400">Ứng dụng không bán thuốc.</span>
        </div>
      </div>
    </div>
  );
};