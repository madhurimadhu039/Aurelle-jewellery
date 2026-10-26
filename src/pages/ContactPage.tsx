import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    consultationType: 'Bridal Trousseau Consultation',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    showToast('Consultation request received! Our concierge will contact you within 2 hours.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A] py-14 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2 text-gray-700">/</span>
          <span className="text-[#D8B47A]">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D8B47A] font-semibold block mb-2">
            PRIVATE SALON &amp; CONCIERGE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
            Connect with Aurelle
          </h1>
          <p className="text-xs sm:text-sm text-[#BFB5A7] mt-3 max-w-2xl font-light leading-relaxed">
            Whether you wish to reserve a private bridal trousseau salon, discuss custom solitaire cuts, or inquire about bullion schemes, our concierges are at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info & Boutique Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Flagship Salon Card */}
            <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 space-y-4">
              <h3 className="font-serif-luxury text-xl font-normal text-white border-b border-[#201B14] pb-3">
                Flagship Boutique &amp; Atelier
              </h3>

              <div className="space-y-3 text-xs text-[#BFB5A7] font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D8B47A] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Aurelle Flagship Salon</strong>
                    <span>14B, Altamount Road, Cumballa Hill, Mumbai 400026, Maharashtra</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D8B47A] flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium">+91 (022) 8000-AURELLE</span>
                    <span className="block text-[11px] text-gray-500">Concierge Desk: +91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D8B47A] flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium">concierge@aurellejewellery.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#D8B47A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-medium">Salon Hours</span>
                    <span>Monday – Saturday: 10:30 AM – 8:00 PM</span>
                    <span className="block text-gray-500">Sunday: Private appointments only</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Boutique Locations */}
            <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6">
              <h3 className="font-serif-luxury text-base font-normal text-white mb-3">
                Other Boutiques Across India
              </h3>
              <div className="space-y-2.5 text-xs text-gray-400 font-light">
                <div>
                  <span className="text-white font-medium block">New Delhi Salon</span>
                  <span>DLF Emporio, Vasant Kunj, New Delhi</span>
                </div>
                <div className="pt-2 border-t border-[#1C1712]">
                  <span className="text-white font-medium block">Bengaluru Atelier</span>
                  <span>UB City, Vittal Mallya Road, Bengaluru</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Appointment Reservation Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-8">
            <h3 className="font-serif-luxury text-2xl font-normal text-white mb-1">
              Book a Private Salon Consultation
            </h3>
            <p className="text-xs text-[#A69C8E] mb-6 font-light">
              Enjoy champagne hospitality, custom styling from our Master Gemologists, and private viewing of high-jewellery suites.
            </p>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-3 bg-[#16120D] border border-[#10B981]/40 rounded-xl p-6">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
                <h4 className="font-serif-luxury text-xl font-normal text-white">
                  Appointment Request Confirmed
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto font-light leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our VIP Host will call your mobile ({formData.phone}) to confirm your reservation for {formData.preferredDate || 'your requested date'}.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-full bg-[#D8B47A] text-[#090806] text-xs font-semibold uppercase tracking-wider"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani Gayatri Devi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#18140F] border border-[#2B2319] rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#18140F] border border-[#2B2319] rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Consultation Interest</label>
                    <select
                      value={formData.consultationType}
                      onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                      className="w-full bg-[#18140F] border border-[#2B2319] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D8B47A]"
                    >
                      <option value="Bridal Trousseau Consultation">Bridal Trousseau Styling</option>
                      <option value="Solitaire Engagement Ring">Solitaire Engagement Rings</option>
                      <option value="Old Gold Exchange Valuation">Old Gold Exchange Valuation</option>
                      <option value="Jewellery Savings Scheme">Jewellery Savings Scheme</option>
                      <option value="Bespoke Guild Commission">Custom Commission</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-[#18140F] border border-[#2B2319] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D8B47A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Special Requests or Milestone Notes (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the occasion, preferred metal (22K gold, solitaire, platinum), or specific designs you wish to view."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
                >
                  Reserve Private Appointment
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
