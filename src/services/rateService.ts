import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { MetalRateData } from '../types';
import { INITIAL_RATES } from '../data/mockData';

const RATES_STORAGE_KEY = 'aurelle_metal_rates';

type RateListener = (rates: MetalRateData) => void;
const rateListeners: Set<RateListener> = new Set();

function notifyRateListeners(rates: MetalRateData) {
  rateListeners.forEach((l) => {
    try {
      l(rates);
    } catch (e) {
      console.error('Error notifying rate listener', e);
    }
  });
}

export const rateService = {
  subscribe(listener: RateListener): () => void {
    rateListeners.add(listener);
    return () => rateListeners.delete(listener);
  },

  getRates(): MetalRateData {
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

  /**
   * Fetch latest rate snapshot from Firestore or local cache
   */
  async fetchRates(): Promise<MetalRateData> {
    if (isFirebaseConfigured && db) {
      try {
        const rateDoc = await getDoc(doc(db, 'rate_snapshots', 'latest'));
        if (rateDoc.exists()) {
          const data = rateDoc.data() as MetalRateData;
          localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(data));
          notifyRateListeners(data);
          return data;
        }
      } catch (e) {
        console.warn('Could not read rates from Firestore:', e);
      }
    }
    return rateService.getRates();
  },

  /**
   * Admin updates store benchmark rates across system
   */
  async updateRates(newRates: Partial<MetalRateData>): Promise<MetalRateData> {
    const current = rateService.getRates();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    const updated: MetalRateData = {
      ...current,
      ...newRates,
      lastUpdated: `${timeStr}, ${dateStr}`,
      provider: 'Aurelle Master Guild Benchmark (IBJA Basis)',
      isLive: false,
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'rate_snapshots', 'latest'), updated, { merge: true });
      } catch (e) {
        console.warn('Error saving rates to Firestore:', e);
      }
    }

    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(updated));
    notifyRateListeners(updated);
    return updated;
  },

  /**
   * Refresh rates via legitimate external provider if configured, or report baseline
   */
  async refreshLiveRates(): Promise<{ rates: MetalRateData; source: 'api' | 'benchmark'; message: string }> {
    const apiKey = import.meta.env.VITE_GOLD_API_KEY;

    if (apiKey && apiKey !== 'your_bullion_rate_api_key_here') {
      try {
        // Query legitimate bullion market API (GoldAPI.io endpoint)
        const response = await fetch('https://www.goldapi.io/api/XAU/INR', {
          headers: {
            'x-access-token': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const goldData = await response.json();
          // Also fetch silver
          const silverRes = await fetch('https://www.goldapi.io/api/XAG/INR', {
            headers: {
              'x-access-token': apiKey,
              'Content-Type': 'application/json',
            },
          });
          const silverData = silverRes.ok ? await silverRes.json() : null;

          const current = rateService.getRates();
          const rate24kPerGram = Math.round(goldData.price_gram_24k || (goldData.price / 31.1035));
          const rate22kPerGram = Math.round(goldData.price_gram_22k || (rate24kPerGram * (22 / 24)));
          const silverPerGram = silverData ? Number((silverData.price_gram_24k || (silverData.price / 31.1035)).toFixed(1)) : current.silver1g;

          const now = new Date();
          const updated: MetalRateData = {
            ...current,
            gold24k: rate24kPerGram,
            gold22k: rate22kPerGram,
            silver1g: silverPerGram,
            lastUpdated: `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, Today`,
            isLive: true,
            provider: 'Live Bullion Feed (GoldAPI)',
          };

          localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(updated));
          notifyRateListeners(updated);
          return { rates: updated, source: 'api', message: 'Live bullion rates updated from configured API provider.' };
        }
      } catch (err: any) {
        console.warn('Live API request failed, falling back to official benchmark:', err);
      }
    }

    // When external provider key is not configured or unreachable:
    // Report legitimate benchmark without inventing fake random fluctuations
    const current = rateService.getRates();
    const updated: MetalRateData = {
      ...current,
      provider: 'Aurelle Master Guild Benchmark (IBJA Basis)',
      isLive: false,
    };
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(updated));
    notifyRateListeners(updated);

    return { 
      rates: updated, 
      source: 'benchmark', 
      message: 'External bullion provider API key pending configuration. Showing official Aurelle Guild Benchmark.' 
    };
  },

  // Transparent Gold & Diamond Calculator
  calculatePrice(params: {
    weightGrams: number;
    purity: string;
    makingChargePercent?: number;
    stoneValue?: number;
    diamondCarat?: number;
  }) {
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
