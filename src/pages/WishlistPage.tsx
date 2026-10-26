import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, formatINR } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#090806] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#120F0B] border border-[#262018] text-[#D8B47A] flex items-center justify-center mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-serif-luxury text-3xl font-bold mb-2">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-400 max-w-sm mb-6">
          Save your favourite solitaires, royal necklaces, and heirloom rings to review anytime.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 rounded-xl bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-widest hover:bg-[#EBD5A8] transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D8B47A] font-semibold">
              SAVED PIECES
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
              My Favourites ({wishlist.length})
            </h1>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase font-semibold text-[#D8B47A] hover:underline flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-[#120F0B] border border-[#241F18] rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-black">
                <Link to={`/product/${product.id}`}>
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </Link>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#090806]/80 text-rose-500 hover:text-white flex items-center justify-center border border-[#2C2720]"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D8B47A]">
                    {product.purity} • {product.category}
                  </span>
                  <Link to={`/product/${product.id}`} className="block">
                    <h4 className="font-serif-luxury text-base font-bold text-white hover:text-[#D8B47A] truncate mt-0.5">
                      {product.name}
                    </h4>
                  </Link>
                  <div className="text-sm font-bold text-[#F7F1E7] mt-1">
                    {formatINR(product.price)}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#201A14]">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full py-2 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
