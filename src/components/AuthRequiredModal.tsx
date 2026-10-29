import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  action: 'cart' | 'wishlist';
  productName?: string;
}

export const AuthRequiredModal: React.FC<Props> = ({
  isOpen,
  onClose,
  action,
  productName,
}) => {
  const navigate = useNavigate();

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

  const handleGoToAuth = () => {
    onClose();
    navigate('/account');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#12100C] border border-[#D8B47A]/50 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative text-center my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1E1B15] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gold Emblem Icon */}
        <div className="w-14 h-14 rounded-full bg-[#18140F] border border-[#D8B47A]/40 flex items-center justify-center mx-auto mb-4 text-[#D8B47A] shadow-[0_0_20px_rgba(216,180,122,0.2)]">
          {action === 'cart' ? (
            <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
          ) : (
            <Heart className="w-6 h-6 stroke-[1.8]" />
          )}
        </div>

        {/* Title */}
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D8B47A] block mb-1">
          PATRON AUTHENTICATION REQUIRED
        </span>
        <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-white mb-2">
          {action === 'cart' ? 'Sign In to Add to Bag' : 'Sign In to Save Favorites'}
        </h3>

        {/* Message */}
        <p className="text-xs text-gray-300 leading-relaxed mb-6 max-w-sm mx-auto">
          {productName ? (
            <>
              To add <span className="text-white font-medium">&ldquo;{productName}&rdquo;</span> to your {action === 'cart' ? 'shopping bag' : 'wishlist'}, please sign in or register your patron profile.
            </>
          ) : (
            `Please sign in or create an Aurelle account to access your ${action === 'cart' ? 'shopping bag' : 'favorites'}.`
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleGoToAuth}
            className="flex-1 py-3 px-4 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            Sign In / Register
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#18140F] hover:bg-[#221C15] text-gray-300 hover:text-white border border-[#2C2720] font-medium text-xs tracking-wider transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
