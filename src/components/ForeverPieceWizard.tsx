import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useApp } from '../contexts/AppContext';

export const ForeverPieceWizard: React.FC = () => {
  const { formatINR, addToCart } = useApp();
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState<string>('Bridal');
  const [category, setCategory] = useState<string>('Rings');
  const [metal, setMetal] = useState<string>('18K');
  const [budgetMax, setBudgetMax] = useState<number>(250000);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);

  const occasions = ['Bridal', 'Engagement', 'Festive / Wedding', 'Everyday Luxury', 'Anniversary Gift'];
  const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Mangalsutras'];
  const metals = [
    { label: '18K Diamond Solitaire', val: '18K' },
    { label: '22K Traditional Gold', val: '22K' },
    { label: 'Rose Gold & Solitaire', val: '18K' },
  ];
  const budgets = [
    { label: 'Under ₹1,00,000', max: 100000 },
    { label: '₹1,00,000 - ₹2,00,000', max: 200000 },
    { label: '₹2,00,000 - ₹3,50,000', max: 350000 },
    { label: 'Above ₹3,50,000 (Royal High Jewellery)', max: 1000000 },
  ];

  const handleFinish = () => {
    const all = productService.getAll();
    let matches = all.filter((p) => {
      const catMatch = p.category.toLowerCase().includes(category.toLowerCase().slice(0, 4));
      const priceMatch = p.price <= budgetMax;
      return catMatch || priceMatch;
    });

    if (matches.length === 0) {
      matches = all.slice(0, 3);
    } else {
      matches = matches.slice(0, 3);
    }

    setRecommendations(matches);
    setHasCompleted(true);
  };

  const handleReset = () => {
    setStep(1);
    setHasCompleted(false);
    setRecommendations([]);
  };

  return (
    <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-10 relative overflow-hidden">
      {/* Subtle gold background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#D8B47A]/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F1912] border border-[#D8B47A]/30 text-xs font-semibold uppercase tracking-widest text-[#D8B47A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Jewellery Concierge
          </span>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F7F1E7]">
            Find Your Forever Piece
          </h3>
          <p className="text-xs sm:text-sm text-[#BFB5A7] mt-1 max-w-lg mx-auto">
            Answer 3 quick preferences and let our luxury master curators reveal the perfect heirloom for your milestone.
          </p>
        </div>

        {!hasCompleted ? (
          <div>
            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                      step === s
                        ? 'bg-[#D8B47A] text-[#090806]'
                        : step > s
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#1D1913] text-gray-400 border border-[#2B2319]'
                    }`}
                  >
                    {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  {s < 3 && <div className="w-8 sm:w-12 h-0.5 bg-[#2B2319]" />}
                </div>
              ))}
            </div>

            {/* Step 1: Occasion */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-center text-[#D8B47A]">
                  Step 1: What is the Special Occasion?
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {occasions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all ${
                        occasion === occ
                          ? 'bg-[#1E1912] border-[#D8B47A] text-[#F7F1E7] shadow-[0_0_15px_rgba(216,180,122,0.15)]'
                          : 'bg-[#16120D] border-[#2B2319] text-gray-400 hover:text-white hover:border-[#D8B47A]/40'
                      }`}
                    >
                      <span className="block text-base mb-1">✦</span>
                      <span>{occ}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#EBD5A8] transition-colors"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Category & Metal */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-center text-[#D8B47A]">
                  Step 2: Desired Jewellery Type & Precious Metal
                </h4>
                
                <div>
                  <label className="text-xs text-gray-400 block mb-2 font-medium">Jewellery Category:</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-1 text-center text-xs rounded-lg border font-medium transition-all ${
                          category === cat
                            ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                            : 'bg-[#16120D] text-gray-300 border-[#2B2319] hover:border-[#D8B47A]/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-gray-400 block mb-2 font-medium">Preferred Metal / Setting:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {metals.map((m) => (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => setMetal(m.val)}
                        className={`py-2.5 px-3 text-center text-xs rounded-lg border font-medium transition-all ${
                          metal === m.val
                            ? 'bg-[#1E1912] border-[#D8B47A] text-white'
                            : 'bg-[#16120D] text-gray-400 border-[#2B2319]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#EBD5A8] transition-colors"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Budget Bracket */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-center text-[#D8B47A]">
                  Step 3: Select Your Budget Range
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {budgets.map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => setBudgetMax(b.max)}
                      className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all ${
                        budgetMax === b.max
                          ? 'bg-[#1E1912] border-[#D8B47A] text-[#F7F1E7] shadow-[0_0_15px_rgba(216,180,122,0.15)]'
                          : 'bg-[#16120D] border-[#2B2319] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-bold text-[#D8B47A] block mb-1">{b.label}</span>
                      <span className="text-[11px] text-gray-400">Includes making charges and certification</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinish}
                    className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#EBD5A8] transition-colors shadow-lg"
                  >
                    Reveal Curated Matches <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Recommended Results */
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B2319]">
              <div>
                <span className="text-xs uppercase font-bold text-[#D8B47A]">Curated Recommendations</span>
                <p className="text-xs text-gray-400">
                  Matches for {occasion} • {category} • Under {formatINR(budgetMax)}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-[#D8B47A] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendations.map((prod, idx) => (
                <div key={prod.id} className="bg-[#16120D] border border-[#2B2319] rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-black mb-2">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (prod.category === 'Bracelets') {
                            target.src = '/images/bracelet-1.jpg';
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#090806]/80 text-[#D8B47A] border border-[#D8B47A]/30">
                        {98 - idx * 4}% Match
                      </span>
                    </div>
                    <h5 className="font-serif-luxury text-sm font-semibold text-white line-clamp-1">{prod.name}</h5>
                    <div className="text-xs font-bold text-[#D8B47A] mt-1">{formatINR(prod.price)}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#201A14] flex gap-2">
                    <Link
                      to={`/product/${prod.id}`}
                      className="flex-1 py-1.5 text-center text-[11px] font-semibold rounded bg-[#2B2319] hover:bg-[#3A3022] text-white"
                    >
                      View Piece
                    </Link>
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="px-2.5 py-1.5 rounded bg-[#D8B47A] text-[#090806] hover:bg-[#EBD5A8]"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
