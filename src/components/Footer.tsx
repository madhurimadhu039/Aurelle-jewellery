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
              <a href="#instagram" aria-label="Instagram" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="#facebook" aria-label="Facebook" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#pinterest" aria-label="Pinterest" className="hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.364-.052.215-.173.26-.4.156-1.49-.693-2.42-2.872-2.42-4.622 0-3.769 2.737-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.374l-.744 2.84c-.269 1.046-.997 2.358-1.488 3.155C10.024 23.82 11.002 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#youtube" aria-label="YouTube" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
