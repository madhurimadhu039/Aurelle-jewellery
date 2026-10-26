import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Camera, 
  Scale, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GoldRateBanner } from '../components/GoldRateBanner';
import { VirtualTryOnModal } from '../components/VirtualTryOnModal';
import { useApp } from '../contexts/AppContext';
import { productService } from '../services/productService';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, formatINR } = useApp();

  const [heroSlide, setHeroSlide] = useState(0);
  const [payDueQuery, setPayDueQuery] = useState('');
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);

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
      image: '/images/scheme-model.jpg',
    },
  ];

  // Auto advance hero carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Our Collections Section (5 items matching reference)
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
      image: 'https://images.unsplash.com/photo-1611591475155-4284fa2c2e7f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bangles',
      link: '/shop?category=Bangles',
      image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Featured Products matching the 4 reference pieces
  const products = productService.getAll();
  const featured = [
    products.find((p) => p.name.includes('Royal Solitaire')) || products[0],
    products.find((p) => p.name.includes('Eternal Diamond Necklace')) || products[1],
    products.find((p) => p.name.includes('Golden Heritage Earrings')) || products[2],
    products.find((p) => p.name.includes('Graceful')) || products[3],
  ];

  const handlePayDueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payDueQuery.trim()) {
      navigate(`/pay-due?search=${encodeURIComponent(payDueQuery.trim())}`);
    } else {
      navigate('/pay-due');
    }
  };

  const currentHero = heroSlides[heroSlide];

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A]">
      
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
      {/* 2. DAILY GOLD AND SILVER RATES PANEL */}
      {/* ======================================================== */}
      <GoldRateBanner />

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

          {/* 5 Collections Cards Row */}
          <div className="relative">
            {/* Left Carousel Arrow */}
            <button
              onClick={() => {
                const el = document.getElementById('collections-carousel');
                if (el) el.scrollBy({ left: -260, behavior: 'smooth' });
              }}
              className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md text-gray-700 hover:text-black items-center justify-center transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Right Carousel Arrow */}
            <button
              onClick={() => {
                const el = document.getElementById('collections-carousel');
                if (el) el.scrollBy({ left: 260, behavior: 'smooth' });
              }}
              className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md text-gray-700 hover:text-black items-center justify-center transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Scrollable Container (5 visible on desktop) */}
            <div
              id="collections-carousel"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {collections.map((col) => (
                <Link
                  key={col.name}
                  to={col.link}
                  className="group relative rounded-lg overflow-hidden aspect-[3/4] bg-[#110E0B] shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  {/* Photo with subtle dark tone */}
                  <img
                    src={col.image}
                    alt={col.name}
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

            {/* Small Pagination Indicators below */}
            <div className="flex justify-center items-center gap-1.5 mt-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8B47A]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1C7BA]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1C7BA]" />
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
        {/* Full width background image with diamond ring on satin */}
        <div className="absolute inset-0">
          <img
            src="/images/editorial-ring.jpg"
            alt="Solitaire Diamond Ring Editorial"
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
      {/* 6. FEATURED PRODUCTS SECTION — WARM IVORY BACKGROUND */}
      {/* ======================================================== */}
      <section className="bg-[#FAF7F2] text-[#090806] py-14 sm:py-16 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#090806]">
                Featured Products
              </h2>
              <p className="text-xs sm:text-[13px] text-[#6B6357] font-light mt-0.5">
                Exquisite pieces, crafted for you
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

          {/* 4 Products Row */}
          <div className="relative">
            {/* Left Carousel Arrow */}
            <button
              onClick={() => {
                const el = document.getElementById('featured-carousel');
                if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md text-gray-700 hover:text-black items-center justify-center transition-all"
              aria-label="Previous Products"
            >
              <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Right Carousel Arrow */}
            <button
              onClick={() => {
                const el = document.getElementById('featured-carousel');
                if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md text-gray-700 hover:text-black items-center justify-center transition-all"
              aria-label="Next Products"
            >
              <ChevronRight className="w-5 h-5 stroke-[1.5]" />
            </button>

            <div
              id="featured-carousel"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {featured.map((prod) => {
                const wishlisted = isInWishlist(prod.id);
                return (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top Image Container with dark moody jewellery photography */}
                    <div className="relative aspect-square bg-[#0C0A08] overflow-hidden">
                      <Link to={`/product/${prod.id}`} className="block w-full h-full">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
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
                        className="absolute bottom-2.5 right-2.5 text-[10px] text-white/70 hover:text-white bg-black/50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
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

    </div>
  );
};
