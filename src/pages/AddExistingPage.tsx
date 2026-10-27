import React, { useState } from 'react';
import { Upload, CheckCircle2, ShieldCheck, Clock, FileText, ArrowRight } from 'lucide-react';
import { MOCK_SUBMISSIONS } from '../data/mockData';
import { ExistingJewellerySubmission } from '../types';
import { useApp } from '../contexts/AppContext';

export const AddExistingPage: React.FC = () => {
  const { user, showToast } = useApp();
  const [submissions, setSubmissions] = useState<ExistingJewellerySubmission[]>(() => {
    const saved = localStorage.getItem('aurelle_existing_submissions');
    return saved ? JSON.parse(saved) : MOCK_SUBMISSIONS;
  });

  const [description, setDescription] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [metalType, setMetalType] = useState('22K Gold');
  const [weight, setWeight] = useState(15);
  const [hasBill, setHasBill] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubmission: ExistingJewellerySubmission = {
      id: 'sub-' + Date.now(),
      customerName: user?.name || 'Patron',
      phone: user?.phone || '+91 98765 43210',
      email: user?.email || 'patron@example.com',
      billNumber: billNumber || undefined,
      purchaseDate: purchaseDate || undefined,
      description,
      metalType,
      purity: metalType.includes('22K') ? '22K' : '18K',
      estimatedWeightGrams: weight,
      hasBill,
      status: 'PENDING',
      staffNotes: 'Submission received by Aurelle Verification Desk. In-boutique assay or physical verification scheduled.',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('aurelle_existing_submissions', JSON.stringify(updated));
    setSubmitted(true);
    showToast('Jewellery submission received for verification!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
            AUTHENTICATION & EXCHANGE DESK
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
            Register Existing Jewellery
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-lg mx-auto">
            Link prior purchases or vintage heirlooms to your account for Heirloom Passport generation and old-gold exchange valuations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-2 bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-8">
            <h3 className="font-serif-luxury text-xl font-bold text-white mb-1">
              Submit Jewellery Details
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Our guild appraisers will examine purity certifications and issue your digital certificate.
            </p>

            {submitted ? (
              <div className="bg-[#18140F] border border-[#10B981]/40 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto" />
                <h4 className="font-bold text-white text-base">Request Submitted Successfully</h4>
                <p className="text-xs text-gray-400">
                  Your submission has been logged under status <strong className="text-[#FBBF24]">PENDING REVIEW</strong>. Our boutique appraiser will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider mt-2"
                >
                  Submit Another Piece
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Jewellery Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ancestral 22K Gold Temple Necklace with uncut rubies"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#D8B47A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Precious Metal & Purity</label>
                    <select
                      value={metalType}
                      onChange={(e) => setMetalType(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#D8B47A]"
                    >
                      <option value="22K Gold">22K Solid Gold (916)</option>
                      <option value="18K Gold">18K Diamond Setting (750)</option>
                      <option value="24K Gold">24K Bullion / Coin (999)</option>
                      <option value="925 Silver">925 Sterling Silver</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Estimated Weight (Grams)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#D8B47A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Original Invoice / Bill Number</label>
                    <input
                      type="text"
                      placeholder="e.g. AUR-BILL-2021-99"
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#D8B47A]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Approximate Purchase Date</label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#D8B47A]"
                    />
                  </div>
                </div>

                <div className="border border-dashed border-[#2C2720] rounded-xl p-4 text-center bg-[#18140F]/50">
                  <Upload className="w-6 h-6 text-[#D8B47A] mx-auto mb-1.5" />
                  <span className="text-xs text-gray-300 block font-medium">Attach Bill Copy or Jewellery Photographs</span>
                  <span className="text-[11px] text-gray-500">PNG, JPG, PDF up to 10MB</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                >
                  Submit for Guild Verification
                </button>
              </form>
            )}
          </div>

          {/* Submission Status List */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#D8B47A]">
              My Submitted Requests ({submissions.length})
            </h4>

            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#120F0B] border border-[#241F18] rounded-xl p-4 text-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-white truncate max-w-[180px]">{sub.description}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sub.status === 'VERIFIED'
                        ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                        : sub.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="text-gray-400 text-[11px]">
                  <span>{sub.metalType} • {sub.estimatedWeightGrams}g</span>
                  <span className="block text-gray-500 mt-0.5">Submitted: {sub.submittedAt}</span>
                </div>

                {sub.staffNotes && (
                  <div className="p-2 rounded bg-[#18140F] border border-[#201A14] text-[11px] text-gray-300">
                    <span className="text-[#D8B47A] font-semibold block mb-0.5">Guild Note:</span>
                    <span>{sub.staffNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
