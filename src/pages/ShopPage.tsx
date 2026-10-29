import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Search, 
  RotateCcw, 
  Sparkles,
  ShoppingBag,
  Heart,
  Scale
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { VirtualTryOnModal } from '../components/VirtualTryOnModal';
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';
import { MainCategoryNav, MainCategoryKey } from '../components/MainCategoryNav';
import { productService } from '../services/productService';
import { Product, Category } from '../types';
import { useApp } from '../contexts/AppContext';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatINR, products } = useApp();

  const urlCategory = searchParams.get('category') || 'All Jewellery';
  const urlSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [selectedPurity, setSelectedPurity] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Lock body scroll and handle Escape key for mobile filter drawer
  useEffect(() => {
    if (!mobileFilterOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileFilterOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileFilterOpen]);

  // Sync state if URL search parameters change
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category')!);
    } else {
      setSelectedCategory('All Jewellery');
    }
    if (searchParams.get('search') !== null) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const nextParams = new URLSearchParams(searchParams);
    if (cat === 'All Jewellery' || cat === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', cat);
    }
    setSearchParams(nextParams);
  };

  const mainCategoriesList = [
    'All Jewellery',
    'Gold',
    'Diamonds',
    'Wedding',
    'Daily Wear',
    'Earrings',
    'Under ₹50K',
  ];

  const silhouetteCategories: Category[] = [
    'Rings',
    'Necklaces',
    'Earrings',
    'Bracelets',
    'Bangles',
    'Pendants',
    'Mangalsutras',
    'Bridal Jewellery',
  ];

  const purities = ['All', '24K', '22K', '18K', '14K'];

  const styles = [
    'All',
    'Solitaire Classic',
    'Royal Gala Choker',
    'Heritage Antique',
    'Modern Tennis Flow',
    'Temple Nakshi Craft',
    'Modern Minimalist',
    'Contemporary Nuptial',
  ];

  const filteredProducts = useMemo(() => {
    return productService.filterProducts({
      category: selectedCategory,
      searchQuery,
      purity: selectedPurity,
      style: selectedStyle,
      maxPrice,
      sortBy: sortBy === 'featured' ? undefined : (sortBy as any),
    });
  }, [products, selectedCategory, searchQuery, selectedPurity, selectedStyle, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All Jewellery');
    setSearchQuery('');
    setSelectedPurity('All');
    setSelectedStyle('All');
    setMaxPrice(1000000);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters = 
    (selectedCategory !== 'All' && selectedCategory !== 'All Jewellery') || 
    searchQuery !== '' || 
    selectedPurity !== 'All' || 
    selectedStyle !== 'All' || 
    maxPrice < 1000000;

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'Gold':
        return 'Pure 22K and 24K solid hallmarked gold heirlooms, Kasu Malas, temple Nakshi, and broad kadas.';
      case 'Diamonds':
        return 'Natural conflict-free solitaires, brilliant-cut diamond necklaces, tennis bracelets, and certified diamond rings.';
      case 'Wedding':
        return 'Opulent heavy royal bridal trousseau sets, grand temple Nakshi waistbands, and heavy 22K heirloom haars.';
      case 'Daily Wear':
        return 'Featherlight, modern minimalist jewellery crafted for comfortable everyday luxury and workwear.';
      case 'Earrings':
        return 'Handcrafted royal Deccan chandbalis, delicate floral studs, heavy bridal jhumkas, and diamond drops.';
      case 'Under ₹50K':
        return 'Accessible fine luxury — certified gold and natural diamond creations priced under ₹50,000.';
      default:
        return 'Certified 22K/24K hallmarked gold creations, natural conflict-free solitaires, and royal bridal heirlooms.';
    }
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A]">
      
      {/* ======================================================== */}
      {/* 1. MAIN CATEGORY NAVIGATION STRIP (Directly below header) */}
      {/* ======================================================== */}
      <MainCategoryNav
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => handleSelectCategory(cat)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Breadcrumb Navigation matching reference layout */}
        <nav className="text-xs text-gray-500 mb-3 text-left flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <Link 
            to="/shop" 
            onClick={() => handleSelectCategory('All Jewellery')} 
            className={`hover:text-white transition-colors ${selectedCategory === 'All' || selectedCategory === 'All Jewellery' ? 'text-[#D8B47A]' : ''}`}
          >
            Shop
          </Link>
          {selectedCategory !== 'All' && selectedCategory !== 'All Jewellery' && (
            <>
              <span className="text-gray-700">/</span>
              <span className="text-[#D8B47A] font-medium">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Category Heading & Dynamic Result Count */}
        <div className="mb-7 text-left">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-white flex items-baseline gap-3 flex-wrap">
              <span>{selectedCategory === 'All' ? 'All Jewellery' : selectedCategory}</span>
              <span className="text-sm sm:text-base font-sans font-light text-gray-400">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'})
              </span>
            </h1>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#D8B47A] hover:underline flex items-center gap-1 font-medium self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#BFB5A7] mt-1.5 font-light max-w-2xl">
            {getCategoryDescription(selectedCategory)}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, diamond, gold..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18140F] border border-[#2B2319] rounded-xl pl-10 pr-8 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Pills inspired by reference screenshot */}
          <div className="hidden xl:flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap">Quick Filter:</span>
            {[
              { label: 'Under ₹50K', action: () => handleSelectCategory('Under ₹50K'), active: selectedCategory === 'Under ₹50K' },
              { label: '22K Gold', action: () => { setSelectedPurity('22K'); handleSelectCategory('Gold'); }, active: selectedCategory === 'Gold' && selectedPurity === '22K' },
              { label: 'Diamonds', action: () => handleSelectCategory('Diamonds'), active: selectedCategory === 'Diamonds' },
              { label: 'Wedding', action: () => handleSelectCategory('Wedding'), active: selectedCategory === 'Wedding' },
              { label: 'Daily Wear', action: () => handleSelectCategory('Daily Wear'), active: selectedCategory === 'Daily Wear' },
            ].map((pill) => (
              <button
                key={pill.label}
                onClick={pill.action}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                  pill.active
                    ? 'bg-[#D8B47A] text-[#090806] font-semibold shadow-sm'
                    : 'bg-[#18140F] text-gray-400 hover:text-white border border-[#282118] hover:border-[#D8B47A]/40'
                }`}
              >
                <span>+</span>
                <span>{pill.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18140F] border border-[#2B2319] text-xs font-medium text-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D8B47A]" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#18140F] border border-[#2B2319] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D8B47A]"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-gray-300 text-left">
            <span className="text-gray-500 font-medium">Applied Filters:</span>
            
            {selectedCategory !== 'All' && selectedCategory !== 'All Jewellery' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18140F] border border-[#D8B47A]/40 text-[#D8B47A]">
                Category: <strong className="text-white">{selectedCategory}</strong>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white ml-0.5" 
                  onClick={() => handleSelectCategory('All Jewellery')} 
                />
              </span>
            )}

            {selectedPurity !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18140F] border border-[#D8B47A]/40 text-[#D8B47A]">
                Purity: <strong className="text-white">{selectedPurity}</strong>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white ml-0.5" 
                  onClick={() => setSelectedPurity('All')} 
                />
              </span>
            )}

            {selectedStyle !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18140F] border border-[#D8B47A]/40 text-[#D8B47A]">
                Style: <strong className="text-white">{selectedStyle}</strong>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white ml-0.5" 
                  onClick={() => setSelectedStyle('All')} 
                />
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18140F] border border-[#D8B47A]/40 text-[#D8B47A]">
                Keyword: <strong className="text-white">&quot;{searchQuery}&quot;</strong>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white ml-0.5" 
                  onClick={() => setSearchQuery('')} 
                />
              </span>
            )}

            {maxPrice < 1000000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18140F] border border-[#D8B47A]/40 text-[#D8B47A]">
                Under <strong className="text-white">{formatINR(maxPrice)}</strong>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white ml-0.5" 
                  onClick={() => setMaxPrice(1000000)} 
                />
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-[#D8B47A] hover:underline flex items-center gap-1 ml-2 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Clear All Filters
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-[#120F0B] border border-[#241F18] rounded-2xl p-5 text-left h-fit sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#241F18]">
              <span className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Filters
              </span>
              {hasActiveFilters && (
                <button 
                  onClick={resetFilters} 
                  className="text-[11px] text-gray-400 hover:text-white underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Main Categories Section in Sidebar */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-gray-300 mb-2.5">
                Main Categories
              </h4>
              <div className="space-y-1">
                {mainCategoriesList.map((cat) => {
                  const isActive = 
                    (cat === 'All Jewellery' && (selectedCategory === 'All' || selectedCategory === 'All Jewellery')) ||
                    selectedCategory.toLowerCase() === cat.toLowerCase();

                  return (
                    <button
                      key={cat}
                      onClick={() => handleSelectCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex justify-between items-center ${
                        isActive
                          ? 'bg-[#D8B47A]/15 text-[#D8B47A] font-semibold border-l-2 border-[#D8B47A]'
                          : 'text-gray-400 hover:text-white hover:bg-[#18140F]'
                      }`}
                    >
                      <span>{cat}</span>
                      {isActive && <span className="text-[10px] text-[#D8B47A]">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Silhouette Sub-Categories */}
            <div className="pt-4 border-t border-[#241F18]">
              <h4 className="text-xs uppercase font-semibold text-gray-300 mb-2.5">
                By Jewellery Type
              </h4>
              <div className="space-y-1">
                {silhouetteCategories.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();

                  return (
                    <button
                      key={cat}
                      onClick={() => handleSelectCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex justify-between items-center ${
                        isActive
                          ? 'bg-[#D8B47A]/15 text-[#D8B47A] font-semibold border-l-2 border-[#D8B47A]'
                          : 'text-gray-400 hover:text-white hover:bg-[#18140F]'
                      }`}
                    >
                      <span>{cat}</span>
                      {isActive && <span className="text-[10px] text-[#D8B47A]">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metal Purity */}
            <div className="pt-4 border-t border-[#241F18]">
              <h4 className="text-xs uppercase font-semibold text-gray-300 mb-2.5">
                Metal Purity
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {purities.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPurity(p)}
                    className={`py-1.5 text-center text-xs rounded-lg border transition-all ${
                      selectedPurity === p
                        ? 'bg-[#D8B47A] text-[#090806] font-bold border-[#D8B47A]'
                        : 'bg-[#18140F] text-gray-400 border-[#2C2720] hover:border-[#D8B47A]/40 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-4 border-t border-[#241F18]">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="uppercase font-semibold text-gray-300">Budget Limit</span>
                <span className="font-bold text-[#D8B47A]">{formatINR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="25000"
                max="1000000"
                step="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#D8B47A] bg-[#2C2720] rounded h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>₹25K</span>
                <span>₹10.0 Lakh+</span>
              </div>
            </div>

            {/* Jewellery Style */}
            <div className="pt-4 border-t border-[#241F18]">
              <h4 className="text-xs uppercase font-semibold text-gray-300 mb-2.5">
                Jewellery Style
              </h4>
              <div className="space-y-1">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStyle(s)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex justify-between items-center ${
                      selectedStyle === s
                        ? 'bg-[#D8B47A]/15 text-[#D8B47A] font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-[#18140F]'
                    }`}
                  >
                    <span>{s}</span>
                    {selectedStyle === s && <span className="text-[10px]">●</span>}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            
            {/* Header info bar */}
            <div className="flex justify-between items-center mb-5 text-xs text-gray-400 text-left">
              <span>
                Showing <strong className="text-white">{filteredProducts.length}</strong> jewellery pieces
              </span>
              {selectedCategory !== 'All' && (
                <span>
                  Viewing: <strong className="text-[#D8B47A]">{selectedCategory}</strong>
                </span>
              )}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-[#120F0B] border border-[#241F18] rounded-2xl p-8">
                <div className="w-16 h-16 rounded-full bg-[#18140F] border border-[#2C2720] text-[#D8B47A] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-normal text-white mb-2">
                  No {selectedCategory !== 'All' && selectedCategory !== 'All Jewellery' ? selectedCategory : ''} jewellery found
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-6 font-light leading-relaxed">
                  No creations matched your active criteria ({selectedCategory} under {formatINR(maxPrice)}{searchQuery ? ` with search "${searchQuery}"` : ''}).
                  Try adjusting your filters or browse our complete royal catalogue.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View All Jewellery
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setMaxPrice(600000);
                        setSelectedPurity('All');
                        setSelectedStyle('All');
                        setSearchQuery('');
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#18140F] hover:bg-[#201B14] text-white border border-[#2C2720] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Clear Sub-Filters Only
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Product Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onTryOn={(p) => setTryOnProduct(p)}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex justify-end animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileFilterOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-[#120F0B] w-full max-w-xs sm:max-w-sm h-full p-4 sm:p-6 overflow-y-auto overscroll-contain flex flex-col justify-between text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#241F18] mb-6">
                <h3 className="text-xs uppercase font-bold tracking-wider text-white">Filter Jewellery</h3>
                <button 
                  onClick={() => setMobileFilterOpen(false)} 
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main 7 Categories */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-semibold text-[#D8B47A] mb-3">Main Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {mainCategoriesList.map((cat) => {
                    const isActive = 
                      (cat === 'All Jewellery' && (selectedCategory === 'All' || selectedCategory === 'All Jewellery')) ||
                      selectedCategory.toLowerCase() === cat.toLowerCase();

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          handleSelectCategory(cat);
                          setMobileFilterOpen(false);
                        }}
                        className={`p-2 text-xs rounded-lg border text-left truncate transition-colors ${
                          isActive
                            ? 'bg-[#D8B47A] text-[#090806] font-bold border-[#D8B47A]'
                            : 'bg-[#18140F] text-gray-300 border-[#241F18]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Silhouettes */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-semibold text-[#D8B47A] mb-3">By Silhouette</h4>
                <div className="grid grid-cols-2 gap-2">
                  {silhouetteCategories.map((cat) => {
                    const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          handleSelectCategory(cat);
                          setMobileFilterOpen(false);
                        }}
                        className={`p-2 text-xs rounded-lg border text-left truncate transition-colors ${
                          isActive
                            ? 'bg-[#D8B47A] text-[#090806] font-bold border-[#D8B47A]'
                            : 'bg-[#18140F] text-gray-300 border-[#241F18]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Purity */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-semibold text-[#D8B47A] mb-3">Purity</h4>
                <div className="grid grid-cols-3 gap-2">
                  {purities.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPurity(p)}
                      className={`p-2 text-center text-xs rounded-lg border ${
                        selectedPurity === p
                          ? 'bg-[#D8B47A] text-[#090806] font-bold border-[#D8B47A]'
                          : 'bg-[#18140F] text-gray-300 border-[#241F18]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Slider */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-300">Max Budget:</span>
                  <span className="text-[#D8B47A] font-bold">{formatINR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="1000000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-[#D8B47A] bg-[#2C2720] rounded h-1.5"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>₹25K</span>
                  <span>₹10.0 Lakh+</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#241F18] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-full bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider"
              >
                Show Results ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2 text-xs text-gray-400 hover:text-white"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Virtual Try-On Modal */}
      {tryOnProduct && (
        <VirtualTryOnModal
          product={tryOnProduct}
          onClose={() => setTryOnProduct(null)}
        />
      )}

      {/* Product Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onTryOn={(p) => {
            setQuickViewProduct(null);
            setTryOnProduct(p);
          }}
        />
      )}

    </div>
  );
};
