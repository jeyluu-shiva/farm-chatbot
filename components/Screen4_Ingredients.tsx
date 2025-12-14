import React from 'react';
import { FlaskConical } from 'lucide-react';
import { Ingredient } from '../types';

interface Props {
  ingredients: Ingredient[];
}

export const IngredientsCard: React.FC<Props> = ({ ingredients }) => {
  return (
    <div className="mb-6 ml-11 max-w-[90%] animate-fade-in-up">
      <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
        <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-800">Hoạt chất phổ biến</span>
        </div>
        <div className="p-3 space-y-3">
          {ingredients.map((ing) => (
            <div key={ing.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-1">{ing.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{ing.mechanism}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};