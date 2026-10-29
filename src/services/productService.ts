import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

const PRODUCTS_STORAGE_KEY = 'aurelle_products_db_v7';

type ProductListener = (products: Product[]) => void;
const listeners: Set<ProductListener> = new Set();

function notifyListeners(products: Product[]) {
  listeners.forEach((listener) => {
    try {
      listener(products);
    } catch (e) {
      console.error('Error notifying product listener:', e);
    }
  });
}

export const productService = {
  subscribe(listener: ProductListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getAll(includeUnpublished = false): Product[] {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    let products: Product[] = [];

    if (stored) {
      try {
        products = JSON.parse(stored);
      } catch (e) {
        console.error('Error reading stored products', e);
        products = MOCK_PRODUCTS;
      }
    } else {
      products = MOCK_PRODUCTS;
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }

    let hasUpdatedImages = false;

    // Ensure all default catalogue products are present in cache and synced with latest definitions
    MOCK_PRODUCTS.forEach((mp) => {
      const idx = products.findIndex((p) => p.id === mp.id);
      if (idx === -1) {
        products.push(mp);
        hasUpdatedImages = true;
      } else {
        const current = products[idx];
        if (
          current.name !== mp.name ||
          current.images?.[0] !== mp.images?.[0] ||
          current.weightGrams !== mp.weightGrams ||
          current.price !== mp.price ||
          current.category !== mp.category ||
          current.material !== mp.material
        ) {
          products[idx] = { ...current, ...mp };
          hasUpdatedImages = true;
        }
      }
    });

    // Ensure product images are distinct and not colliding with collection images
    products = products.map((p) => {
      const isPublished = p.isPublished !== false; // Default true

      // Auto-heal bracelet images to distinct project assets
      if (p.id === 'aur-004' || p.category === 'Bracelets') {
        const hasOldOrBroken = !p.images || !p.images.length || 
          p.images.some((img) => img.includes('photo-1611591475155')) ||
          p.images[0] === '/images/bracelet-1.jpg';
        if (hasOldOrBroken) {
          hasUpdatedImages = true;
          return {
            ...p,
            isPublished,
            images: ['/images/bracelet-2.jpg', '/images/bracelet-1.jpg'],
          };
        }
      }

      return { ...p, isPublished };
    });

    if (hasUpdatedImages && stored) {
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      } catch (e) {
        console.warn('Could not update cached products in storage', e);
      }
    }

    if (!includeUnpublished) {
      return products.filter((p) => p.isPublished !== false && p.id && p.id.startsWith('aur-'));
    }

    return products.filter((p) => p.id && p.id.startsWith('aur-'));
  },

  getById(id: string): Product | undefined {
    const products = productService.getAll(true);
    return products.find((p) => p.id === id);
  },

  /**
   * Fetch live products from Firebase Firestore
   */
  async fetchFromFirestore(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const remoteProducts: Product[] = [];
          querySnapshot.forEach((docSnap) => {
            remoteProducts.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(remoteProducts));
          notifyListeners(remoteProducts);
          return remoteProducts;
        }
      } catch (err) {
        console.warn('Firestore products fetch error, using local cached catalog:', err);
      }
    }
    return productService.getAll(true);
  },

  /**
   * Save (create or update) product in Firebase & Local Cache
   */
  async saveProduct(product: Product): Promise<Product> {
    const cleanProduct: Product = {
      ...product,
      isPublished: product.isPublished !== false,
    };

    // Save to Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', cleanProduct.id), cleanProduct, { merge: true });
      } catch (err) {
        console.warn('Error saving product to Firestore:', err);
      }
    }

    // Update local cache
    const current = productService.getAll(true);
    const existingIndex = current.findIndex((p) => p.id === cleanProduct.id);
    if (existingIndex >= 0) {
      current[existingIndex] = cleanProduct;
    } else {
      current.unshift(cleanProduct);
    }

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(current));
    notifyListeners(current);
    return cleanProduct;
  },

  /**
   * Toggle product publication status (publish / unpublish)
   */
  async togglePublish(id: string): Promise<Product | undefined> {
    const product = productService.getById(id);
    if (!product) return undefined;

    const updated: Product = {
      ...product,
      isPublished: !product.isPublished,
    };

    return productService.saveProduct(updated);
  },

  /**
   * Deduct stock after order completion
   */
  async deductStock(productId: string, quantity: number): Promise<Product | undefined> {
    const product = productService.getById(productId);
    if (!product) return undefined;
    const newStock = Math.max(0, product.stock - quantity);
    return productService.saveProduct({ ...product, stock: newStock });
  },

  /**
   * Delete product from Firebase & Local Cache
   */
  async deleteProduct(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.warn('Error deleting product from Firestore:', err);
      }
    }

    const current = productService.getAll(true).filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(current));
    notifyListeners(current);
  },

  filterProducts(filters: {
    category?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    purity?: string;
    metalType?: string;
    style?: string;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'rating';
  }): Product[] {
    let result = productService.getAll(false);

    if (filters.category && filters.category !== 'All' && filters.category !== 'All Jewellery') {
      const cat = filters.category.trim();
      const catLower = cat.toLowerCase();

      if (cat === 'New Arrivals') {
        result = result.filter((p) => p.isNewArrival);
      } else if (catLower === 'wedding' || cat === 'Bridal Jewellery') {
        // Distinct heavy royal bridal wedding ornaments only
        result = result.filter(
          (p) =>
            p.category === 'Bridal Jewellery' ||
            p.isBridal === true ||
            p.name.toLowerCase().includes('bridal') ||
            p.name.toLowerCase().includes('rani haar') ||
            p.name.toLowerCase().includes('kamarbandh') ||
            p.name.toLowerCase().includes('matha patti')
        );
      } else if (catLower === 'gold') {
        // Pure traditional solid gold creations (necklaces, chains, bangles, bracelets, rings, bullion)
        // Strictly exclude bridal sets and any diamond/white gold items
        result = result.filter(
          (p) =>
            p.category !== 'Bridal Jewellery' &&
            !p.isBridal &&
            (p.purity === '24K' || p.purity === '22K') &&
            (p.material.toLowerCase().includes('solid') || p.material.toLowerCase().includes('gold') || p.material.toLowerCase().includes('bullion')) &&
            !p.name.toLowerCase().includes('solitaire') &&
            !p.name.toLowerCase().includes('diamond') &&
            !p.material.toLowerCase().includes('diamond') &&
            !p.material.toLowerCase().includes('white gold') &&
            (!p.diamondCarat || p.diamondCarat === 0)
        );
      } else if (catLower === 'diamonds' || catLower === 'diamond') {
        // Distinct certified natural diamond & solitaire creations (necklaces, pendants, earrings, rings, bracelets)
        // Strictly exclude pure gold and bridal sets
        result = result.filter(
          (p) =>
            p.category !== 'Bridal Jewellery' &&
            !p.isBridal &&
            ((p.diamondCarat && p.diamondCarat > 0) ||
              p.material.toLowerCase().includes('diamond') ||
              p.name.toLowerCase().includes('diamond') ||
              p.name.toLowerCase().includes('solitaire'))
        );
      } else if (catLower === 'daily wear' || catLower === 'dailywear') {
        // Lightweight everyday luxury (under 10g and under ₹90,000)
        result = result.filter(
          (p) =>
            !p.isBridal &&
            p.category !== 'Bridal Jewellery' &&
            (p.weightGrams && p.weightGrams <= 10) &&
            p.price <= 90000 &&
            (p.occasion && p.occasion.some((occ) => /daily|everyday|office/i.test(occ)))
        );
      } else if (catLower === 'earrings') {
        // Earrings only
        result = result.filter(
          (p) =>
            p.category === 'Earrings' ||
            p.name.toLowerCase().includes('earring') ||
            p.name.toLowerCase().includes('chandbali') ||
            p.name.toLowerCase().includes('stud') ||
            p.name.toLowerCase().includes('jhumka')
        );
      } else if (catLower === 'under ₹50k' || catLower === 'under 50k' || catLower.includes('50k')) {
        // Only products whose actual prices are below ₹50,000
        result = result.filter((p) => p.price < 50000 && p.id && p.id.startsWith('aur-'));
      } else {
        result = result.filter((p) => p.category.toLowerCase().includes(catLower));
      }
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.purity && filters.purity !== 'All') {
      result = result.filter((p) => p.purity === filters.purity);
    }

    if (filters.style && filters.style !== 'All') {
      result = result.filter((p) => p.style.toLowerCase().includes(filters.style!.toLowerCase()));
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'newest') {
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      }
    }

    return result;
  },
};
