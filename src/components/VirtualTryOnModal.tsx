import React, { useState } from 'react';
import { X, Camera, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';

interface Props {
  product?: Product;
  onClose: () => void;
}

export const VirtualTryOnModal: React.FC<Props> = ({ product, onClose }) => {
  const { addToCart, formatINR } = useApp();
  const [selectedModel, setSelectedModel] = useState<'portrait' | 'neck' | 'hand'>('portrait');
  const [added, setAdded] = useState(false);

  const modelImages = {
    portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    neck: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    hand: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  React.useEffect(() => {
    // Lock background page scroll while Try-On modal is open
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#12100C] border border-[#D8B47A]/50 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-y-auto md:overflow-hidden shadow-2xl my-auto overscroll-contain">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#2C2720] bg-[#0E0C09] sticky top-0 z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D8B47A]/10 text-[#D8B47A] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display-luxury text-sm sm:text-base font-bold text-[#F7F1E7] tracking-wide leading-tight">
                AURELLE VIRTUAL TRY-ON STUDIO
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-400">Interactive Augmented Fitting & Style Visualizer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Try-On Studio"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E1B15] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-y-auto md:overflow-hidden">
          {/* Main Visualizer Canvas Area */}
          <div className="md:col-span-2 relative bg-[#070605] flex items-center justify-center h-64 sm:h-80 md:min-h-[480px] overflow-hidden select-none">
            {/* Background Model Image */}
            <img
              src={modelImages[selectedModel]}
              alt="Fitting Model"
              className="w-full h-full object-cover opacity-90 transition-all duration-500"
            />

            {/* Instruction Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-[#090806]/85 backdrop-blur-md px-4 py-2 rounded-xl border border-[#2C2720] text-xs text-gray-300">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#D8B47A]" />
                Virtual fitting mannequin preview
              </span>
              <span className="text-[#D8B47A] font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> High-Fashion Studio
              </span>
            </div>
          </div>

          {/* Controls & Product Specs Sidebar */}
          <div className="p-4 sm:p-5 bg-[#12100C] border-t md:border-t-0 md:border-l border-[#2C2720] flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              {/* Product Info */}
              {product && (
                <div className="border-b border-[#241F18] pb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8B47A]">
                    {product.purity} • {product.category}
                  </span>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#F7F1E7] mt-0.5">
                    {product.name}
                  </h4>
                  <div className="text-base font-extrabold text-[#D8B47A] mt-1">
                    {formatINR(product.price)}
                  </div>
                </div>
              )}

              {/* Model Pose Selector */}
              <div>
                <label className="text-xs uppercase font-medium tracking-wider text-gray-400 block mb-2">
                  Select Model View
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedModel('portrait')}
                    className={`py-2 text-xs rounded-lg border font-medium ${
                      selectedModel === 'portrait'
                        ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                        : 'bg-[#181510] text-gray-300 border-[#2C2720]'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setSelectedModel('neck')}
                    className={`py-2 text-xs rounded-lg border font-medium ${
                      selectedModel === 'neck'
                        ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                        : 'bg-[#181510] text-gray-300 border-[#2C2720]'
                    }`}
                  >
                    Neckline
                  </button>
                  <button
                    onClick={() => setSelectedModel('hand')}
                    className={`py-2 text-xs rounded-lg border font-medium ${
                      selectedModel === 'hand'
                        ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                        : 'bg-[#181510] text-gray-300 border-[#2C2720]'
                    }`}
                  >
                    Hand/Wrist
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#241F18] space-y-2 mt-4">
              {product && (
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    added
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag ({formatINR(product.price)})</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-gray-400 hover:text-white"
              >
                Close Visualizer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
