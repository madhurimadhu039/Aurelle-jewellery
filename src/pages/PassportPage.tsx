import React from 'react';
import { ShieldCheck, Award, Calendar, QrCode, Sparkles, CheckCircle2, History } from 'lucide-react';
import { MOCK_HEIRLOOM_PASSPORT } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

export const PassportPage: React.FC = () => {
  const { user } = useApp();
  const passport = MOCK_HEIRLOOM_PASSPORT;

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
            IMMUTABLE PROVENANCE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
            Aurelle Heirloom Passport™
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            Your digital vault certificate guaranteeing lifetime authenticity, bullion purity, and artisan guild inspection history.
          </p>
        </div>

        {/* Passport Certificate Card (Gold-trimmed luxury design) */}
        <div className="bg-gradient-to-b from-[#18130D] via-[#120F0B] to-[#0A0907] border-2 border-[#D8B47A]/60 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(216,180,122,0.15)] relative overflow-hidden">
          {/* Subtle watermark background seal */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full border border-[#D8B47A]/10 pointer-events-none flex items-center justify-center">
            <span className="text-7xl font-serif text-[#D8B47A]/5 font-bold">AURELLE</span>
          </div>

          {/* Certificate Top Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#2C2319] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1F1912] border border-[#D8B47A] flex items-center justify-center text-[#D8B47A]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D8B47A]">
                  OFFICIAL GUILD REGISTRATION
                </span>
                <h3 className="font-mono text-base font-bold text-white">{passport.passportId}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs font-semibold self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Authenticity Guaranteed</span>
            </div>
          </div>

          {/* Product & Provenance Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-[#2C2319]">
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block font-medium">Jewellery Masterwork</span>
                <h2 className="font-serif-luxury text-2xl font-bold text-white mt-0.5">{passport.productName}</h2>
                <span className="text-xs text-[#D8B47A] font-mono">Serial: {passport.serialNumber}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#18140F] p-3 rounded-xl border border-[#241F18]">
                  <span className="text-gray-400 block text-[10px] uppercase">Registered Patron</span>
                  <span className="font-semibold text-white">{passport.customerName}</span>
                </div>
                <div className="bg-[#18140F] p-3 rounded-xl border border-[#241F18]">
                  <span className="text-gray-400 block text-[10px] uppercase">Purchase Date</span>
                  <span className="font-semibold text-white">{passport.purchaseDate}</span>
                </div>
              </div>
            </div>

            {/* Assay Specs */}
            <div className="bg-[#16120D] border border-[#262018] rounded-2xl p-5 space-y-3 text-xs">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Assay & Gemological Record</span>
              </h4>

              <div className="flex justify-between border-b border-[#221B13] pb-1.5">
                <span className="text-gray-400">Hallmark UID (HUID):</span>
                <span className="font-mono font-bold text-white">{passport.hallmarkUid}</span>
              </div>
              <div className="flex justify-between border-b border-[#221B13] pb-1.5">
                <span className="text-gray-400">Metal Purity:</span>
                <span className="font-bold text-[#D8B47A]">{passport.purity}</span>
              </div>
              <div className="flex justify-between border-b border-[#221B13] pb-1.5">
                <span className="text-gray-400">Pure Metal Weight:</span>
                <span className="font-bold text-white">{passport.metalWeight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gemstone Details:</span>
                <span className="font-bold text-white">{passport.gemstoneDetails}</span>
              </div>
            </div>
          </div>

          {/* Inspection and Guild Care History */}
          <div className="pt-8">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] mb-4 flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>Guild Inspection & Maintenance Timeline</span>
            </h4>

            <div className="space-y-3">
              {passport.inspectionHistory.map((insp, idx) => (
                <div
                  key={idx}
                  className="bg-[#18140F] border border-[#241F18] rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#D8B47A]" />
                    <div>
                      <h5 className="font-bold text-white">{insp.type}</h5>
                      <p className="text-gray-400 text-[11px] mt-0.5">{insp.technician}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-400 text-xs">
                    <span>{insp.date}</span>
                    <span className="px-2.5 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] font-medium border border-[#10B981]/30">
                      {insp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
