import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle, Info, Sprout, Bug, Calendar, Activity, ChevronDown, ChevronUp, ShieldAlert, FlaskConical } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  variant?: 'chat' | 'full';
}

export const AnalysisResultCard: React.FC<Props> = ({ result, variant = 'chat' }) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);

  // Safety check: ensure result and essential sub-objects exist
  if (!result || !result.decision || !result.summary) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 animate-fade-in">
        <div className="font-bold mb-1">Lỗi hiển thị dữ liệu</div>
        Thông tin phân tích chưa đầy đủ hoặc bị lỗi. Vui lòng thử lại.
      </div>
    );
  }

  const isSprayRecommended = result.decision.action === 'spray';
  
  const containerClass = variant === 'chat' 
    ? "ml-0 sm:ml-2 max-w-full animate-fade-in-up mb-6"
    : "animate-fade-in space-y-4";

  return (
    <div className={containerClass}>
      
      {/* 1. Decision Badge Card (Moved to top for Result Screen priority) */}
      <div className={`rounded-xl p-5 border text-center shadow-sm ${
        isSprayRecommended 
          ? 'bg-emerald-50 border-emerald-100' 
          : 'bg-amber-50 border-amber-100'
      }`}>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${
           isSprayRecommended ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {isSprayRecommended ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          <span className="font-bold text-sm">{result.decision.label || 'Kết quả phân tích'}</span>
        </div>
        <p className={`text-sm leading-relaxed ${isSprayRecommended ? 'text-emerald-800' : 'text-amber-900'}`}>
          {result.decision.reason}
        </p>
      </div>

      {/* 2. Summary Card (Collapsible) */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-100/50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin ghi nhận</span>
          </div>
          {isSummaryOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        
        {isSummaryOpen && (
          <div className="p-4 border-t border-slate-200 animate-fade-in">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <div className="flex items-start gap-2">
                <Sprout className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Cây trồng</p>
                  <p className="text-sm font-semibold text-slate-700">{result.summary.crop || '---'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Bug className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Vấn đề</p>
                  <p className="text-sm font-semibold text-slate-700">{result.summary.disease || '---'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Giai đoạn</p>
                  <p className="text-sm font-semibold text-slate-700">{result.summary.stage || '---'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Mức độ</p>
                  <p className="text-sm font-semibold text-slate-700">{result.summary.severity || '---'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Products Card (Keep Visible) */}
      {result.products && result.products.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-slate-400" />
            Thuốc thương mại tham khảo
          </h3>
          <div className="space-y-2">
            {result.products.map((prod) => {
               const isExpanded = expandedProduct === prod.id;
               return (
                <div key={prod.id} className="border border-slate-100 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setExpandedProduct(isExpanded ? null : prod.id)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-700">{prod.name}</p>
                      <p className="text-[10px] text-slate-500">Hoạt chất: {prod.activeIngredient}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isExpanded && (
                    <div className="p-3 bg-white text-xs text-slate-600 space-y-2 border-t border-slate-100 animate-fade-in">
                      <p><span className="font-semibold text-slate-700">Dạng thuốc:</span> {prod.formulation}</p>
                      {prod.usage && <p><span className="font-semibold text-slate-700">Cách dùng:</span> {prod.usage}</p>}
                      {prod.description && <p className="italic text-slate-500">{prod.description}</p>}
                    </div>
                  )}
                </div>
               );
            })}
          </div>
        </div>
      )}

      {/* 4. Ingredients Card (Collapsible) */}
      {result.ingredients && result.ingredients.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button 
             onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
             className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
          >
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              Hoạt chất phù hợp
            </h3>
            {isIngredientsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {isIngredientsOpen && (
            <div className="p-4 pt-0 border-t border-slate-50 animate-fade-in">
              <div className="space-y-2 mt-3">
                {result.ingredients.map((ing) => (
                  <div key={ing.id} className="flex flex-col pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-slate-700">{ing.name}</span>
                      {ing.priority === 'High' && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Ưu tiên</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{ing.mechanism}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Warning Card */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="bg-red-50 rounded-xl border-l-4 border-red-400 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold text-red-700 uppercase">Lưu ý quan trọng</h3>
          </div>
          <ul className="list-disc list-inside text-sm text-red-900/80 space-y-1">
            {result.warnings.map((warn, idx) => (
              <li key={idx} className="leading-relaxed">{warn}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};