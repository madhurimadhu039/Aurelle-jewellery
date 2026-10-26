import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Scale, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  Camera, 
  Star, 
  Check, 
  Info 
} from 'lucide-react';
import { productService } from '../services/productService';
import { rateService } from '../services/rateService';
import { useApp } from '../contexts/AppContext';
import { VirtualTryOnModal } from '../components/VirtualTryOnModal';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, addToCompare, isInCompare, formatINR } = useApp();

  const product = productService.getById(id || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('12 (Standard)');
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'care' | 'pricing' | 'reviews'>('pricing');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#090806] text-white flex flex-col items-center justify-center p-6">
        <h2 className="font-serif-luxury text-3xl font-bold mb-4">Jewellery Piece Not Found</h2>
        <p className="text-gray-400 mb-6">The jewellery piece you are looking for may have been archived or sold.</p>
        <Link to="/shop" className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider">
          Return to Collection
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Transparent gold calculation for this specific product
  const priceBreakdown = rateService.calculatePrice({
    weightGrams: product.weightGrams,
    purity: product.purity,
    makingChargePercent: product.makingChargePercent ?? 14,
    diamondCarat: product.diamondCarat,
  });

  const relatedProducts = productService
    .getAll()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link to="/shop" className="hover:text-white">Collection</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[#D8B47A] truncate font-medium">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          {/* Left: Gallery & Zoom Area */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#12100C] border border-[#2B2319] group">
              <img
                src={product.images[selectedImageIndex] || product.images[0] || (product.category === 'Bracelets' ? '/images/bracelet-1.jpg' : '/images/aurelle_editorial_ring.jpg')}
                alt={product.name}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (product.category === 'Bracelets') {
                    target.src = '/images/bracelet-1.jpg';
                  } else {
                    target.src = '/images/aurelle_editorial_ring.jpg';
                  }
                }}
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-115 cursor-crosshair"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#090806]/85 text-[#D8B47A] border border-[#D8B47A]/40 backdrop-blur-sm">
                  {product.purity} Gold
                </span>
                {product.certification && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 backdrop-blur-sm">
                    {product.certification}
                  </span>
                )}
              </div>

              {/* Virtual Try-On floating button */}
              <button
                onClick={() => setIsTryOnOpen(true)}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-[#090806]/90 hover:bg-[#18140F] border border-[#D8B47A] text-[#D8B47A] text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md shadow-2xl transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Virtual Try-On</span>
              </button>
            </div>

            {/* Thumbnail row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-[#D8B47A] scale-102' : 'border-[#241F18] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (product.category === 'Bracelets') {
                          target.src = idx === 0 ? '/images/bracelet-1.jpg' : '/images/bracelet-2.jpg';
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurance Card */}
            <div className="bg-[#12100C] border border-[#241F18] rounded-xl p-4 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-[#D8B47A] flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-white">Insured Shipping</h5>
                  <p className="text-[11px] text-gray-500">Tamper-proof armoured delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#D8B47A] flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-white">100% Certified</h5>
                  <p className="text-[11px] text-gray-500">Govt. BIS HUID hallmarking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>SKU: {product.sku}</span>
                <span className="text-[#10B981] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                </span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-[#D8B47A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs font-bold ml-1.5 text-white">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-400">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-xl bg-[#14110C] border border-[#2B2319]">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#F7F1E7]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-500 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-auto">(Inclusive of all taxes & making)</span>
              </div>
              <p className="text-[11px] text-[#D8B47A] mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Eligible for Swarna Nidhi Savings Scheme redemption
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-[#D1C7BA] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Key Specs Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#14110C] border border-[#241F18]">
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Purity</span>
                <span className="font-bold text-white">{product.purity}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#14110C] border border-[#241F18]">
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Gross Weight</span>
                <span className="font-bold text-white">{product.weightGrams} g</span>
              </div>
              {product.diamondCarat && (
                <div className="p-2.5 rounded-lg bg-[#14110C] border border-[#241F18]">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Solitaire</span>
                  <span className="font-bold text-white">{product.diamondCarat} Ct</span>
                </div>
              )}
              <div className="p-2.5 rounded-lg bg-[#14110C] border border-[#241F18]">
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Style</span>
                <span className="font-bold text-white truncate block">{product.style}</span>
              </div>
            </div>

            {/* Size / Variant Selector (if applicable) */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-gray-300 uppercase">Select Size / Fit</span>
                <button
                  type="button"
                  onClick={() => alert('Standard Aurelle Jewellery Size Guide: Ring sizes follow Indian standard sizing scale 8-22.')}
                  className="text-[#D8B47A] hover:underline text-[11px]"
                >
                  Size Guide & Help
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['10', '12 (Standard)', '14', '16', '18'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedSize === size
                        ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                        : 'bg-[#14110C] text-gray-300 border-[#241F18] hover:border-[#D8B47A]/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                    added
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806]'
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
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`px-4 py-3.5 rounded-xl border transition-all ${
                    isWishlisted
                      ? 'bg-[#E11D48] text-white border-[#E11D48]'
                      : 'bg-[#14110C] text-gray-300 border-[#2B2319] hover:text-[#D8B47A] hover:border-[#D8B47A]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => addToCompare(product)}
                  className={`px-4 py-3.5 rounded-xl border transition-all ${
                    isCompared
                      ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                      : 'bg-[#14110C] text-gray-300 border-[#2B2319] hover:text-[#D8B47A] hover:border-[#D8B47A]'
                  }`}
                  title="Compare"
                >
                  <Scale className="w-5 h-5" />
                </button>
              </div>

              <Link
                to="/cart"
                onClick={() => addToCart(product, 1, selectedSize)}
                className="w-full block text-center py-3 rounded-xl bg-[#1D1710] hover:bg-[#282117] border border-[#D8B47A]/30 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Instant Checkout
              </Link>
            </div>

            {/* Transparent Tabs: Unbundled Pricing Formula, Specifications, Care */}
            <div className="pt-6 border-t border-[#241F18]">
              <div className="flex border-b border-[#241F18] gap-4 text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'pricing' ? 'border-[#D8B47A] text-[#D8B47A]' : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Transparent Price Breakdown
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'specs' ? 'border-[#D8B47A] text-[#D8B47A]' : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'care' ? 'border-[#D8B47A] text-[#D8B47A]' : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Care & Warranty
                </button>
              </div>

              <div className="py-4 text-xs">
                {activeTab === 'pricing' && (
                  <div className="bg-[#14110C] border border-[#241F18] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Pure Metal Value ({product.weightGrams}g × {product.purity}):</span>
                      <span className="font-semibold text-white">{formatINR(priceBreakdown.goldValue)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Artisan Making Charges ({priceBreakdown.makingPercent}%):</span>
                      <span className="font-semibold text-white">{formatINR(priceBreakdown.makingCharges)}</span>
                    </div>
                    {product.diamondCarat && (
                      <div className="flex justify-between text-gray-400">
                        <span>Solitaire & Diamonds ({product.diamondCarat} Ct {product.diamondClarity}):</span>
                        <span className="font-semibold text-white">{formatINR(priceBreakdown.stoneValue)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Applicable GST (3%):</span>
                      <span className="font-semibold text-white">{formatINR(priceBreakdown.gst)}</span>
                    </div>
                    <div className="pt-2 border-t border-[#241F18] flex justify-between font-bold text-sm">
                      <span className="text-[#D8B47A]">Total Transparent Selling Price:</span>
                      <span className="text-white">{formatINR(product.price)}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-2 bg-[#14110C] border border-[#241F18] rounded-xl p-4">
                    <div className="flex justify-between border-b border-[#201A14] py-1 text-gray-400">
                      <span>Material:</span> <span className="text-white font-medium">{product.material}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#201A14] py-1 text-gray-400">
                      <span>Certification:</span> <span className="text-white font-medium">{product.certification}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#201A14] py-1 text-gray-400">
                      <span>Dimensions:</span> <span className="text-white font-medium">{product.dimensions || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between py-1 text-gray-400">
                      <span>Occasions:</span> <span className="text-white font-medium">{product.occasion.join(', ')}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="bg-[#14110C] border border-[#241F18] rounded-xl p-4 space-y-2 text-gray-300">
                    <p>• Store in the provided Aurelle velvet presentation casket.</p>
                    <p>• Clean periodically using mild lukewarm soapy water with a soft bristled brush.</p>
                    <p>• Complimentary lifetime guild ultrasonic cleaning & prong inspection at any Aurelle boutique.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Matching and Related Pieces Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[#201A14] text-left">
            <h3 className="font-serif-luxury text-2xl font-bold text-white mb-6">
              Complete Your Ensemble
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Virtual Try-On Modal */}
      {isTryOnOpen && (
        <VirtualTryOnModal
          product={product}
          onClose={() => setIsTryOnOpen(false)}
        />
      )}
    </div>
  );
};
