import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Camera, 
  Scale, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { GoldRateBanner } from '../components/GoldRateBanner';
import { DailyGoldRatePanel } from '../components/DailyGoldRatePanel';
import { VirtualTryOnModal } from '../components/VirtualTryOnModal';
import { MainCategoryNav, MainCategoryKey } from '../components/MainCategoryNav';
import { useApp } from '../contexts/AppContext';
import { productService } from '../services/productService';
import { payDueService } from '../services/payDueService';
import { Product, PayDueRecord } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleWishlist, isInWishlist, formatINR, products, user, isAdmin } = useApp();

  const urlCategory = searchParams.get('category') || 'All Jewellery';
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);

  // Sync state if URL search parameters change
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category')!);
    }
  }, [searchParams]);

  const handleCategorySelect = (cat: MainCategoryKey) => {
    if (cat === 'All Jewellery') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(cat)}`);
    }
  };

  const displayedProducts = useMemo(() => {
    return productService.filterProducts({ category: selectedCategory });
  }, [products, selectedCategory]);

  const [heroSlide, setHeroSlide] = useState(0);
  const [payDueQuery, setPayDueQuery] = useState('');
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [collectionScrollIndex, setCollectionScrollIndex] = useState(0);

  // Pay Due & Verified Record Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusRecord, setStatusRecord] = useState<PayDueRecord | undefined>(undefined);
  const [statusQuery, setStatusQuery] = useState('');
  const [statusSearched, setStatusSearched] = useState(false);
  const [isVerifiedRecordView, setIsVerifiedRecordView] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Close status modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && statusModalOpen && !isVerifying) {
        setStatusModalOpen(false);
      }
    };
    if (statusModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [statusModalOpen, isVerifying]);

  // Hero slides data
  const heroSlides = [
    {
      id: 0,
      eyebrow: 'TIMELESS BEAUTY',
      titleLine1: 'More Than',
      titleLine2: 'Just Jewellery',
      description: 'Exquisite craftsmanship. Enduring elegance. Aurelle, for every precious moment.',
      cta: 'EXPLORE COLLECTION',
      link: '/shop',
      image: '/images/hero-model.jpg',
    },
    {
      id: 1,
      eyebrow: 'IMPERIAL SOLITAIRES',
      titleLine1: 'Pure Brilliance,',
      titleLine2: 'Enduring Love',
      description: 'Handcrafted solitaire rings cut to perfection with certified IGI and BIS hallmarking.',
      cta: 'EXPLORE SOLITAIRES',
      link: '/shop?category=Rings',
      image: '/images/hero-slide-2.jpg',
    },
    {
      id: 2,
      eyebrow: 'ROYAL HERITAGE',
      titleLine1: 'Heirlooms Crafted',
      titleLine2: 'For Eternity',
      description: 'Centuries of royal temple craftsmanship and bridal ensembles for your most sacred day.',
      cta: 'EXPLORE BRIDAL',
      link: '/shop?category=Bridal%20Jewellery',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1600&q=85',
    },
  ];

  // Auto advance hero carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Helper to scroll collections carousel via left/right arrows
  const scrollCollections = (direction: 'left' | 'right') => {
    const el = document.getElementById('collections-carousel');
    if (!el) return;
    const scrollAmount = Math.max(260, el.clientWidth * 0.75);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCollectionScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll <= 0) return;
    const progress = target.scrollLeft / maxScroll;
    if (progress < 0.33) setCollectionScrollIndex(0);
    else if (progress < 0.66) setCollectionScrollIndex(1);
    else setCollectionScrollIndex(2);
  };

  // Our Collections Section (10 curated luxury categories matching reference and expanding catalog)
  const collections = [
    {
      name: 'Rings',
      link: '/shop?category=Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Necklaces',
      link: '/shop?category=Necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Earrings',
      link: '/shop?category=Earrings',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bracelets',
      link: '/shop?category=Bracelets',
      image: 'https://images.unsplash.com/photo-1611591475155-c2a92f8809e2?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bangles',
      link: '/shop?category=Bangles',
      image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Pendants',
      link: '/shop?category=Pendants',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Mangalsutras',
      link: '/shop?category=Mangalsutras',
      image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bridal Jewellery',
      link: '/shop?category=Bridal+Jewellery',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Solitaires',
      link: '/shop?category=Rings',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Gold Coins & Bullion',
      link: '/shop?purity=24K',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handlePayDueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = payDueQuery.trim();
    setStatusQuery(query);
    setStatusSearched(true);
    setIsVerifiedRecordView(false);
    const found = payDueService.findByQuery(query);
    setStatusRecord(found);
    setStatusModalOpen(true);
  };

  const handleOpenVerifiedRecord = async () => {
    if (isVerifying || !statusRecord) return;
    setIsVerifying(true);
    try {
      const result = await payDueService.verifyRecord(
        statusQuery || statusRecord.billNumber, 
        undefined, 
        user, 
        isAdmin
      );
      if (result.success && result.record && result.verified) {
        setStatusRecord(result.record);
        setIsVerifiedRecordView(true);
      } else {
        setStatusModalOpen(false);
        navigate(`/pay-due?search=${encodeURIComponent(statusRecord.billNumber)}`);
      }
    } catch {
      setStatusModalOpen(false);
      navigate(`/pay-due?search=${encodeURIComponent(statusRecord.billNumber)}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const currentHero = heroSlides[heroSlide];

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A]">
      
      {/* ======================================================== */}
      {/* 0. MAIN JEWELLERY CATEGORIES NAVIGATION (Directly below main header) */}
      {/* ======================================================== */}
      <MainCategoryNav
        activeCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* ======================================================== */}
      {/* 1. HERO SECTION — EXACT REFERENCE MATCH */}
      {/* ======================================================== */}
      <section className="relative w-full bg-[#090806] overflow-hidden min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex items-center">
        
        {/* Left Arrow */}
        <button
          onClick={() => setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-2 sm:left-4 z-20 text-[#A69C8E] hover:text-white p-2 transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[1.2]" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-2 sm:right-4 z-20 text-[#A69C8E] hover:text-white p-2 transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[1.2]" />
        </button>

        {/* Main Hero Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (5-6 cols) */}
            <div className="lg:col-span-5 text-left z-10 space-y-4 sm:space-y-6">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#D8B47A] font-medium block">
                {currentHero.eyebrow}
              </span>

              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-[58px] font-normal leading-[1.08] text-[#F7F1E7] tracking-tight">
                <span className="block">{currentHero.titleLine1}</span>
                <span className="block">{currentHero.titleLine2}</span>
              </h1>

              <p className="text-xs sm:text-[13px] text-[#C2B7A8] leading-relaxed font-light max-w-md">
                {currentHero.description}
              </p>

              <div className="pt-2">
                <Link
                  to={currentHero.link}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span>{currentHero.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                </Link>
              </div>
            </div>

            {/* Right Photography (7 cols) */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden">
                <img
                  src={currentHero.image}
                  alt="Aurelle High Jewellery Model"
                  className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out"
                />
                {/* Seamless luxury edge blending overlays */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#090806] to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#090806] to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#090806] to-transparent pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === heroSlide ? 'w-2 h-2 bg-[#D8B47A]' : 'w-1.5 h-1.5 bg-[#423C32] hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. DAILY GOLD AND SILVER RATES PANEL (KHAZANA-STYLE PROMINENT DISPLAY) */}
      {/* ======================================================== */}
      <DailyGoldRatePanel />

      {/* ======================================================== */}
      {/* 3. OUR COLLECTIONS SECTION — WARM IVORY BACKGROUND */}
      {/* ======================================================== */}
      <section className="bg-[#FAF7F2] text-[#090806] py-14 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex items-end justify-between mb-8 text-left">
            <div>
              <h2 className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.2em] text-[#090806] block">
                OUR COLLECTIONS
              </h2>
              <p className="text-xs sm:text-[13px] text-[#6B6357] font-light mt-0.5">
                Discover jewellery for every emotion
              </p>
            </div>
            <Link
              to="/shop"
              className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#090806] hover:text-[#9E7A3E] flex items-center gap-1.5 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Collections Carousel with Functional Side Arrows */}
          <div className="relative group/collections">
            {/* Left Carousel Arrow */}
            <button
              onClick={() => scrollCollections('left')}
              className="flex absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] text-[#090806] hover:text-[#9E7A3E] items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-[#E7DFD5] cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Right Carousel Arrow */}
            <button
              onClick={() => scrollCollections('right')}
              className="flex absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] text-[#090806] hover:text-[#9E7A3E] items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-[#E7DFD5] cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Scrollable Container (5 visible on desktop, horizontal scrolling to reveal more) */}
            <div
              id="collections-carousel"
              onScroll={handleCollectionScroll}
              className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
            >
              {collections.map((col) => (
                <Link
                  key={col.name}
                  to={col.link}
                  className="flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(20%-13px)] snap-start group relative rounded-lg overflow-hidden aspect-[3/4] bg-[#110E0B] shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  {/* Photo with subtle dark tone */}
                  <img
                    src={col.image}
                    alt={col.name}
                    loading="lazy"
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-108"
                  />
                  {/* Subtle dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Card Label Bottom-Left */}
                  <div className="absolute inset-x-3 bottom-3 text-left">
                    <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-white group-hover:text-[#D8B47A] transition-colors leading-tight">
                      {col.name}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] text-[#D1C7BA] group-hover:text-white flex items-center gap-1 font-light mt-0.5">
                      Explore Collection <span className="text-xs">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Interactive Pagination Indicators below */}
            <div className="flex justify-center items-center gap-2 mt-5">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const el = document.getElementById('collections-carousel');
                    if (!el) return;
                    const maxScroll = el.scrollWidth - el.clientWidth;
                    el.scrollTo({
                      left: (maxScroll / 2) * idx,
                      behavior: 'smooth',
                    });
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    collectionScrollIndex === idx
                      ? 'w-6 bg-[#9E7A3E]'
                      : 'w-1.5 bg-[#D1C7BA] hover:bg-[#A89E90]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. PREMIUM FEATURE STRIP — EXACT REFERENCE MATCH */}
      {/* ======================================================== */}
      <section className="bg-[#090806] border-y border-[#1C1712] py-5 sm:py-6 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-2 items-center">
            
            {/* 1. Virtual Try-On */}
            <Link
              to="/try-on"
              className="flex items-center gap-2.5 sm:gap-3 group hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] flex-shrink-0 group-hover:border-[#D8B47A]">
                <Camera className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-medium text-white group-hover:text-[#D8B47A] leading-tight">
                  Virtual Try-On
                </h4>
                <p className="text-[10px] text-[#8C8375] font-light">Try before you buy</p>
              </div>
            </Link>

            {/* 2. Wishlist */}
            <Link
              to="/wishlist"
              className="flex items-center gap-2.5 sm:gap-3 group hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] flex-shrink-0 group-hover:border-[#D8B47A]">
                <Heart className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-medium text-white group-hover:text-[#D8B47A] leading-tight">
                  Wishlist
                </h4>
                <p className="text-[10px] text-[#8C8375] font-light">Save your favourites</p>
              </div>
            </Link>

            {/* 3. Compare */}
            <Link
              to="/compare"
              className="flex items-center gap-2.5 sm:gap-3 group hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] flex-shrink-0 group-hover:border-[#D8B47A]">
                <Scale className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-medium text-white group-hover:text-[#D8B47A] leading-tight">
                  Compare
                </h4>
                <p className="text-[10px] text-[#8C8375] font-light">Find your perfect match</p>
              </div>
            </Link>

            {/* 4. Gold Purity & Certification */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 rounded-full border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] flex-shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-medium text-white leading-tight">
                  Gold Purity &amp; Certification
                </h4>
                <p className="text-[10px] text-[#8C8375] font-light">100% authentic</p>
              </div>
            </div>

            {/* 5. Book a Consultation */}
            <Link
              to="/schemes"
              className="col-span-2 md:col-span-1 flex items-center gap-2.5 sm:gap-3 group hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] flex-shrink-0 group-hover:border-[#D8B47A]">
                <Calendar className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-medium text-white group-hover:text-[#D8B47A] leading-tight">
                  Book a Consultation
                </h4>
                <p className="text-[10px] text-[#8C8375] font-light">Personalised service</p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. LUXURY EDITORIAL BANNER — "THE AURELLE EXPERIENCE" */}
      {/* ======================================================== */}
      <section className="relative w-full bg-[#090806] overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center text-left">
        {/* Full width background image with luxury fine jewellery atelier backdrop */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85"
            alt="Solitaire Diamond Fine Jewellery Atelier"
            className="w-full h-full object-cover object-right md:object-center transform scale-102"
          />
          {/* Dark gradient from left so text is legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090806] via-[#090806]/80 md:via-[#090806]/60 to-transparent" />
        </div>

        {/* Content on left */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-16 sm:py-20">
          <div className="max-w-lg space-y-4">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D8B47A] font-medium block">
              THE AURELLE EXPERIENCE
            </span>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[46px] font-normal text-white leading-tight">
              Luxury Redefined
            </h2>

            <p className="text-xs sm:text-[13px] text-[#D1C7BA] leading-relaxed font-light max-w-md">
              From timeless classics to contemporary designs, explore jewellery that celebrates your unique story.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] transition-all shadow-md"
              >
                <span>EXPLORE NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. MAIN SHOPPING / FEATURED PRODUCTS SECTION — WARM IVORY BACKGROUND */}
      {/* ======================================================== */}
      <section id="shopping-products-section" className="bg-[#FAF7F2] text-[#090806] py-14 sm:py-16 text-left scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#9E7A3E] font-bold mb-1">
                CURATED SHOPPING
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#090806] flex items-baseline gap-2.5 flex-wrap">
                <span>{selectedCategory === 'All' ? 'All Jewellery' : selectedCategory}</span>
                <span className="text-xs sm:text-sm font-sans font-normal text-[#6B6357]">
                  ({displayedProducts.length} {displayedProducts.length === 1 ? 'creation' : 'creations'})
                </span>
              </h2>
              <p className="text-xs sm:text-[13px] text-[#6B6357] font-light mt-0.5">
                Certified 22K/24K hallmarked gold &amp; natural conflict-free solitaires
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedCategory !== 'All Jewellery' && selectedCategory !== 'All' && (
                <button
                  onClick={() => handleCategorySelect('All Jewellery')}
                  className="text-xs text-[#9E7A3E] hover:underline font-medium cursor-pointer"
                >
                  Reset to All Jewellery
                </button>
              )}
              <Link
                to={selectedCategory === 'All Jewellery' || selectedCategory === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(selectedCategory)}`}
                className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#090806] hover:text-[#9E7A3E] flex items-center gap-1.5 transition-colors"
              >
                <span>Explore in Full Shop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Products Carousel or Empty State */}
          {displayedProducts.length === 0 ? (
            <div className="py-14 text-center bg-white rounded-xl p-8 border border-[#E7DFD5]">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#9E7A3E] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-medium text-[#090806] mb-1">
                No matching {selectedCategory} creations found
              </h3>
              <p className="text-xs text-[#6B6357] max-w-sm mx-auto mb-4 font-light">
                We are continuously curating new heirloom creations. Explore our complete royal collection below.
              </p>
              <button
                onClick={() => handleCategorySelect('All Jewellery')}
                className="px-6 py-2 rounded-full bg-[#090806] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7A3E] transition-colors cursor-pointer"
              >
                View All Jewellery
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Left Carousel Arrow */}
              <button
                onClick={() => {
                  const el = document.getElementById('featured-carousel');
                  if (el) {
                    const scrollAmount = Math.max(280, el.clientWidth * 0.75);
                    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                  }
                }}
                className="flex absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] text-[#090806] hover:text-[#9E7A3E] items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-[#E7DFD5] cursor-pointer"
                aria-label="Previous Products"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Right Carousel Arrow */}
              <button
                onClick={() => {
                  const el = document.getElementById('featured-carousel');
                  if (el) {
                    const scrollAmount = Math.max(280, el.clientWidth * 0.75);
                    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                  }
                }}
                className="flex absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] text-[#090806] hover:text-[#9E7A3E] items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-[#E7DFD5] cursor-pointer"
                aria-label="Next Products"
              >
                <ChevronRight className="w-5 h-5 stroke-[2]" />
              </button>

              <div
                id="featured-carousel"
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2"
              >
                {displayedProducts.map((prod) => {
                  const wishlisted = isInWishlist(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="flex-none w-[260px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Top Image Container with dark moody jewellery photography */}
                      <div className="relative aspect-square bg-[#0C0A08] overflow-hidden">
                        <Link to={`/product/${prod.id}`} className="block w-full h-full">
                          <img
                            src={prod.images?.[0] || ''}
                            alt={prod.name}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-108"
                          />
                        </Link>

                        {/* Wishlist Heart Icon Top-Right */}
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                            wishlisted
                              ? 'text-rose-500 bg-white/90'
                              : 'text-white/80 hover:text-white bg-black/40 hover:bg-black/60'
                          }`}
                          aria-label="Save to Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                        </button>

                        {/* Bottom-right interactive preview indicator */}
                        <button
                          onClick={() => setTryOnProduct(prod)}
                          className="absolute bottom-2.5 right-2.5 text-[10px] text-white/70 hover:text-white bg-black/50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Virtual Try-On"
                        >
                          Try On
                        </button>
                      </div>

                      {/* Bottom White Info Box */}
                      <div className="p-3.5 text-left">
                        <Link to={`/product/${prod.id}`} className="block">
                          <h4 className="font-serif-luxury text-[14px] sm:text-[15px] font-medium text-[#090806] group-hover:text-[#9E7A3E] transition-colors truncate">
                            {prod.name}
                          </h4>
                        </Link>
                        <div className="text-[12px] sm:text-[13px] font-bold text-[#24170F] mt-1 tracking-wide">
                          {formatINR(prod.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. JEWELLERY SCHEME AND PAY DUE — EXACT REFERENCE MATCH */}
      {/* ======================================================== */}
      <section className="bg-[#090806] py-14 sm:py-16 border-t border-[#1C1712] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Card: Join Our Jewellery Scheme (7 cols) */}
            <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-[#110E0B] border border-[#241F18] flex items-center min-h-[260px] sm:min-h-[290px]">
              {/* Woman wearing jewellery on the left */}
              <div className="absolute inset-y-0 left-0 w-2/5 sm:w-1/2">
                <img
                  src="/images/scheme-model.jpg"
                  alt="Jewellery Scheme Model"
                  className="w-full h-full object-cover object-top"
                />
                {/* Fade into dark right */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#110E0B]/70 to-[#110E0B]" />
              </div>

              {/* Text content aligned on right */}
              <div className="relative ml-auto w-3/5 sm:w-1/2 p-6 sm:p-8 space-y-3 z-10">
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-medium text-white leading-tight">
                  Join Our Jewellery Scheme
                </h3>
                <p className="text-xs sm:text-[12px] text-[#BFB5A7] leading-relaxed font-light">
                  Turn your dreams into realities with our exclusive jewellery scheme.
                </p>
                <div className="pt-2">
                  <Link
                    to="/schemes"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-[11px] font-semibold uppercase tracking-[0.1em] transition-all shadow-sm"
                  >
                    <span>KNOW MORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Card: Pay Due (5 cols) */}
            <div className="lg:col-span-5 rounded-xl bg-[#090806] border border-[#2A231A] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-medium text-white">
                  Pay Due
                </h3>
                <p className="text-xs text-[#8C8375] font-light">
                  Check your payment status
                </p>

                {/* Search / Status Form */}
                <form onSubmit={handlePayDueSubmit} className="pt-4 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your order ID / Mobile No."
                      value={payDueQuery}
                      onChange={(e) => setPayDueQuery(e.target.value)}
                      className="w-full bg-transparent border border-[#332A20] rounded-md px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-[11px] font-semibold uppercase tracking-[0.1em] transition-all"
                    >
                      Check Status →
                    </button>
                  </div>
                </form>
              </div>

              {/* Gold line-art receipt illustration matching reference on the bottom right */}
              <div className="absolute right-4 bottom-4 text-[#D8B47A]/40 pointer-events-none">
                <svg className="w-16 h-20" viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="10" y="8" width="44" height="64" rx="4" />
                  <line x1="18" y1="20" x2="46" y2="20" />
                  <line x1="18" y1="30" x2="38" y2="30" />
                  <line x1="18" y1="40" x2="42" y2="40" />
                  <line x1="18" y1="50" x2="32" y2="50" />
                  <circle cx="44" cy="54" r="5" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Virtual Try-On Modal */}
      {tryOnProduct && (
        <VirtualTryOnModal
          product={tryOnProduct}
          onClose={() => setTryOnProduct(null)}
        />
      )}

      {/* ======================================================== */}
      {/* Check Status & Verified Record Modal */}
      {/* ======================================================== */}
      {statusModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity"
          onClick={() => {
            if (!isVerifying) setStatusModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-modal-title"
        >
          <div
            className="relative bg-[#110E0B] border border-[#D8B47A]/40 rounded-2xl max-w-xl w-full p-6 sm:p-7 text-left shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top-Right Close Button with proper multiplication sign × */}
            <button
              type="button"
              id="close-status-modal-btn"
              onClick={() => {
                if (!isVerifying) setStatusModalOpen(false);
              }}
              disabled={isVerifying}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1A1510] hover:bg-[#251E17] text-[#D8B47A] hover:text-white border border-[#D8B47A]/30 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed z-20 group focus:outline-none focus:ring-2 focus:ring-[#D8B47A]/50"
              aria-label="Close popup"
              title="Close (Esc)"
            >
              <span className="text-2xl font-light leading-none select-none group-hover:scale-110 transition-transform" aria-hidden="true">
                &times;
              </span>
            </button>

            {/* Modal Header */}
            <div className="pr-10 mb-5 border-b border-[#241F18] pb-4">
              <div className="flex items-center gap-2 text-[#D8B47A] text-[11px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Aurelle Ledger & Status Verification</span>
              </div>
              <h3 id="status-modal-title" className="font-serif-luxury text-xl sm:text-2xl font-medium text-white">
                {isVerifiedRecordView ? 'Verified Jewellery Record' : 'Payment & Due Status'}
              </h3>
            </div>

            {/* Case 1: No matching record found */}
            {!statusRecord ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-white text-sm">No Record Found</h5>
                    <p className="mt-1 text-gray-300">
                      No matching jewellery order or invoice was found for: <strong className="text-rose-300">&quot;{statusQuery || 'empty'}&quot;</strong>
                    </p>
                    <p className="mt-1 text-gray-400 text-[11px]">
                      Please verify your Order ID (e.g. <code>AUR-INV-2026-8941</code>) or your registered 10-digit mobile number.
                    </p>
                  </div>
                </div>

                {/* Inline Re-search Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = payDueQuery.trim();
                    setStatusQuery(q);
                    setStatusSearched(true);
                    setIsVerifiedRecordView(false);
                    setStatusRecord(payDueService.findByQuery(q));
                  }}
                  className="space-y-2 pt-2"
                >
                  <label className="text-xs text-gray-400 block">Search with another Order ID or Mobile Number:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. AUR-INV-2026-8941"
                      value={payDueQuery}
                      onChange={(e) => setPayDueQuery(e.target.value)}
                      className="flex-1 bg-[#18140F] border border-[#2B2319] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Quick Sample Lookups */}
                <div className="pt-2 border-t border-[#241F18]">
                  <span className="text-[11px] text-gray-400 block mb-2">Or test with demo order records:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPayDueQuery('AUR-INV-2026-8941');
                        setStatusQuery('AUR-INV-2026-8941');
                        setStatusSearched(true);
                        setIsVerifiedRecordView(false);
                        setStatusRecord(payDueService.findByQuery('AUR-INV-2026-8941'));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#18140F] border border-[#2B2319] hover:border-[#D8B47A] text-[11px] text-[#D8B47A]"
                    >
                      AUR-INV-2026-8941 (Partially Paid)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPayDueQuery('AUR-INV-2026-9023');
                        setStatusQuery('AUR-INV-2026-9023');
                        setStatusSearched(true);
                        setIsVerifiedRecordView(false);
                        setStatusRecord(payDueService.findByQuery('AUR-INV-2026-9023'));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#18140F] border border-[#2B2319] hover:border-[#D8B47A] text-[11px] text-gray-300"
                    >
                      AUR-INV-2026-9023 (Pending / Unverified)
                    </button>
                  </div>
                </div>
              </div>
            ) : !isVerifiedRecordView ? (
              /* Case 2: Matching record found — Standard Status View */
              <div className="space-y-4">
                {/* Status Badge & Bill ID */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-[#18140F] border border-[#2B2319]">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Invoice Reference</span>
                    <span className="font-mono font-bold text-white text-sm">{statusRecord.billNumber}</span>
                  </div>
                  <div>
                    {statusRecord.status === 'PAID' && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40">
                        Fully Settled (Paid)
                      </span>
                    )}
                    {statusRecord.status === 'PARTIALLY_PAID' && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40">
                        Partially Paid
                      </span>
                    )}
                    {statusRecord.status === 'PENDING' && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        Pending Payment
                      </span>
                    )}
                    {statusRecord.status === 'OVERDUE' && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/40">
                        Payment Overdue
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer and Order Summary */}
                <div className="space-y-1 text-xs">
                  <div className="text-gray-400">
                    Customer: <strong className="text-white">{statusRecord.customerName}</strong> ({statusRecord.customerPhone})
                  </div>
                  <div className="text-gray-400">
                    Jewellery: <strong className="text-white">{statusRecord.orderSummary}</strong>
                  </div>
                </div>

                {/* Amounts Breakdown */}
                <div className="grid grid-cols-3 gap-2.5 py-2">
                  <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                    <span className="text-[10px] text-gray-400 block uppercase">Total Invoice</span>
                    <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block">{formatINR(statusRecord.totalAmount)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                    <span className="text-[10px] text-gray-400 block uppercase">Paid to Date</span>
                    <span className="font-bold text-[#34D399] text-xs sm:text-sm mt-0.5 block">{formatINR(statusRecord.amountPaid)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                    <span className="text-[10px] text-gray-400 block uppercase">Balance Due</span>
                    <span className="font-extrabold text-[#D8B47A] text-xs sm:text-sm mt-0.5 block">{formatINR(statusRecord.balanceDue)}</span>
                  </div>
                </div>

                {/* Actions: Verified Record button & Pay Due link */}
                <div className="pt-3 border-t border-[#241F18] flex flex-col sm:flex-row gap-3">
                  {/* The Verified Record Button */}
                  <button
                    type="button"
                    id="verify-record-btn"
                    data-testid="verify-record-btn"
                    onClick={handleOpenVerifiedRecord}
                    disabled={isVerifying}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#18140F] hover:bg-[#251E17] border border-[#D8B47A] text-[#D8B47A] hover:text-[#EBD5A8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#D8B47A] border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#D8B47A]" />
                        <span>Verify Record</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusModalOpen(false);
                      navigate(`/pay-due?search=${encodeURIComponent(statusRecord.billNumber)}`);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>Open in Pay Due Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Case 3: Verified Record Detailed View */
              <div className="space-y-4">
                {/* Official Verification Audit Seal Banner */}
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                    statusRecord.status === 'PAID'
                      ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#34D399]'
                      : statusRecord.status === 'PARTIALLY_PAID'
                      ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#FBBF24]'
                      : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm tracking-wide text-white">
                      {statusRecord.status === 'PAID'
                        ? 'VERIFIED & RECONCILED RECORD (100% SETTLED)'
                        : statusRecord.status === 'PARTIALLY_PAID'
                        ? 'PARTIALLY VERIFIED RECORD (RECONCILED PAYMENTS)'
                        : 'UNVERIFIED RECORD / PAYMENT PENDING'}
                    </h5>
                    <p className="mt-1 text-xs opacity-90">
                      {statusRecord.status === 'PAID'
                        ? `All payments totalling ${formatINR(statusRecord.totalAmount)} are 100% verified and reconciled with the Aurelle Guild Ledger.`
                        : statusRecord.status === 'PARTIALLY_PAID'
                        ? `Verified payments of ${formatINR(statusRecord.amountPaid)} recorded with bank confirmation. An outstanding balance of ${formatINR(statusRecord.balanceDue)} remains unverified and due by ${statusRecord.dueDate}.`
                        : `This order is recorded in the boutique database, but zero payments have been verified. An initial deposit or full settlement is required to verify the piece.`}
                    </p>
                  </div>
                </div>

                {/* Verified Metadata Grid */}
                <div className="bg-[#18140F] border border-[#241F18] rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-[#241F18]">
                    <span className="text-gray-400">Customer Name</span>
                    <strong className="text-white">{statusRecord.customerName}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#241F18]">
                    <span className="text-gray-400">Order Reference</span>
                    <span className="font-mono text-[#D8B47A]">{statusRecord.billNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#241F18]">
                    <span className="text-gray-400">Jewellery Item</span>
                    <span className="text-white text-right max-w-xs">{statusRecord.orderSummary}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#241F18]">
                    <span className="text-gray-400">Total Invoice</span>
                    <span className="text-white font-semibold">{formatINR(statusRecord.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#241F18]">
                    <span className="text-gray-400">Verified Paid Amount</span>
                    <span className="text-[#34D399] font-bold">{formatINR(statusRecord.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400">Outstanding Balance</span>
                    <span className="text-[#D8B47A] font-extrabold">{formatINR(statusRecord.balanceDue)}</span>
                  </div>
                </div>

                {/* Verified Receipts History */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1.5 text-[11px]">
                      <Receipt className="w-3.5 h-3.5 text-[#D8B47A]" />
                      <span>Verified Payment Receipts ({statusRecord.paymentsHistory.length})</span>
                    </span>
                    <span className="text-[10px] text-gray-500">AES-256 Vault Verified</span>
                  </div>

                  {statusRecord.paymentsHistory.length === 0 ? (
                    <div className="p-3 rounded-lg bg-[#18140F] border border-[#241F18] text-center text-xs text-gray-500">
                      No payment receipts have been verified or recorded yet for this invoice.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {statusRecord.paymentsHistory.map((receipt) => (
                        <div
                          key={receipt.id}
                          className="p-2.5 rounded-lg bg-[#18140F] border border-[#241F18] flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-white text-[11px]">{receipt.receiptNumber}</span>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {receipt.date} • {receipt.paymentMode}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#34D399]">{formatINR(receipt.amount)}</span>
                            <span className="text-[9px] block text-[#10B981] font-semibold">VERIFIED</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#241F18] flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsVerifiedRecordView(false)}
                    className="py-2.5 px-4 rounded-xl bg-[#18140F] hover:bg-[#251E17] border border-[#2B2319] text-gray-300 text-xs font-semibold"
                  >
                    ← Back to Summary
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusModalOpen(false);
                      navigate(`/pay-due?search=${encodeURIComponent(statusRecord.billNumber)}`);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all"
                  >
                    <span>{statusRecord.balanceDue > 0 ? `Pay Balance (${formatINR(statusRecord.balanceDue)})` : 'Open in Pay Due Portal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
