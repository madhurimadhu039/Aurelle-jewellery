import React, { useEffect, useState } from 'react';
import { X, Star, ShoppingBag, Sparkles, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';

interface Props {
  product: Product;
  onClose: () => void;
  onTryOn?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<Props> = ({ product, onClose, onTryOn }) => {
  const { addToCart, toggleWishlist, isInWishlist, formatINR } = useApp();
  const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = isInWishlist(product.id);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <div
        className="relative bg-[#120F0B] border border-[#D8B47A]/50 rounded-2xl max-w-3xl w-full p-4 sm:p-6 md:p-8 text-left shadow-2xl my-auto max-h-[92vh] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-[#1A1510] hover:bg-[#251E17] text-gray-400 hover:text-white border border-[#D8B47A]/30 flex items-center justify-center text-xl font-light transition-all z-20"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
          {/* Left: Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0A0907] border border-[#241F18]">
              <img
                src={selectedImage || product.images?.[0] || ''}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#090806]/85 text-[#D8B47A] border border-[#D8B47A]/30">
                  {product.purity} Gold
                </span>
                {product.isBridal && (
                  <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-[#78350F]/90 text-[#FDE68A] border border-[#FDE68A]/30">
                    Bridal
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails if multiple images exist */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border flex-shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#D8B47A] ring-1 ring-[#D8B47A]'
                        : 'border-[#241F18] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span className="text-[#D8B47A] uppercase font-semibold text-[11px] tracking-wider">
                  {product.category}
                </span>
                <span className="font-mono text-[10px] text-gray-500">{product.sku}</span>
              </div>

              {/* Title */}
              <h2 id="quickview-title" className="font-serif-luxury text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center text-[#D8B47A]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold ml-1 text-white">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-400">({product.reviewsCount} verified reviews)</span>
                <span className="text-gray-600">•</span>
                <span className="text-xs text-gray-400">{product.weightGrams}g Net</span>
              </div>

              {/* Price */}
              <div className="p-3.5 rounded-xl bg-[#18140F] border border-[#241F18] mb-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#F7F1E7]">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Inclusive of 3% GST &amp; BIS Hallmarking Assay Charges
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-3">
                {product.description}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 mb-4 p-2.5 rounded-lg bg-[#0E0C09] border border-[#221B13]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D8B47A] flex-shrink-0" />
                  <span>BIS HUID Hallmarked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0" />
                  <span>Insured Express Shipping</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-3 border-t border-[#241F18]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  className={`w-12 rounded-xl flex items-center justify-center border transition-all ${
                    isWishlisted
                      ? 'bg-[#E11D48] text-white border-[#E11D48]'
                      : 'bg-[#18140F] border-[#2C2720] text-gray-400 hover:text-[#D8B47A]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {onTryOn && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onTryOn(product);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#18140F] hover:bg-[#251E17] text-[#D8B47A] border border-[#D8B47A]/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Virtual Try-On Studio</span>
                  </button>
                )}

                <a
                  href={`/product/${product.id}`}
                  className="py-2.5 px-3 rounded-xl bg-[#18140F] hover:bg-[#201B15] text-gray-300 hover:text-white border border-[#241F18] text-xs font-medium flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <span>Full Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

