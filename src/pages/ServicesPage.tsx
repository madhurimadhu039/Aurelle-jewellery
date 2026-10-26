import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CreditCard, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  Camera, 
  Calendar,
  ArrowRight
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Jewellery Savings Scheme',
      subtitle: 'Swarna Nidhi 10+1 Month Plan',
      description: 'Accumulate gold weight towards your future jewellery milestone. Contribute for 10 months and Aurelle pays your 11th installment bonus with zero making charges up to 18%.',
      link: '/schemes',
      linkText: 'Explore Schemes',
      icon: Sparkles,
      badge: 'Popular',
    },
    {
      title: 'Pay Due Portal',
      subtitle: 'Instant Online Invoicing & Receipts',
      description: 'Check outstanding jewellery purchase balances, view verified payment history, and settle dues securely with digital bank receipts.',
      link: '/pay-due',
      linkText: 'Check Outstanding Due',
      icon: CreditCard,
    },
    {
      title: 'Customer Ledger Statement',
      subtitle: 'Cryptographic Account Auditing',
      description: 'Complete statement of patron purchases, advance deposits, scheme installments, and running balances with printable PDF export.',
      link: '/ledger',
      linkText: 'View Ledger Statement',
      icon: BookOpen,
    },
    {
      title: 'Aurelle Heirloom Passport™',
      subtitle: 'Digital Authenticity & Guild Provenance',
      description: 'Immutable digital passport for each registered purchase, detailing Hallmark UIDs (HUID), diamond cut/clarity certificates, and annual inspection logs.',
      link: '/passport',
      linkText: 'Access Heirloom Passport',
      icon: ShieldCheck,
    },
    {
      title: 'Add Existing & Old Gold Exchange',
      subtitle: 'Digital Vault Registration & Valuation',
      description: 'Submit existing jewellery purchases or ancestral gold for guild assay appraisal and exchange credit towards new creations.',
      link: '/add-existing',
      linkText: 'Register Existing Piece',
      icon: Layers,
    },
    {
      title: 'Augmented Virtual Try-On Studio',
      subtitle: 'Interactive Style Visualizer',
      description: 'Simulate how Aurelle solitaires, royal necklaces, and chandbali earrings drape on high-fashion portrait and neckline models.',
      link: '/try-on',
      linkText: 'Launch Try-On Studio',
      icon: Camera,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A] py-14 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2 text-gray-700">/</span>
          <span className="text-[#D8B47A]">Services</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D8B47A] font-semibold block mb-2">
            BESPOKE PATRON EXPERIENCES
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
            Aurelle Patron Services
          </h1>
          <p className="text-xs sm:text-sm text-[#BFB5A7] mt-3 max-w-2xl font-light leading-relaxed">
            From flexible jewellery savings schemes and transparent bullion invoicing to digital heirloom passports and old-gold exchange valuations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 flex flex-col justify-between hover:border-[#D8B47A]/50 transition-all duration-300 shadow-md group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    {svc.badge && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#D8B47A] text-[#090806]">
                        {svc.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-luxury text-xl font-normal text-white group-hover:text-[#D8B47A] transition-colors mb-0.5">
                    {svc.title}
                  </h3>
                  <div className="text-[11px] text-[#D8B47A] font-medium mb-3">
                    {svc.subtitle}
                  </div>
                  <p className="text-xs text-[#BFB5A7] leading-relaxed font-light">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#1C1712]">
                  <Link
                    to={svc.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#D8B47A] transition-colors"
                  >
                    <span>{svc.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
