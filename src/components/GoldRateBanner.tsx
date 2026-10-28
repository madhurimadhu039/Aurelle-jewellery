import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { TransparentCalculatorModal } from './TransparentCalculatorModal';

export const GoldRateBanner: React.FC = () => {
  const { rates, refreshRates, isRefreshingRates, formatINR } = useApp();
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  // Format the actual last successfully updated timestamp in Indian Standard Time (IST)
  const getLastUpdatedTimestamp = (): string | null => {
    if (rates.lastFetchedAt && typeof rates.lastFetchedAt === 'number' && rates.lastFetchedAt > 0) {
      const d = new Date(rates.lastFetchedAt);
      const datePart = d.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const timePart = d.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return `${datePart}, ${timePart} IST`;
    }
    if (rates.isManualOverride && rates.overrideAt) {
      return rates.overrideAt.includes('IST') ? rates.overrideAt : `${rates.overrideAt} IST`;
    }
    if (rates.lastUpdated && typeof rates.lastUpdated === 'string' && rates.lastUpdated.includes('IST')) {
      return rates.lastUpdated;
    }
    return null;
  };

  const lastUpdatedDisplay = getLastUpdatedTimestamp();

  return (
    <div className="w-full bg-[#090806] border-y border-[#262018] text-[#D1C7BA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-xs">
          
          {/* Left Block: Today's Gold Rate */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-center md:justify-start">
            {/* Round gold coin icon matching reference */}
            <div className="w-8 h-8 rounded-full border border-[#D8B47A]/50 bg-[#16120C] flex items-center justify-center flex-shrink-0 text-[#D8B47A]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10M7 12h10M8.5 8.5l7 7M15.5 8.5l-7 7" strokeOpacity="0.6" />
                <circle cx="12" cy="12" r="3" fill="#D8B47A" fillOpacity="0.3" />
              </svg>
            </div>

            <div className="text-left">
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#9E9486] font-medium block">
                TODAY&apos;S GOLD RATE
              </span>
              <div className="flex items-center gap-4 sm:gap-6 mt-0.5 font-medium text-white text-[12px] sm:text-[13px]">
                <div>
                  <span className="text-[#BFB5A7] mr-1.5 font-normal text-[11px]">22K Gold</span>
                  <span className="tracking-wide">{formatINR(rates.gold22k)}</span>
                  <span className="text-[#8C8375] text-[10px] font-light">/g</span>
                </div>
                <div>
                  <span className="text-[#BFB5A7] mr-1.5 font-normal text-[11px]">24K Gold</span>
                  <span className="tracking-wide text-[#E8C896]">{formatINR(rates.gold24k)}</span>
                  <span className="text-[#8C8375] text-[10px] font-light">/g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thin Vertical Separator on Desktop */}
          <div className="hidden md:block h-8 w-[1px] bg-[#262018]" />

          {/* Middle Block: Today's Silver Rate */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-center md:justify-start">
            {/* Round silver diamond icon matching reference */}
            <div className="w-8 h-8 rounded-full border border-[#D8B47A]/50 bg-[#16120C] flex items-center justify-center flex-shrink-0 text-[#D8B47A]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3l7 7-7 11-7-11z" />
                <path d="M5 10h14M12 3v18" strokeOpacity="0.5" />
              </svg>
            </div>

            <div className="text-left">
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#9E9486] font-medium block">
                TODAY&apos;S SILVER RATE
              </span>
              <div className="mt-0.5 font-medium text-white text-[12px] sm:text-[13px]">
                <span className="text-[#BFB5A7] mr-2 font-normal text-[11px]">Silver</span>
                <span className="tracking-wide">{formatINR(rates.silver1g)}</span>
                <span className="text-[#8C8375] text-[10px] font-light">/g</span>
              </div>
            </div>
          </div>

          {/* Thin Vertical Separator on Desktop */}
          <div className="hidden md:block h-8 w-[1px] bg-[#262018]" />

          {/* Right Block: Timestamp & Refresh & Calculator Modal */}
          <div className="flex items-center gap-3 justify-center md:justify-end text-[11px] text-[#A69C8E]">
            <button
              onClick={() => setCalculatorOpen(true)}
              className="text-[10px] uppercase tracking-wider text-[#D8B47A] hover:underline mr-1"
              title="Open Transparent Calculator"
            >
              Gold Calculator
            </button>

            <span className="hidden sm:inline text-[#7A7165]">|</span>

            <div className="flex flex-col text-right">
              <span className="text-[10px] text-[#D8B47A] font-medium leading-tight">
                {rates.isLive ? '● Live Bullion Market' : 'Official Guild Benchmark'}
              </span>
              <span className="text-[10px] text-[#8C8375]">
                {lastUpdatedDisplay ? `Last updated: ${lastUpdatedDisplay}` : 'Last updated: Unavailable.'}
              </span>
            </div>

            <button
              onClick={() => refreshRates()}
              disabled={isRefreshingRates}
              className="p-1.5 hover:text-[#D8B47A] transition-colors disabled:opacity-50"
              title="Refresh Bullion Feed"
              aria-label="Refresh rates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingRates ? 'animate-spin text-[#D8B47A]' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {calculatorOpen && (
        <TransparentCalculatorModal onClose={() => setCalculatorOpen(false)} />
      )}
    </div>
  );
};
