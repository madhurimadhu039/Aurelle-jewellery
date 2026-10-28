import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, ShoppingBag, Star, Sparkles, Eye } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
  onTryOn?: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onQuickView, onTryOn }) => {
  const { addToCart, toggleWishlist, isInWishlist, addToCompare, isInCompare, formatINR } = useApp();
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  return (
    <div className="group relative bg-[#12100C] border border-[#241F18] hover:border-[#D8B47A]/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(216,180,122,0.12)] flex flex-col">
      {/* Image Area with badges and quick actions */}
      <div className="relative aspect-square overflow-hidden bg-[#0A0907]">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0] || (product.category === 'Bracelets' ? '/images/bracelet-2.jpg' : '/images/editorial-ring.jpg')}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (product.category === 'Bracelets') {
                target.src = '/images/bracelet-2.jpg';
              } else {
                target.src = '/images/editorial-ring.jpg';
              }
            }}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#090806]/85 text-[#D8B47A] border border-[#D8B47A]/30 backdrop-blur-sm">
            {product.purity}
          </span>
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-[#D8B47A] text-[#090806]">
              New
            </span>
          )}
          {product.isBridal && (
            <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-[#78350F]/90 text-[#FDE68A] border border-[#FDE68A]/30">
              Bridal
            </span>
          )}
        </div>

        {/* Floating Quick Action Icons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-[#E11D48] text-white'
                : 'bg-[#090806]/80 text-[#D1C7BA] hover:text-[#D8B47A] hover:bg-[#181510] border border-[#2C2720]'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Compare Button */}
          <button
            onClick={() => addToCompare(product)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isCompared
                ? 'bg-[#D8B47A] text-[#090806]'
                : 'bg-[#090806]/80 text-[#D1C7BA] hover:text-[#D8B47A] hover:bg-[#181510] border border-[#2C2720]'
            }`}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Bottom Action Overlay */}
        <div className="absolute inset-x-2 bottom-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 py-2 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          {onTryOn && (
            <button
              onClick={() => onTryOn(product)}
              className="px-2.5 py-2 rounded-lg bg-[#090806]/90 hover:bg-[#1C1812] border border-[#D8B47A]/50 text-[#D8B47A] text-xs font-semibold flex items-center justify-center gap-1 backdrop-blur-sm"
              title="Virtual Try-On"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Try On</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Weight */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span>{product.category}</span>
            <span>{product.weightGrams}g Net</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h4 className="font-serif-luxury text-base font-semibold text-[#F7F1E7] group-hover:text-[#D8B47A] transition-colors line-clamp-1">
              {product.name}
            </h4>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-[#D8B47A]">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold ml-1 text-white">{product.rating}</span>
            </div>
            <span className="text-[11px] text-gray-500">({product.reviewsCount})</span>
            <span className="text-gray-600 text-xs">•</span>
            <span className="text-[11px] text-gray-400 truncate">{product.material}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-3 border-t border-[#201B15] flex items-baseline justify-between">
          <div>
            <div className="text-base font-extrabold text-[#F7F1E7]">
              {formatINR(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-gray-500 line-through">
                {formatINR(product.originalPrice)}
              </div>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="text-[11px] uppercase tracking-wider font-semibold text-[#D8B47A] hover:underline"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
};
