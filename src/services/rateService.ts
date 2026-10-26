import { MetalRateData } from '../types';
import { INITIAL_RATES } from '../data/mockData';

const RATES_STORAGE_KEY = 'aurelle_metal_rates';

export const rateService = {
  getRates: (): MetalRateData => {
    const saved = localStorage.getItem(RATES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored rates', e);
      }
    }
    return INITIAL_RATES;
  },

  updateRates: (newRates: Partial<MetalRateData>): MetalRateData => {
    const current = rateService.getRates();
    const updated: MetalRateData = {
      ...current,
      ...newRates,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
    };
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  refreshLiveRates: async (): Promise<MetalRateData> => {
    // In production with an API key, we fetch from a bullion API like GoldAPI or Metals-API
    // Here we simulate live market micro-fluctuations to show real-time dynamic behavior
    await new Promise((r) => setTimeout(r, 600));
    const current = rateService.getRates();
    const goldDelta = Math.floor((Math.random() * 20 - 8));
    const silverDelta = Number((Math.random() * 0.8 - 0.3).toFixed(1));

    const updated: MetalRateData = {
      ...current,
      gold22k: Math.max(8000, current.gold22k + goldDelta),
      gold24k: Math.max(8800, current.gold24k + Math.round(goldDelta * 1.09)),
      silver1g: Math.max(90, Number((current.silver1g + silverDelta).toFixed(1))),
      goldChange24h: Number((current.goldChange24h + (goldDelta > 0 ? 2.5 : -2.5)).toFixed(1)),
      silverChange24h: Number((current.silverChange24h + silverDelta).toFixed(1)),
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', Just now',
      isLive: true,
    };

    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Transparent Gold & Diamond Calculator
  calculatePrice: (params: {
    weightGrams: number;
    purity: string;
    makingChargePercent?: number;
    stoneValue?: number;
    diamondCarat?: number;
  }) => {
    const rates = rateService.getRates();
    let ratePerGram = rates.gold22k;

    if (params.purity === '24K') ratePerGram = rates.gold24k;
    else if (params.purity === '22K') ratePerGram = rates.gold22k;
    else if (params.purity === '18K') ratePerGram = Math.round(rates.gold24k * (18 / 24));
    else if (params.purity === '14K') ratePerGram = Math.round(rates.gold24k * (14 / 24));
    else if (params.purity.includes('Silver')) ratePerGram = rates.silver1g;

    const goldValue = Math.round(params.weightGrams * ratePerGram);
    const makingPercent = params.makingChargePercent ?? 14;
    const makingCharges = Math.round(goldValue * (makingPercent / 100));
    const stones = params.stoneValue ?? (params.diamondCarat ? params.diamondCarat * 75000 : 0);
    const subtotal = goldValue + makingCharges + stones;
    const gst3Percent = Math.round(subtotal * 0.03);
    const grandTotal = subtotal + gst3Percent;

    return {
      ratePerGram,
      goldValue,
      makingCharges,
      makingPercent,
      stoneValue: stones,
      subtotal,
      gst: gst3Percent,
      grandTotal,
    };
  },
};
