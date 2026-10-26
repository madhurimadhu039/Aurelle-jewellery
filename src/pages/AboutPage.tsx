import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Gem, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A] py-14 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2 text-gray-700">/</span>
          <span className="text-[#D8B47A]">About Us</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D8B47A] font-semibold block mb-2">
            THE AURELLE LEGACY
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
            Timeless Elegance. Crafted for You.
          </h1>
          <p className="text-xs sm:text-sm text-[#BFB5A7] mt-3 max-w-2xl font-light leading-relaxed">
            Founded with a passion for preserving imperial Indian goldsmithing and pairing it with contemporary haute joaillerie design, Aurelle Jewellery stands as a hallmark of trust, purity, and enduring artistry.
          </p>
        </div>

        {/* Narrative & Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div className="space-y-4 text-xs sm:text-[13px] text-[#C2B7A8] leading-relaxed font-light">
            <h2 className="font-serif-luxury text-2xl font-normal text-white">
              Centuries of Guild Artistry
            </h2>
            <p>
              Every Aurelle piece begins in the sketchbooks of our master designers before taking physical form in our boutique ateliers. We work exclusively with certified 18K and 22K hallmarked sovereign gold, each stamped with the Indian Bureau of Standards (BIS) Hallmark Unique Identification (HUID).
            </p>
            <p>
              Our diamonds are ethically sourced, conflict-free, and graded by the International Gemological Institute (IGI). From intricate Nakshi temple filigree to flawless solitaire engagement bands, every creation is an heirloom designed to transcend generations.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#2B2319] bg-black">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
              alt="Artisan at work"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-[11px] text-[#D1C7BA] font-light italic">
              Aurelle Master Goldsmith hand-setting certified uncut Polki and Zambian emeralds.
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          <div className="bg-[#120F0B] border border-[#241F18] rounded-xl p-5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/30 flex items-center justify-center text-[#D8B47A] mb-3">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-xs font-semibold uppercase text-white mb-1">100% BIS Hallmarked</h3>
            <p className="text-[11px] text-[#A69C8E] font-light leading-relaxed">
              Every gram of gold carries certified laser-engraved HUID purity guarantees.
            </p>
          </div>

          <div className="bg-[#120F0B] border border-[#241F18] rounded-xl p-5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/30 flex items-center justify-center text-[#D8B47A] mb-3">
              <Gem className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-xs font-semibold uppercase text-white mb-1">IGI Solitaires</h3>
            <p className="text-[11px] text-[#A69C8E] font-light leading-relaxed">
              Conflict-free, ethically excavated natural diamonds of rare color and clarity.
            </p>
          </div>

          <div className="bg-[#120F0B] border border-[#241F18] rounded-xl p-5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/30 flex items-center justify-center text-[#D8B47A] mb-3">
              <Award className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-xs font-semibold uppercase text-white mb-1">Lifetime Buyback</h3>
            <p className="text-[11px] text-[#A69C8E] font-light leading-relaxed">
              Transparent exchange and upgrade valuations based on prevailing benchmark rates.
            </p>
          </div>

          <div className="bg-[#120F0B] border border-[#241F18] rounded-xl p-5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/30 flex items-center justify-center text-[#D8B47A] mb-3">
              <Sparkles className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-xs font-semibold uppercase text-white mb-1">Complimentary Care</h3>
            <p className="text-[11px] text-[#A69C8E] font-light leading-relaxed">
              Free annual ultrasonic cleaning and prong tension inspections for all patrons.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl bg-[#110E0B] border border-[#2B2319]">
          <h2 className="font-serif-luxury text-2xl font-normal text-white mb-2">
            Experience the Aurelle World
          </h2>
          <p className="text-xs text-[#A69C8E] mb-6 font-light max-w-md mx-auto">
            Discover our complete product catalogue or schedule a private consultation at our flagship boutique.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Explore Shop
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full bg-[#18140F] hover:bg-[#241F18] text-white border border-[#2C2720] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Contact Boutique
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
