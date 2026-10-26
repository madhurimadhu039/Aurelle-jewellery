import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const ComparePage: React.FC = () => {
  const { comparison, removeFromCompare, clearCompare, addToCart, formatINR } = useApp();

  if (comparison.length === 0) {
    return (
      <div className="min-h-screen bg-[#090806] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#120F0B] border border-[#262018] text-[#D8B47A] flex items-center justify-center mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="font-serif-luxury text-3xl font-bold mb-2">No Products in Comparison</h2>
        <p className="text-xs text-gray-400 max-w-sm mb-6">
          Compare up to 4 jewellery pieces side-by-side on purity, gold weight, solitaire carats, and making charges.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 rounded-xl bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-widest hover:bg-[#EBD5A8]"
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
              SIDE-BY-SIDE MATRIX
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
              Compare Jewellery ({comparison.length}/4)
            </h1>
          </div>
          <button
            onClick={clearCompare}
            className="text-xs text-gray-400 hover:text-white underline"
          >
            Clear All
          </button>
        </div>

        {/* Responsive Comparison Table */}
        <div className="overflow-x-auto border border-[#241F18] rounded-2xl bg-[#120F0B]">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#241F18] bg-[#0E0C09]">
                <th className="p-4 w-44 font-semibold uppercase tracking-wider text-gray-400">Specifications</th>
                {comparison.map((p) => (
                  <th key={p.id} className="p-4 min-w-[220px] align-top">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-black mb-3">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 text-gray-400 hover:text-white flex items-center justify-center"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-serif-luxury text-sm font-bold text-white line-clamp-1">{p.name}</h4>
                    <div className="text-sm font-extrabold text-[#D8B47A] mt-1">{formatINR(p.price)}</div>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="mt-3 w-full py-1.5 rounded bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add to Cart</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1712] text-gray-300">
              <tr>
                <td className="p-4 font-semibold text-gray-400 bg-[#16120D]">Category</td>
                {comparison.map((p) => (
                  <td key={p.id} className="p-4">{p.category}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-gray-400 bg-[#16120D]">Metal Purity</td>
                {comparison.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-[#D8B47A]">{p.purity}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-gray-400 bg-[#16120D]">Gold Net Weight</td>
                {comparison.map((p) => (
                  <td key={p.id} className="p-4">{p.weightGrams} grams</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-gray-400 bg-[#16120D]">Solitaire Carat</td>
                {comparison.map((p) => (
                  <td key={p.id} className="p-4">{p.diamondCarat ? `${p.diamondCarat} Ct (${p.diamondClarity || 'Certified'})` : 'Plain Gold'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-gray-400 bg-[#16120D]">Gemstones</td>
                {comparison.map((p) => (
                  <td key={p.id} className="p-4">{p.gemstone || 'Natural Diamonds'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-gray-400 bg-[#16120D]">Style / Setting</td>
                {comparison.map((p) => (
                  <td key={p.id} className="p-4">{p.style}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-gray-400 bg-[#16120D]">Certification</td>
                {comparison.map((p) => (
                  <td key={p.id} className="p-4 text-[#34D399] font-medium">{p.certification || 'BIS 916 Hallmark'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-gray-400 bg-[#16120D]">Stock Availability</td>
                {comparison.map((p) => (
                  <td key={p.id} className="p-4 text-emerald-400 font-semibold">Available ({p.stock} units)</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
