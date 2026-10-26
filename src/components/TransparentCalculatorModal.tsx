import React, { useState } from 'react';
import { X, Calculator, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { rateService } from '../services/rateService';

interface Props {
  onClose: () => void;
  initialWeight?: number;
  initialPurity?: string;
}

export const TransparentCalculatorModal: React.FC<Props> = ({ 
  onClose,
  initialWeight = 10,
  initialPurity = '22K'
}) => {
  const { rates, formatINR } = useApp();
  const [weight, setWeight] = useState<number>(initialWeight);
  const [purity, setPurity] = useState<string>(initialPurity);
  const [makingPercent, setMakingPercent] = useState<number>(14);
  const [stoneValue, setStoneValue] = useState<number>(0);

  const calc = rateService.calculatePrice({
    weightGrams: weight,
    purity,
    makingChargePercent: makingPercent,
    stoneValue,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12100C] border border-[#D8B47A]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2C2720]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D8B47A]/10 text-[#D8B47A] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display-luxury text-base font-bold text-[#F7F1E7]">
                TRANSPARENT GOLD PRICE CALCULATOR
              </h3>
              <p className="text-xs text-gray-400">100% Honest, unbundled pricing formula</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1E1B15]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 py-5">
          {/* Metal Purity */}
          <div>
            <label className="text-xs uppercase font-medium tracking-wider text-gray-300 block mb-1.5">
              Select Metal & Purity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['24K', '22K', '18K', '14K'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurity(p)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    purity === p
                      ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                      : 'bg-[#181510] text-[#D1C7BA] border-[#2C2720] hover:border-[#D8B47A]/50'
                  }`}
                >
                  {p} Gold
                </button>
              ))}
            </div>
          </div>

          {/* Weight in Grams */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs uppercase font-medium tracking-wider text-gray-300">
                Gold Net Weight (Grams)
              </label>
              <span className="text-xs font-bold text-[#D8B47A]">{weight} g</span>
            </div>
            <input
              type="range"
              min="1"
              max="150"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
              className="w-full accent-[#D8B47A] bg-[#2C2720] rounded-lg h-2"
            />
            <div className="flex gap-2 mt-2">
              {[2, 4.8, 8, 14.2, 28, 50].map((quickWeight) => (
                <button
                  key={quickWeight}
                  type="button"
                  onClick={() => setWeight(quickWeight)}
                  className="px-2 py-1 text-[11px] rounded bg-[#181510] border border-[#2C2720] hover:border-[#D8B47A] text-gray-300"
                >
                  {quickWeight}g
                </button>
              ))}
            </div>
          </div>

          {/* Making Charges Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs uppercase font-medium tracking-wider text-gray-300">
                Making Charges (Artisan Craftsmanship)
              </label>
              <span className="text-xs font-bold text-[#D8B47A]">{makingPercent}%</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              value={makingPercent}
              onChange={(e) => setMakingPercent(parseInt(e.target.value))}
              className="w-full accent-[#D8B47A] bg-[#2C2720] rounded-lg h-2"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Standard plain gold: 10-14% • Intricate Antique/Temple filigree: 16-22%
            </p>
          </div>

          {/* Optional Gemstones / Diamonds value */}
          <div>
            <label className="text-xs uppercase font-medium tracking-wider text-gray-300 block mb-1.5">
              Gemstones / Diamonds Estimated Value (₹)
            </label>
            <input
              type="number"
              min="0"
              step="5000"
              value={stoneValue}
              onChange={(e) => setStoneValue(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0 (Plain jewellery without stones)"
              className="w-full bg-[#181510] border border-[#2C2720] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D8B47A]"
            />
          </div>
        </div>

        {/* Calculation Result Summary Card */}
        <div className="bg-[#181510] border border-[#2C2720] rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Live {purity} Benchmark Rate:</span>
            <span className="font-medium text-white">{formatINR(calc.ratePerGram)}/g</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Pure Metal Value ({weight}g × {formatINR(calc.ratePerGram)}):</span>
            <span className="font-medium text-white">{formatINR(calc.goldValue)}</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Making Charges ({calc.makingPercent}%):</span>
            <span className="font-medium text-white">{formatINR(calc.makingCharges)}</span>
          </div>

          {stoneValue > 0 && (
            <div className="flex justify-between text-gray-400">
              <span>Gemstone & Solitaire Value:</span>
              <span className="font-medium text-white">{formatINR(calc.stoneValue)}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-400">
            <span>Applicable GST (3% on precious jewellery):</span>
            <span className="font-medium text-white">{formatINR(calc.gst)}</span>
          </div>

          <div className="border-t border-[#2C2720] pt-2 mt-2 flex justify-between items-center text-sm font-bold">
            <span className="text-[#D8B47A] uppercase tracking-wider">Estimated Total Price:</span>
            <span className="text-lg text-white font-extrabold">{formatINR(calc.grandTotal)}</span>
          </div>
        </div>

        {/* Transparency Guarantee Note */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400">
          <ShieldCheck className="w-4 h-4 text-[#D8B47A] flex-shrink-0" />
          <span>Aurelle provides 100% itemized tax invoices with complete gold weight and purity breakdown.</span>
        </div>
      </div>
    </div>
  );
};
