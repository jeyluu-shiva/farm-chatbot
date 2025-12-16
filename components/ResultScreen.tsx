import React, { useState } from 'react';
import { AnalysisResult, Store } from '../types';
import { AnalysisResultCard } from './AnalysisResultCard';
import { StoresCard } from './StoresCard';
import { Home, Plus, Save, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  stores?: Store[];
  onNewCase: () => void;
  onSaveAndExit: () => void;
  onBack: () => void;
}

export const ResultScreen: React.FC<Props> = ({ result, stores, onNewCase, onSaveAndExit, onBack }) => {
  const [feedback, setFeedback] = useState<'improved' | 'worse' | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
       {/* Header */}
       <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
             <button onClick={onBack} className="text-slate-500 p-1 hover:bg-slate-50 rounded-full">
               <ArrowLeft className="w-6 h-6" />
             </button>
             <h1 className="text-lg font-bold text-slate-800">Kết quả phân tích</h1>
          </div>
          <button onClick={onSaveAndExit} className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
            Trang chủ
          </button>
       </header>

       {/* Content */}
       <div className="flex-1 overflow-y-auto p-4 pb-32">
          <AnalysisResultCard result={result} variant="full" />
          
          {stores && stores.length > 0 && (
            <div className="mt-4">
              <StoresCard stores={stores} variant="full" />
            </div>
          )}

          {/* Feedback Section (Moved to Bottom) */}
          <div className="mt-8 flex items-center justify-between bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Thông tin này có hữu ích không?</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setFeedback('improved')}
                className={`p-2 rounded-lg transition-colors ${feedback === 'improved' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'}`}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setFeedback('worse')}
                className={`p-2 rounded-lg transition-colors ${feedback === 'worse' ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600'}`}
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>
       </div>

       {/* Bottom CTAs */}
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] max-w-md mx-auto z-20">
          <div className="grid grid-cols-2 gap-3">
             <button
                onClick={onNewCase}
                className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
             >
                <Plus className="w-5 h-5" />
                Tư vấn ca khác
             </button>
             <button
                onClick={onSaveAndExit}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
             >
                <Save className="w-5 h-5" />
                Lưu trường hợp
             </button>
          </div>
       </div>
    </div>
  );
};