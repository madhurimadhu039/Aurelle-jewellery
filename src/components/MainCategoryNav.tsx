import React from 'react';

export type MainCategoryKey = 
  | 'All Jewellery'
  | 'Gold'
  | 'Diamonds'
  | 'Wedding'
  | 'Daily Wear'
  | 'Earrings'
  | 'Under ₹50K';

interface Props {
  activeCategory: string;
  onSelectCategory: (category: MainCategoryKey) => void;
  className?: string;
}

export const MAIN_CATEGORIES: {
  key: MainCategoryKey;
  label: string;
  tagline: string;
  icon: (active: boolean) => React.ReactNode;
}[] = [
  {
    key: 'All Jewellery',
    label: 'All Jewellery',
    tagline: 'Complete royal catalogue',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#D8B47A]' : 'text-gray-400 group-hover:text-[#D8B47A]'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {/* Ring with solitaire sparkling crown */}
        <circle cx="12" cy="14" r="7" />
        <path d="M10 3h4l2 4H8l2-4z" />
        <path d="M8 7l4-4 4 4" />
      </svg>
    ),
  },
  {
    key: 'Gold',
    label: 'Gold',
    tagline: '22K & 24K certified bullion',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#D8B47A]' : 'text-gray-400 group-hover:text-[#D8B47A]'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {/* Royal Gold Bangles / Ingot Stack */}
        <ellipse cx="12" cy="7" rx="8" ry="3.5" />
        <path d="M4 7v5c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5V7" />
        <path d="M4 12v5c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5v-5" />
      </svg>
    ),
  },
  {
    key: 'Diamonds',
    label: 'Diamonds',
    tagline: 'Natural conflict-free solitaires',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#D8B47A]' : 'text-gray-400 group-hover:text-[#D8B47A]'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {/* Faceted Brilliant Diamond Gem */}
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
        <path d="M2 9h20" />
        <path d="M10 3l2 6 2-6" />
        <path d="M12 9v12" />
        <path d="M6 3l6 6 6-6" />
      </svg>
    ),
  },
  {
    key: 'Wedding',
    label: 'Wedding',
    tagline: 'Bridal grand trousseau sets',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#D8B47A]' : 'text-gray-400 group-hover:text-[#D8B47A]'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {/* Interlocking Nuptial Rings with Gem */}
        <circle cx="9" cy="13" r="6" />
        <circle cx="15" cy="13" r="6" />
        <path d="M12 2l1.5 2.5h-3L12 2z" />
      </svg>
    ),
  },
  {
    key: 'Daily Wear',
    label: 'Daily Wear',
    tagline: 'Lightweight everyday luxury',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#D8B47A]' : 'text-gray-400 group-hover:text-[#D8B47A]'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {/* Minimal Chic Four-Leaf Floral Stud */}
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        <circle cx="12" cy="7" r="1.5" />
        <circle cx="12" cy="17" r="1.5" />
        <circle cx="7" cy="12" r="1.5" />
        <circle cx="17" cy="12" r="1.5" />
      </svg>
    ),
  },
  {
    key: 'Earrings',
    label: 'Earrings',
    tagline: 'Chandbalis, studs & jhumkas',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#D8B47A]' : 'text-gray-400 group-hover:text-[#D8B47A]'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {/* Chandelier / Drop Earrings */}
        <circle cx="12" cy="4" r="2" />
        <path d="M12 6v3" />
        <path d="M8 12c0-2.2 1.8-3 4-3s4 .8 4 3c0 3-4 7-4 7s-4-4-4-7z" />
        <circle cx="12" cy="13" r="1" />
      </svg>
    ),
  },
  {
    key: 'Under ₹50K',
    label: 'Under ₹50K',
    tagline: 'Affordable fine jewellery',
    icon: (active) => (
      <svg
        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#D8B47A]' : 'text-gray-400 group-hover:text-[#D8B47A]'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {/* Luxury Price Tag with Rupee Sign */}
        <path d="M12.5 2H6a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .58 1.42l8.5 8.5a2 2 0 0 0 2.84 0l6.5-6.5a2 2 0 0 0 0-2.84l-8.5-8.5A2 2 0 0 0 12.5 2z" />
        <circle cx="7.5" cy="5.5" r="1.5" fill="currentColor" />
        <path d="M13 9h3M13 11h2.5M13 13l2.5 2" />
      </svg>
    ),
  },
];

export const MainCategoryNav: React.FC<Props> = ({
  activeCategory,
  onSelectCategory,
  className = '',
}) => {
  const isMatch = (key: MainCategoryKey): boolean => {
    const active = activeCategory.trim().toLowerCase();
    const target = key.toLowerCase();

    if (key === 'All Jewellery') {
      return active === 'all' || active === 'all jewellery' || active === '';
    }
    if (key === 'Under ₹50K') {
      return active === 'under ₹50k' || active === 'under 50k' || active.includes('50k');
    }
    if (key === 'Diamonds') {
      return active === 'diamonds' || active === 'diamond';
    }
    if (key === 'Wedding') {
      return active === 'wedding' || active === 'bridal jewellery' || active.includes('bridal');
    }
    if (key === 'Daily Wear') {
      return active === 'daily wear' || active === 'dailywear';
    }
    return active === target;
  };

  return (
    <nav 
      aria-label="Jewellery Categories Navigation"
      className={`w-full bg-[#0E0C09] border-b border-[#241F18] shadow-sm select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Horizontal Navigation List */}
        <div 
          className="flex items-center justify-between sm:justify-center lg:justify-between gap-1 sm:gap-2 lg:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x py-3 sm:py-3.5"
          role="tablist"
        >
          {MAIN_CATEGORIES.map((item) => {
            const active = isMatch(item.key);

            return (
              <button
                key={item.key}
                role="tab"
                aria-selected={active}
                onClick={() => onSelectCategory(item.key)}
                className={`group flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer snap-start relative ${
                  active
                    ? 'bg-[#1E1912] text-[#D8B47A] font-semibold border border-[#D8B47A]/60 shadow-[0_2px_12px_rgba(216,180,122,0.15)]'
                    : 'text-[#C7BEB2] hover:text-white hover:bg-[#16120D] border border-transparent hover:border-[#2B2319]'
                }`}
                title={item.tagline}
              >
                {/* Minimal Luxury Icon */}
                <span className="flex-shrink-0">
                  {item.icon(active)}
                </span>

                {/* Category Label */}
                <span className="whitespace-nowrap font-serif-luxury sm:font-sans tracking-wide">
                  {item.label}
                </span>

                {/* Active Indicator Underline Dot */}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8B47A] shadow-[0_0_6px_#D8B47A] hidden sm:inline-block ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
};

