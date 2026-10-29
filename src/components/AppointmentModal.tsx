import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const AppointmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultService = 'Private Salon Viewing'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(defaultService);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00 - 15:30');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
    >
      <div
        className="relative bg-[#120F0B] border border-[#D8B47A]/50 rounded-2xl max-w-lg w-full p-4 sm:p-7 text-left shadow-2xl my-auto max-h-[92vh] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-[#1A1510] hover:bg-[#251E17] text-gray-400 hover:text-white border border-[#D8B47A]/30 flex items-center justify-center text-xl font-light transition-all"
        >
          &times;
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center mx-auto text-[#10B981]">
              <CheckCircle2 className="w-8 h-8 stroke-[2]" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D8B47A] block">
              VIP RESERVATION RECORDED
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
              Consultation Confirmed
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-white">{name}</strong>. Our Private Salon Concierge will contact you at <strong className="text-[#D8B47A]">{phone}</strong> to finalize your private champagne appointment for <strong className="text-white">{date || 'your selected date'}</strong>.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="pr-10 mb-5 border-b border-[#241F18] pb-3.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D8B47A] block mb-1">
                PRIVATE SALON CONCIERGE
              </span>
              <h3 id="appointment-modal-title" className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
                Book a Private Consultation
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Experience bespoke jewellery viewings with our master gemologists.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-300 block mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Merchant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">Consultation Interest</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Bridal Suite & High Jewellery">Bridal Suite &amp; High Jewellery</option>
                  <option value="Solitaire Engagement Rings">Solitaire Engagement Rings</option>
                  <option value="Bespoke Custom Commission">Bespoke Custom Commission</option>
                  <option value="Heritage Jewellery Remounting">Heritage Jewellery Remounting</option>
                  <option value="Savings Scheme & Bullion Advice">Savings Scheme &amp; Bullion Advice</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Preferred Time Slot</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="11:00 - 12:30">Morning (11:00 AM - 12:30 PM)</option>
                    <option value="14:00 - 15:30">Afternoon (2:00 PM - 3:30 PM)</option>
                    <option value="16:30 - 18:00">Evening (4:30 PM - 6:00 PM)</option>
                    <option value="18:30 - 20:00">Twilight Salon (6:30 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">Special Requests / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your preferences or any specific pieces..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none resize-none"
                />
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#241F18] flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-[#18140F] text-gray-400 hover:text-white text-center text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold text-xs uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#090806] border-t-transparent rounded-full animate-spin" />
                      <span>Securing Salon Reservation...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm Private Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

