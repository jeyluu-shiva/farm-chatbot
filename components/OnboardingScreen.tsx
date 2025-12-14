import React, { useState } from 'react';
import { Sprout, ChevronRight, User, Check, Wheat } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const cropOptions = [
    'Lúa',
    'Cây ăn trái',
    'Rau màu',
    'Cà phê',
    'Hồ tiêu',
    'Điều',
    'Cây cảnh',
    'Khác'
  ];

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) 
        ? prev.filter(c => c !== crop) 
        : [...prev, crop]
    );
  };

  const handleFinish = () => {
    onComplete({
      name: name || 'Nhà nông',
      crops: selectedCrops
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col relative overflow-hidden">
      {/* Progress Bar (Only for steps > 1) */}
      {step > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300" 
            style={{ width: `${((step - 1) / 2) * 100}%` }} 
          />
        </div>
      )}

      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
        
        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="w-full max-w-xs">
            <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100/50 animate-bounce-subtle">
              <Sprout className="w-12 h-12 text-emerald-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-3">
              Trợ lý thuốc BVTV
            </h1>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed">
              Đồng hành cùng nhà nông.<br/>
              Chẩn đoán bệnh - Tìm thuốc - Tra cứu cửa hàng.
            </p>

            <button 
              onClick={handleNext}
              className="group w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Bắt đầu ngay
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="mt-6 text-xs text-slate-400">
              Ứng dụng tư vấn trung lập, không bán hàng.
            </p>
          </div>
        )}

        {/* STEP 2: NAME INPUT */}
        {step === 2 && (
          <div className="w-full max-w-xs animate-fade-in-up">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-blue-500" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Làm quen nhé!</h2>
            <p className="text-slate-500 mb-8">Tên của anh/chị là gì?</p>

            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              autoFocus
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-lg text-center font-medium shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 mb-6"
            />

            <button 
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp tục
            </button>
          </div>
        )}

        {/* STEP 3: CROP SELECTION */}
        {step === 3 && (
          <div className="w-full max-w-sm animate-fade-in-up">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wheat className="w-8 h-8 text-amber-500" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Cây trồng</h2>
            <p className="text-slate-500 mb-6">Anh/chị đang canh tác loại cây nào?</p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {cropOptions.map(crop => {
                const isSelected = selectedCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`
                      py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-between
                      ${isSelected 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md transform scale-[1.02]' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    {crop}
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleFinish}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              Hoàn tất
            </button>
            <button 
              onClick={handleFinish}
              className="mt-4 text-sm text-slate-400 font-medium hover:text-slate-600"
            >
              Bỏ qua bước này
            </button>
          </div>
        )}
      </div>
    </div>
  );
};