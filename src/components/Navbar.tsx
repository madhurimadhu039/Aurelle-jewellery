import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  User, 
  ShoppingBag, 
  Menu, 
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Navbar: React.FC = () => {
  const { cartCount, wishlist, user, isAdmin, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#090806] border-b border-[#1C1712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            
            {/* Left: Brand Logo & Wordmark */}
            <div className="flex-shrink-0">
              <Link to="/" className="inline-block group text-left">
                <span className="font-serif-luxury text-2xl sm:text-[26px] font-normal tracking-[0.28em] text-[#F7F1E7] block leading-tight">
                  AURELLE
                </span>
                <span className="text-[8px] uppercase tracking-[0.42em] text-[#D8B47A] block font-medium pl-0.5">
                  JEWELLERY
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
              {navLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`text-[12px] tracking-[0.06em] font-light transition-colors relative py-1 ${
                      active ? 'text-[#F7F1E7]' : 'text-[#BFB5A7] hover:text-[#F7F1E7]'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D8B47A] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5 text-[#D1C7BA]">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 hover:text-[#D8B47A] transition-colors"
                aria-label="Search catalogue"
              >
                <Search className="w-[18px] h-[18px] stroke-[1.5]" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-1.5 hover:text-[#D8B47A] transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#D8B47A] text-[#090806] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="p-1.5 hover:text-[#D8B47A] transition-colors flex items-center"
                  aria-label="My Account"
                >
                  <User className="w-[18px] h-[18px] stroke-[1.5]" />
                </button>

                {accountDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-3 w-60 rounded-xl bg-[#110E0B] border border-[#2A231A] shadow-2xl py-2 z-50 text-xs text-left"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-[#241F18]">
                      {user ? (
                        <>
                          <p className="font-semibold text-white">{user.name || 'Patron'}</p>
                          <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                          <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isAdmin 
                              ? 'bg-[#D8B47A]/20 text-[#D8B47A] border border-[#D8B47A]/40' 
                              : 'bg-gray-800 text-gray-300'
                          }`}>
                            {isAdmin ? 'Guild Administrator' : 'Registered Patron'}
                          </span>
                        </>
                      ) : (
                        <div>
                          <p className="font-semibold text-white">Welcome, Guest</p>
                          <Link 
                            to="/account"
                            className="inline-block mt-1.5 px-3 py-1 bg-[#D8B47A] text-[#090806] font-bold text-[10px] rounded uppercase tracking-wider hover:bg-[#EBD5A8] transition-colors"
                          >
                            Sign In / Register
                          </Link>
                        </div>
                      )}
                    </div>
                    {user && (
                      <>
                        <Link to="/account" className="block px-4 py-2 hover:bg-[#1A1611] text-white font-medium">My Patron Dashboard</Link>
                        <Link to="/passport" className="block px-4 py-2 hover:bg-[#1A1611] text-gray-300 hover:text-white">Heirloom Passport™</Link>
                        <Link to="/schemes" className="block px-4 py-2 hover:bg-[#1A1611] text-gray-300 hover:text-white">Jewellery Schemes</Link>
                        <Link to="/pay-due" className="block px-4 py-2 hover:bg-[#1A1611] text-gray-300 hover:text-white">Pay Due Invoices</Link>
                        <Link to="/ledger" className="block px-4 py-2 hover:bg-[#1A1611] text-gray-300 hover:text-white">My Ledger Statement</Link>
                        <Link to="/add-existing" className="block px-4 py-2 hover:bg-[#1A1611] text-gray-300 hover:text-white">Add Existing Jewellery</Link>
                        
                        <div className="border-t border-[#241F18] my-1" />
                      </>
                    )}
                    
                    <Link 
                      to="/admin" 
                      className={`block px-4 py-2 font-medium ${
                        isAdmin 
                          ? 'bg-[#D8B47A]/15 text-[#D8B47A] hover:bg-[#D8B47A]/25' 
                          : 'text-gray-400 hover:text-[#D8B47A] hover:bg-[#1A1611]'
                      }`}
                    >
                      {isAdmin ? '✦ Admin Control Center' : 'Guild Admin Access'}
                    </Link>

                    {user && (
                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-[#1A1611] text-xs font-medium"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Bag with Gold Badge */}
              <Link
                to="/cart"
                className="p-1.5 hover:text-[#D8B47A] transition-colors relative"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
                <span className="absolute -top-0.5 -right-1 w-4 h-4 bg-[#D8B47A] text-[#090806] text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#D1C7BA] hover:text-white md:hidden"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="border-t border-[#1C1712] bg-[#0E0C09] py-3.5 px-4 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, SKU, 22K gold, diamond carat, style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none"
              />
              <button type="submit" className="text-xs uppercase font-bold text-[#D8B47A] hover:underline">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1C1712] bg-[#090806] px-6 py-5 space-y-3 text-left">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-wider font-light text-[#D1C7BA] hover:text-[#D8B47A] py-1.5 border-b border-[#18140F]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-wider font-semibold text-[#D8B47A] py-2"
            >
              My Patron Account →
            </Link>
          </div>
        )}
      </header>

      {/* Mobile App-like Bottom Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090806]/95 backdrop-blur-md border-t border-[#262018] px-4 py-2">
        <div className="flex items-center justify-around text-[10px] uppercase font-medium tracking-wider text-[#A1998E]">
          <Link to="/" className={`flex flex-col items-center gap-0.5 ${location.pathname === '/' ? 'text-[#D8B47A]' : ''}`}>
            <span className="text-sm">✦</span>
            <span>Home</span>
          </Link>
          <Link to="/collections" className={`flex flex-col items-center gap-0.5 ${location.pathname.startsWith('/collections') ? 'text-[#D8B47A]' : ''}`}>
            <span className="text-xs font-serif font-bold">C</span>
            <span>Collections</span>
          </Link>
          <Link to="/shop" className={`flex flex-col items-center gap-0.5 ${location.pathname.startsWith('/shop') ? 'text-[#D8B47A]' : ''}`}>
            <ShoppingBag className="w-4 h-4" />
            <span>Shop</span>
          </Link>
          <Link to="/wishlist" className={`relative flex flex-col items-center gap-0.5 ${location.pathname === '/wishlist' ? 'text-[#D8B47A]' : ''}`}>
            <Heart className="w-4 h-4" />
            <span>Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-[#D8B47A] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/account" className={`flex flex-col items-center gap-0.5 ${location.pathname.startsWith('/account') ? 'text-[#D8B47A]' : ''}`}>
            <User className="w-4 h-4" />
            <span>Account</span>
          </Link>
        </div>
      </div>
    </>
  );
};
