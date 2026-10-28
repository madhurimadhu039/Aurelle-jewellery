import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Calculator, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { rateService } from '../services/rateService';
import { TransparentCalculatorModal } from './TransparentCalculatorModal';

export const DailyGoldRatePanel: React.FC = () => {
  const { rates, refreshRates, isRefreshingRates, formatINR } = useApp();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calcPurity, setCalcPurity] = useState<'22K' | '24K'>('22K');

  const handleOpenCalc = (purity: '22K' | '24K') => {
    setCalcPurity(purity);
    setCalculatorOpen(true);
  };

  // Determine status label & badge styling
  const getStatusBadge = () => {
    const status = rates.rateStatus || (rates.isLive ? 'current' : 'delayed');
    switch (status) {
      case 'current':
        return {
          label: 'CURRENT LIVE RATE',
          subtext: 'Trading session active across Indian bullion exchanges',
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotClass: 'bg-emerald-400 animate-pulse',
        };
      case 'delayed':
        return {
          label: 'MARKET CLOSING RATE',
          subtext: 'Market closed for weekend / trading holiday; displaying last confirmed session close',
          badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dotClass: 'bg-amber-400',
        };
      case 'override':
        return {
          label: 'STORE BENCHMARK OVERRIDE',
          subtext: rates.overrideReason || 'Authorized Aurelle Boutique Guild Benchmark',
          badgeClass: 'bg-[#D8B47A]/15 text-[#D8B47A] border-[#D8B47A]/40',
          dotClass: 'bg-[#D8B47A]',
        };
      case 'stale':
        return {
          label: 'LAST CONFIRMED BENCHMARK',
          subtext: 'Provider connection delayed; showing last verified market record',
          badgeClass: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
          dotClass: 'bg-orange-400',
        };
      case 'unavailable':
      default:
        return {
          label: 'TEMPORARILY UNAVAILABLE',
          subtext: 'Live rate feed connecting; showing official baseline',
          badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dotClass: 'bg-rose-400',
        };
    }
  };

  const statusBadge = getStatusBadge();

  // Format the date and time when rates were last successfully updated in Indian Standard Time (IST)
  const getLastUpdatedTimestamp = (): string | null => {
    // 1. If we have a verified timestamp in milliseconds from a genuine live fetch
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

    // 2. If an authorized administrator set a manual override
    if (rates.isManualOverride && rates.overrideAt) {
      return rates.overrideAt.includes('IST') ? rates.overrideAt : `${rates.overrideAt} IST`;
    }

    // 3. If rates object contains a confirmed timestamp string containing IST
    if (rates.lastUpdated && typeof rates.lastUpdated === 'string' && rates.lastUpdated.includes('IST')) {
      return rates.lastUpdated;
    }

    // 4. Otherwise, the actual update timestamp is unavailable
    return null;
  };

  const lastUpdatedDisplay = getLastUpdatedTimestamp();

  return (
    <section className="relative w-full bg-gradient-to-b from-[#090806] via-[#100D09] to-[#090806] py-10 sm:py-14 border-y border-[#262018] text-[#F7F1E7] overflow-hidden">
      {/* Subtle luxury background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D8B47A]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Top Header & Context Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#241F18]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#D8B47A]">
                DAILY BULLION RATES
              </span>
              <span className="text-[#594E3F] text-xs">•</span>
              <span className="text-[11px] text-[#A69C8E] font-serif italic">
                Khazana-Inspired Live Rate Deck
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-wide">
              Today&apos;s Gold & Silver Rates
            </h2>
            <p className="text-xs text-[#A69C8E] mt-1 font-light max-w-xl">
              Authentic daily precious metal benchmarks for India. Transparent pricing with BIS Hallmark purity standards.
            </p>
          </div>

          {/* Date, Time & Status Pill */}
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            {/* Status indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold ${statusBadge.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${statusBadge.dotClass}`} />
              <span>{statusBadge.label}</span>
            </div>

            {/* Last Updated Timestamp & Refresh */}
            <div className="flex items-center gap-2 text-xs text-[#BFB5A7] bg-[#16120C] border border-[#2B2319] px-3.5 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#D8B47A] flex-shrink-0" />
              {lastUpdatedDisplay ? (
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <span className="text-[#8C8375]">Last updated:</span>
                  <span className="font-medium text-white">{lastUpdatedDisplay}</span>
                </div>
              ) : (
                <span className="text-[11px] sm:text-xs text-[#8C8375]">
                  Last updated: <span className="text-amber-400 font-medium">Unavailable.</span>
                </span>
              )}

              <button
                onClick={() => refreshRates()}
                disabled={isRefreshingRates}
                className="ml-1 p-1 text-gray-400 hover:text-[#D8B47A] transition-colors disabled:opacity-50 flex-shrink-0"
                title="Refresh latest bullion feed"
                aria-label="Refresh latest bullion rates"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingRates ? 'animate-spin text-[#D8B47A]' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pillar Cards (Khazana App Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          
          {/* Card 1: 22K Hallmark Gold */}
          <div className="relative bg-[#130F0A] border-2 border-[#D8B47A]/40 hover:border-[#D8B47A] rounded-2xl p-6 transition-all duration-300 shadow-xl group hover:shadow-[0_0_30px_rgba(216,180,122,0.12)]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1C1710] border border-[#D8B47A]/60 flex items-center justify-center text-[#D8B47A] font-serif font-bold text-base shadow-inner">
                  22K
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white tracking-wide">
                    22 Karat Gold
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#A69C8E] block">
                    BIS 916 Hallmark Standard
                  </span>
                </div>
              </div>

              {/* 24h Trend */}
              <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" />
                <span>+₹{Math.abs(rates.goldChange24h || 25)}</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="my-5 pb-5 border-b border-[#241F18]">
              <span className="text-[11px] text-[#A69C8E] uppercase tracking-wider block font-medium">
                Rate Per Gram
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#F7F1E7] tracking-tight">
                  {formatINR(rates.gold22k)}
                </span>
                <span className="text-xs text-[#8C8375] font-light">/ 1g</span>
              </div>
              <p className="text-[11px] text-[#8C8375] mt-1.5">
                Benchmark for gold necklaces, rings, jhumkas & bridal heirlooms.
              </p>
            </div>

            {/* Quick Reference & Calculator Action */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-[10px] uppercase text-[#736A5E] block">1 Sovereign (8g)</span>
                <span className="font-semibold text-[#D8B47A]">
                  {formatINR(rateService.getSovereignRate(rates))}
                </span>
              </div>

              <button
                onClick={() => handleOpenCalc('22K')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1710] border border-[#2B2319] hover:border-[#D8B47A] text-[11px] text-[#D8B47A] font-medium transition-all"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate</span>
              </button>
            </div>
          </div>

          {/* Card 2: 24K Pure Gold */}
          <div className="relative bg-[#130F0A] border-2 border-[#D8B47A]/60 hover:border-[#F2CA8A] rounded-2xl p-6 transition-all duration-300 shadow-xl group hover:shadow-[0_0_30px_rgba(216,180,122,0.18)]">
            {/* Top highlight ribbon */}
            <div className="absolute -top-3 right-6 bg-[#D8B47A] text-[#090806] text-[9px] uppercase font-bold tracking-widest px-3 py-0.5 rounded-full shadow-md">
              99.9% PURE BULLION
            </div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#201A12] border-2 border-[#D8B47A] flex items-center justify-center text-[#D8B47A] font-serif font-bold text-base shadow-inner">
                  24K
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white tracking-wide">
                    24 Karat Pure Gold
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#D8B47A] block font-medium">
                    Fine Bullion (999 Purity)
                  </span>
                </div>
              </div>

              {/* 24h Trend */}
              <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" />
                <span>+₹{Math.abs(Math.round((rates.goldChange24h || 25) * 1.09))}</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="my-5 pb-5 border-b border-[#241F18]">
              <span className="text-[11px] text-[#A69C8E] uppercase tracking-wider block font-medium">
                Rate Per Gram
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#F2CA8A] tracking-tight">
                  {formatINR(rates.gold24k)}
                </span>
                <span className="text-xs text-[#8C8375] font-light">/ 1g</span>
              </div>
              <p className="text-[11px] text-[#8C8375] mt-1.5">
                Standard for minted gold bars, investment coins & temple assay ingots.
              </p>
            </div>

            {/* Quick Reference & Calculator Action */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-[10px] uppercase text-[#736A5E] block">10 Grams Bullion</span>
                <span className="font-semibold text-[#F2CA8A]">
                  {formatINR(rateService.getTenGram24kRate(rates))}
                </span>
              </div>

              <button
                onClick={() => handleOpenCalc('24K')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201A12] border border-[#3A2F22] hover:border-[#D8B47A] text-[11px] text-[#F2CA8A] font-medium transition-all"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate</span>
              </button>
            </div>
          </div>

          {/* Card 3: Fine Silver */}
          <div className="relative bg-[#130F0A] border-2 border-[#D8B47A]/40 hover:border-[#D8B47A] rounded-2xl p-6 transition-all duration-300 shadow-xl group hover:shadow-[0_0_30px_rgba(216,180,122,0.12)]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1C1710] border border-gray-500/60 flex items-center justify-center text-gray-300 font-serif font-bold text-base shadow-inner">
                  AG
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white tracking-wide">
                    Fine Silver
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[#A69C8E] block">
                    999 Fine Bullion Standard
                  </span>
                </div>
              </div>

              {/* 24h Trend */}
              <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" />
                <span>+₹{Math.abs(rates.silverChange24h || 0.8)}</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="my-5 pb-5 border-b border-[#241F18]">
              <span className="text-[11px] text-[#A69C8E] uppercase tracking-wider block font-medium">
                Rate Per Gram
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#F7F1E7] tracking-tight">
                  {formatINR(rates.silver1g)}
                </span>
                <span className="text-xs text-[#8C8375] font-light">/ 1g</span>
              </div>
              <p className="text-[11px] text-[#8C8375] mt-1.5">
                Pure silver bars, sterling artefacts & certified gift silver articles.
              </p>
            </div>

            {/* Quick Reference & Info */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-[10px] uppercase text-[#736A5E] block">1 Kilogram (1000g)</span>
                <span className="font-semibold text-gray-200">
                  {formatINR(rateService.getKilogramSilverRate(rates))}
                </span>
              </div>

              <span className="text-[10px] text-gray-400 bg-[#1C1710] px-2.5 py-1 rounded border border-[#2B2319]">
                999 Purity
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Transparency & Disclaimer Strip */}
        <div className="mt-8 pt-4 border-t border-[#1C1712] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[#8C8375]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D8B47A] flex-shrink-0" />
            <span>
              All rates in INR per gram, sourced via registered Indian bullion benchmarks. Excludes 3% GST and artisanal making charges.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#D8B47A] font-medium">Provider: {rates.provider}</span>
            <span className="text-[#3A332A]">|</span>
            <button
              onClick={() => handleOpenCalc('22K')}
              className="text-[#D8B47A] hover:underline font-semibold"
            >
              Open Pricing Breakdown Calculator →
            </button>
          </div>
        </div>

      </div>

      {/* Transparent Calculator Modal */}
      {calculatorOpen && (
        <TransparentCalculatorModal 
          onClose={() => setCalculatorOpen(false)} 
          initialPurity={calcPurity}
        />
      )}
    </section>
  );
};
