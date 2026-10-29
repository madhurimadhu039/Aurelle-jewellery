import React, { useState } from 'react';
import { Camera, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';

export const TryOnPage: React.FC = () => {
  const { addToCart, formatINR } = useApp();
  const products = productService.getAll();
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [selectedModel, setSelectedModel] = useState<'portrait' | 'neck' | 'hand'>('portrait');
  const [added, setAdded] = useState(false);

  const modelImages = {
    portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    neck: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
    hand: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
            AUGMENTED LUXURY EXPERIENCE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-1">
            Virtual Try-On Studio
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-lg mx-auto">
            Experience how Aurelle solitaires, royal necklaces, and chandbali earrings drape on high-fashion models before making your selection.
          </p>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-[#120F0B] border border-[#2B2319] rounded-3xl overflow-hidden shadow-2xl">
          {/* Visualizer Canvas */}
          <div className="lg:col-span-2 relative bg-black flex items-center justify-center min-h-[460px] lg:min-h-[600px] overflow-hidden select-none">
            <img
              src={modelImages[selectedModel]}
              alt="Model"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Control Bar Overlay */}
            <div className="absolute bottom-4 inset-x-4 flex justify-between items-center bg-[#090806]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#2C2720] text-xs">
              <span className="flex items-center gap-1.5 text-gray-300">
                <Camera className="w-4 h-4 text-[#D8B47A]" />
                High-definition jewellery mannequin visualizer
              </span>
              <span className="text-[#D8B47A] flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Curated Studio Fit
              </span>
            </div>
          </div>

          {/* Right Controls & Product Selector */}
          <div className="p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#241F18]">
            <div className="space-y-6">
              {/* Active Product Card */}
              <div className="border-b border-[#241F18] pb-4">
                <span className="text-[10px] uppercase font-bold text-[#D8B47A]">Selected Piece</span>
                <h3 className="font-serif-luxury text-xl font-bold text-white mt-0.5">{selectedProduct.name}</h3>
                <div className="text-lg font-extrabold text-[#D8B47A] mt-1">
                  {formatINR(selectedProduct.price)}
                </div>
              </div>

              {/* Model View Selector */}
              <div>
                <label className="text-xs uppercase font-semibold text-gray-400 block mb-2">Fitting Mannequin Pose</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedModel('portrait')}
                    className={`py-2 text-xs rounded-lg border font-semibold ${
                      selectedModel === 'portrait' ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]' : 'bg-[#18140F] text-gray-300 border-[#2B2319]'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setSelectedModel('neck')}
                    className={`py-2 text-xs rounded-lg border font-semibold ${
                      selectedModel === 'neck' ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]' : 'bg-[#18140F] text-gray-300 border-[#2B2319]'
                    }`}
                  >
                    Neckline
                  </button>
                  <button
                    onClick={() => setSelectedModel('hand')}
                    className={`py-2 text-xs rounded-lg border font-semibold ${
                      selectedModel === 'hand' ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]' : 'bg-[#18140F] text-gray-300 border-[#2B2319]'
                    }`}
                  >
                    Wrist/Hand
                  </button>
                </div>
              </div>

              {/* Choose Another Jewellery Piece */}
              <div>
                <label className="text-xs uppercase font-semibold text-gray-400 block mb-2">Switch Jewellery Piece</label>
                <div className="grid grid-cols-4 gap-2">
                  {products.slice(0, 8).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedProduct.id === p.id ? 'border-[#D8B47A] scale-105' : 'border-[#241F18] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#241F18] space-y-2">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  added ? 'bg-[#10B981] text-white' : 'bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag ({formatINR(selectedProduct.price)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
