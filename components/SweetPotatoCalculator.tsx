import React, { useState, useEffect } from 'react';
import { ArrowLeft, Coins, Scale, Sprout, Save } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const SweetPotatoCalculator: React.FC<Props> = ({ onBack }) => {
  const [bagCount, setBagCount] = useState<string>('');
  const [bagWeight, setBagWeight] = useState<string>('20');
  const [taType, setTaType] = useState<string>('60');
  const [pricePerTa, setPricePerTa] = useState<string>('');
  const [deposit, setDeposit] = useState<string>('');
  const [areaSize, setAreaSize] = useState<string>('');
  const [areaUnit, setAreaUnit] = useState<string>('Công');

  const [totalKg, setTotalKg] = useState<number>(0);
  const [totalTa, setTotalTa] = useState<number>(0);
  const [totalMoney, setTotalMoney] = useState<number>(0);
  const [netMoney, setNetMoney] = useState<number>(0);
  const [yieldPerUnit, setYieldPerUnit] = useState<number>(0);
  const [yieldTaPerUnit, setYieldTaPerUnit] = useState<number>(0);

  // Restore data on mount
  useEffect(() => {
    const saved = localStorage.getItem('sweetPotatoCalcLast');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.bagCount) setBagCount(data.bagCount.toString());
        if (data.bagWeight) setBagWeight(data.bagWeight.toString());
        if (data.taType) setTaType(data.taType.toString());
        if (data.pricePerTa) setPricePerTa(data.pricePerTa.toString());
        if (data.deposit) setDeposit(data.deposit.toString());
        if (data.areaSize) setAreaSize(data.areaSize.toString());
        if (data.areaUnit) setAreaUnit(data.areaUnit);
      } catch (e) {
        console.error("Error loading saved calc data", e);
      }
    }
  }, []);

  useEffect(() => {
    const count = parseFloat(bagCount) || 0;
    const weight = parseFloat(bagWeight) || 0;
    const taUnit = parseFloat(taType) || 60;
    const price = parseFloat(pricePerTa) || 0;
    const depositValue = parseFloat(deposit) || 0;
    const area = parseFloat(areaSize) || 0;

    const calculatedTotalKg = count * weight;
    setTotalKg(calculatedTotalKg);

    const calculatedTotalTa = taUnit > 0 ? calculatedTotalKg / taUnit : 0;
    setTotalTa(calculatedTotalTa);

    const calculatedMoney = calculatedTotalTa * price;
    setTotalMoney(calculatedMoney);
    setNetMoney(Math.max(0, calculatedMoney - depositValue));

    if (area > 0) {
      setYieldPerUnit(calculatedTotalKg / area);
      setYieldTaPerUnit((calculatedTotalKg / area) / (taUnit || 60));
    } else {
      setYieldPerUnit(0);
      setYieldTaPerUnit(0);
    }
  }, [bagCount, bagWeight, taType, pricePerTa, deposit, areaSize]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(num);
  };

  const saveLocal = () => {
    const taUnit = parseFloat(taType) || 60;
    const payload = {
      bagCount: parseFloat(bagCount) || 0,
      bagWeight: parseFloat(bagWeight) || 0,
      taType: taUnit,
      pricePerTa: parseFloat(pricePerTa) || 0,
      deposit: parseFloat(deposit) || 0,
      areaSize: parseFloat(areaSize) || 0,
      areaUnit,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem('sweetPotatoCalcLast', JSON.stringify(payload));
      alert('Đã lưu kết quả tính vào máy!');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-emerald-600 text-white p-4 shadow-md flex items-center gap-3">
        <button 
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold">Tính Tiền Khoai Lang</h2>
          <p className="text-emerald-100 text-xs">Công cụ tính toán nhanh</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        
        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          <div className="bg-purple-50/50 p-4 border-b border-purple-100 flex items-center gap-2">
            <Coins className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-900">Kết Quả Tính Toán</h3>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Tổng Tiền Thu Được</p>
              <p className="text-2xl font-bold text-purple-700 break-all">{formatCurrency(totalMoney)}</p>
              
              {parseFloat(deposit || '0') > 0 && (
                <div className="mt-3 pt-3 border-t border-purple-200 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-gray-500">Tiền Cọc</p>
                    <p className="text-sm font-semibold text-gray-700">{formatCurrency(parseFloat(deposit))}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Thực nhận</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(netMoney)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 mb-1 font-semibold">Tổng Khối Lượng</p>
                <p className="text-base font-bold text-blue-800">{formatNumber(totalKg)} kg</p>
                <p className="text-xs text-blue-600">({formatNumber(totalTa)} tạ)</p>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-600 mb-1 font-semibold">Năng Suất</p>
                <p className="text-base font-bold text-emerald-800">{formatNumber(yieldTaPerUnit)} tạ</p>
                <p className="text-xs text-emerald-600">/{areaUnit}</p>
              </div>
            </div>

            <button 
              onClick={saveLocal} 
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-200"
            >
              <Save className="w-4 h-4" />
              Lưu kết quả
            </button>
          </div>
        </div>

        {/* Input Section 1: Harvest Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Nhập Thông Tin</h3>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold mb-3 pb-2 border-b border-slate-50">
              <Scale className="w-5 h-5 text-emerald-500" />
              <span>Thu Hoạch</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="bagCount" className="text-xs font-semibold text-slate-500">Số Bọc (Bao)</label>
                <input 
                  id="bagCount" 
                  type="number" 
                  placeholder="0" 
                  value={bagCount} 
                  onChange={(e)=>setBagCount(e.target.value)} 
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="bagWeight" className="text-xs font-semibold text-slate-500">Kg/Bọc</label>
                <input 
                  id="bagWeight" 
                  type="number" 
                  value={bagWeight} 
                  onChange={(e)=>setBagWeight(e.target.value)} 
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Input Section 2: Price */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold mb-3 pb-2 border-b border-slate-50">
              <Coins className="w-5 h-5 text-amber-500" />
              <span>Giá & Cọc</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label htmlFor="taType" className="text-xs font-semibold text-slate-500">Loại Tạ</label>
                <select 
                  id="taType" 
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white" 
                  value={taType} 
                  onChange={(e)=>setTaType(e.target.value)}
                >
                  <option value="60">60 kg</option>
                  <option value="100">100 kg</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="price" className="text-xs font-semibold text-slate-500">Giá (VNĐ/Tạ)</label>
                <input 
                  id="price" 
                  type="number" 
                  placeholder="0" 
                  value={pricePerTa} 
                  onChange={(e)=>setPricePerTa(e.target.value)} 
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="deposit" className="text-xs font-semibold text-slate-500">Tiền Cọc (nếu có)</label>
              <input 
                id="deposit" 
                type="number" 
                placeholder="0" 
                value={deposit} 
                onChange={(e)=>setDeposit(e.target.value)} 
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" 
              />
            </div>
          </div>

          {/* Input Section 3: Area */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold mb-3 pb-2 border-b border-slate-50">
              <Sprout className="w-5 h-5 text-green-500" />
              <span>Diện Tích</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                id="areaSize" 
                type="number" 
                placeholder="Diện tích" 
                value={areaSize} 
                onChange={(e) => setAreaSize(e.target.value)} 
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" 
              />
              <select 
                value={areaUnit} 
                onChange={(e)=>setAreaUnit(e.target.value)} 
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="Công">Công</option>
                <option value="Sào">Sào</option>
                <option value="M2">m²</option>
                <option value="Ha">Ha</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};