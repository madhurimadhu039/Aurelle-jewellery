import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Gem, Award, ShieldCheck } from 'lucide-react';
import { AppointmentModal } from '../components/AppointmentModal';
import { Category } from '../types';

interface CollectionCard {
  title: string;
  categoryParam: string;
  tagline: string;
  description: string;
  itemCount: string;
  image: string;
  highlight: string;
}

export const CollectionsPage: React.FC = () => {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const curatedCollections: CollectionCard[] = [
    {
      title: 'Bridal Jewellery',
      categoryParam: 'Bridal Jewellery',
      tagline: 'Imperial Royal Heirloom Ensembles',
      description: 'Centuries of royal Rajputana & temple artistry crafted in 22K gold, uncut Polki, and Zambian emeralds for your sacred celebrations.',
      itemCount: '18 Signature Sets',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      highlight: 'Bespoke Trousseau',
    },
    {
      title: 'Diamond Solitaire Rings',
      categoryParam: 'Rings',
      tagline: 'Rare Earth Brilliant Solitaires',
      description: 'Handcrafted engagement and anniversary rings set with conflict-free IGI certified solitaires mounted in 18K solid yellow and white gold.',
      itemCount: '34 Masterworks',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      highlight: 'VVS1 / E-F Color',
    },
    {
      title: 'Royal Necklaces & Chokers',
      categoryParam: 'Necklaces',
      tagline: 'Grand Galas & Evening Royalty',
      description: 'Luminous cascades of brilliant-cut diamonds, heritage antique collars, and temple gold masterpieces designed to grace your collarbone.',
      itemCount: '26 Designs',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      highlight: 'Guild Hallmarked',
    },
    {
      title: 'Heritage Chandbalis & Earrings',
      categoryParam: 'Earrings',
      tagline: 'Deccan Filigree & South Sea Pearls',
      description: 'From dramatic ballroom chandeliers to timeless 22K temple jhumkas adorned with natural Burmese rubies and pearls.',
      itemCount: '42 Creations',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
      highlight: '22K Solid Gold',
    },
    {
      title: 'Bangles & Kadas',
      categoryParam: 'Bangles',
      tagline: 'Sovereign 22K Gold Craftsmanship',
      description: 'Nakshi handcrafted broad kadas, floral filigree pairs, and heirloom bangles with precision guild hinge closures.',
      itemCount: '22 Sets',
      image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
      highlight: 'BIS 916 Hallmark',
    },
    {
      title: 'Diamond Tennis Bracelets',
      categoryParam: 'Bracelets',
      tagline: 'Articulated Fluid Luxury',
      description: 'Seamless diamond lines and articulated 18K gold links featuring invisible double-lock security clasps for daily cocktail glamour.',
      itemCount: '16 Designs',
      image: '/images/collections-bracelet.jpg',
      highlight: 'Seamless Articulation',
    },
    {
      title: 'Modern Mangalsutras',
      categoryParam: 'Mangalsutras',
      tagline: 'Contemporary Nuptial Grace',
      description: 'Auspicious traditional black beads seamlessly woven with modern geometric diamond solitaires in 18K yellow gold.',
      itemCount: '14 Designs',
      image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
      highlight: 'Modern Everyday',
    },
    {
      title: 'Celestial Pendants',
      categoryParam: 'Pendants',
      tagline: 'Everyday Minimalist Brilliance',
      description: 'Delicate halo solitaires and symbolic precious stone talismans suspended on luminous 18K Italian gold chains.',
      itemCount: '20 Designs',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      highlight: 'Gift Favourites',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A]">
      {/* Header Banner */}
      <section className="relative py-16 sm:py-20 border-b border-[#1C1712] bg-[#0E0B08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D8B47A] font-semibold mb-2 block">
            HAUTE JOAILLERIE CURATIONS
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
            Curated Jewellery Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#BFB5A7] max-w-xl mx-auto mt-3 font-light leading-relaxed">
            Explore dedicated high-jewellery suites handcrafted by Master Guild artisans. Select any category to view individual hallmarked pieces in our shop.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-[#A69C8E]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D8B47A]" /> 100% BIS Hallmarked
            </span>
            <span className="flex items-center gap-1.5">
              <Gem className="w-4 h-4 text-[#D8B47A]" /> IGI Certified Solitaires
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D8B47A]" /> Lifetime Guild Care
            </span>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 bg-[#090806]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {curatedCollections.map((col) => (
              <Link
                key={col.title}
                to={`/shop?category=${encodeURIComponent(col.categoryParam)}`}
                className="group relative rounded-2xl overflow-hidden bg-[#120F0B] border border-[#241F18] hover:border-[#D8B47A]/60 transition-all duration-500 flex flex-col sm:flex-row shadow-lg hover:shadow-2xl text-left"
              >
                {/* Image half */}
                <div className="relative w-full sm:w-1/2 aspect-square sm:aspect-auto overflow-hidden bg-black flex-shrink-0">
                  <img
                    src={col.image}
                    alt={col.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('collections-bracelet.jpg')) {
                        target.src = '/images/collections-bracelet.jpg';
                      }
                    }}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-black/80 text-[#D8B47A] border border-[#D8B47A]/40 backdrop-blur-sm">
                      {col.highlight}
                    </span>
                  </div>
                </div>

                {/* Content half */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#9E9486] font-medium block">
                      {col.itemCount}
                    </span>
                    <h2 className="font-serif-luxury text-xl sm:text-2xl font-medium text-white group-hover:text-[#D8B47A] transition-colors mt-1 mb-1">
                      {col.title}
                    </h2>
                    <h3 className="text-xs font-semibold text-[#D8B47A] mb-2">
                      {col.tagline}
                    </h3>
                    <p className="text-xs text-[#BFB5A7] leading-relaxed font-light">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#1F1A14] flex items-center justify-between">
                    <span className="text-xs font-semibold text-white group-hover:text-[#D8B47A] flex items-center gap-1.5 transition-colors">
                      Browse Pieces in Shop <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="mt-16 text-center p-8 rounded-2xl bg-[#120F0B] border border-[#241F18] max-w-2xl mx-auto">
            <h3 className="font-serif-luxury text-2xl font-normal text-white mb-2">
              Seeking a Bespoke Commission?
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              Our Master Goldsmiths craft custom bridal trousseaus, personalized solitaire settings, and ancestral gold remounting.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/shop"
                className="px-6 py-2.5 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Shop All Jewellery
              </Link>
              <button
                type="button"
                onClick={() => setAppointmentModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-[#18140F] hover:bg-[#241F18] text-white border border-[#2C2720] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Book Private Salon Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Consultation Modal */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        defaultService="Bridal Suite & High Jewellery"
      />
    </div>
  );
};
