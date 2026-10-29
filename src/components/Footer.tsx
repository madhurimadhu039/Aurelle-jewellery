import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#090806] border-t border-[#1C1712] text-[#A69C8E] pt-14 pb-14 text-xs text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-14">
          
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-3">
            <div>
              <span className="font-serif-luxury text-2xl font-normal tracking-[0.28em] text-[#F7F1E7] block leading-tight">
                AURELLE
              </span>
              <span className="text-[8px] uppercase tracking-[0.42em] text-[#D8B47A] block font-medium pl-0.5">
                JEWELLERY
              </span>
            </div>
            <p className="text-[12px] text-[#A69C8E] font-light mt-3">
              Timeless Elegance. Always.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-[#F7F1E7] tracking-[0.1em]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-[12px] text-[#A69C8E]">
              <li>
                <Link to="/" className="hover:text-[#D8B47A] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#D8B47A] transition-colors">Collections</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D8B47A] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D8B47A] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-[#F7F1E7] tracking-[0.1em]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-[12px] text-[#A69C8E]">
              <li>
                <Link to="/pay-due" className="hover:text-[#D8B47A] transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/passport" className="hover:text-[#D8B47A] transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#D8B47A] transition-colors">Services &amp; FAQs</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D8B47A] transition-colors">Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-[#F7F1E7] tracking-[0.1em]">
              Stay Connected
            </h4>
            <div className="flex items-center space-x-3.5 pt-1 text-[#D8B47A]">
              {/* Instagram */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Follow Aurelle on Instagram"
                className="hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Follow Aurelle on Facebook"
                className="hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="Watch Aurelle on YouTube"
                className="hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-[#1C1712] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7165]">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Aurelle Jewellery. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5 text-[11px]">
            <Link to="/services" className="hover:text-[#D8B47A] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#3A332A]">•</span>
            <Link to="/services" className="hover:text-[#D8B47A] transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#3A332A]">•</span>
            <Link to="/contact" className="hover:text-[#D8B47A] transition-colors">
              Store Locator
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
