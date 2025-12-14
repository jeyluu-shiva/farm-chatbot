import React, { useState, useEffect } from 'react';
import { Sprout, ChevronRight, User, Check, Wheat, Phone, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  // Steps: 1: Welcome, 2: Phone, 3: OTP, 4: Name, 5: Crops
  const [step, setStep] = useState(1);
  
  // Data State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  
  // UI/Logic State
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

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

  // Logic: Send OTP
  const handleSendOtp = () => {
    if (phoneNumber.length < 9) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
      setCountdown(60); // 60s cooldown
      // In a real app, this triggers SMS
      console.log("OTP Sent to", phoneNumber);
    }, 1000);
  };

  // Logic: Verify OTP
  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;
    setIsLoading(true);

    // Simulate Verify API
    setTimeout(() => {
      setIsLoading(false);
      // Success
      setStep(4);
    }, 800);
  };

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
      phoneNumber: phoneNumber,
      crops: selectedCrops
    });
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col relative overflow-hidden">
      {/* Progress Bar (Only for steps > 1) */}
      {step > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} 
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
              Đăng ký tài khoản
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="mt-6 text-xs text-slate-400">
              Ứng dụng tư vấn trung lập, không bán hàng.
            </p>
          </div>
        )}

        {/* STEP 2: PHONE INPUT */}
        {step === 2 && (
          <div className="w-full max-w-xs animate-fade-in-up">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Số điện thoại</h2>
            <p className="text-slate-500 mb-8">Nhập số điện thoại để tạo tài khoản</p>

            <div className="relative mb-6">
              <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ''); // Only numbers
                  setPhoneNumber(val);
                }}
                placeholder="0912 345 678"
                autoFocus
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-2xl text-center font-bold tracking-widest shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                maxLength={10}
              />
            </div>

            <button 
              onClick={handleSendOtp}
              disabled={phoneNumber.length < 9 || isLoading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Tiếp tục <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 3 && (
          <div className="w-full max-w-xs animate-fade-in-up">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-purple-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Xác thực OTP</h2>
            <p className="text-slate-500 mb-8">
              Mã xác thực đã gửi đến <span className="font-bold text-slate-700">{phoneNumber}</span>
            </p>

            <input 
              type="text"
              value={otp}
              onChange={(e) => {
                 const val = e.target.value.replace(/\D/g, '');
                 setOtp(val);
              }}
              placeholder="000000"
              maxLength={6}
              autoFocus
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-3xl text-center font-bold tracking-[0.5em] shadow-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 mb-6"
            />

            <button 
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isLoading}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
               {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Xác thực'
              )}
            </button>

            <div className="mt-6 flex justify-center">
              {countdown > 0 ? (
                <span className="text-sm text-slate-400 font-medium">
                  Gửi lại mã sau {countdown}s
                </span>
              ) : (
                <button 
                  onClick={handleSendOtp}
                  className="flex items-center gap-2 text-sm text-emerald-600 font-bold hover:underline"
                >
                  <RefreshCw className="w-4 h-4" /> Gửi lại mã
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: NAME INPUT */}
        {step === 4 && (
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

        {/* STEP 5: CROP SELECTION */}
        {step === 5 && (
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