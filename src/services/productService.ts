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

const PRODUCTS_STORAGE_KEY = 'aurelle_products_db';

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

    // Auto-heal bracelet images if needed
    products = products.map((p) => {
      const isPublished = p.isPublished !== false; // Default true
      if (p.id === 'aur-004' || p.category === 'Bracelets') {
        const hasBroken = !p.images || !p.images.length || p.images.some((img) => img.includes('photo-1611591475155'));
        if (hasBroken) {
          return {
            ...p,
            isPublished,
            images: ['/images/bracelet-1.jpg', '/images/bracelet-2.jpg'],
          };
        }
      }
      return { ...p, isPublished };
    });

    if (!includeUnpublished) {
      return products.filter((p) => p.isPublished !== false);
    }

    return products;
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

    if (filters.category && filters.category !== 'All') {
      if (filters.category === 'New Arrivals') {
        result = result.filter((p) => p.isNewArrival);
      } else if (filters.category === 'Bridal Jewellery') {
        result = result.filter((p) => p.isBridal);
      } else {
        result = result.filter((p) => p.category.toLowerCase().includes(filters.category!.toLowerCase()));
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
