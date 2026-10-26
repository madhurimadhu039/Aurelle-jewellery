import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

const PRODUCTS_STORAGE_KEY = 'aurelle_products_db';

export const productService = {
  getAll: (): Product[] => {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      try {
        let products: Product[] = JSON.parse(stored);
        let updated = false;

        // Auto-heal/migrate any stale or broken bracelet image URLs
        products = products.map((p) => {
          if (p.id === 'aur-004' || p.category === 'Bracelets') {
            const hasBroken = !p.images || !p.images.length || p.images.some((img) => img.includes('photo-1611591475155'));
            if (hasBroken) {
              updated = true;
              return {
                ...p,
                images: ['/images/bracelet-1.jpg', '/images/bracelet-2.jpg'],
              };
            }
          }
          if (p.images && p.images.some((img) => img.includes('photo-1611591475155'))) {
            updated = true;
            return {
              ...p,
              images: p.images.map((img) =>
                img.includes('photo-1611591475155') ? '/images/bracelet-1.jpg' : img
              ),
            };
          }
          return p;
        });

        if (updated) {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
        }

        return products;
      } catch (e) {
        console.error('Error reading stored products', e);
      }
    }
    // Initialize if empty
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  },

  getById: (id: string): Product | undefined => {
    const products = productService.getAll();
    return products.find((p) => p.id === id);
  },

  saveProduct: (product: Product): Product => {
    const products = productService.getAll();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return product;
  },

  deleteProduct: (id: string): void => {
    const products = productService.getAll().filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  },

  filterProducts: (filters: {
    category?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    purity?: string;
    metalType?: string;
    style?: string;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'rating';
  }): Product[] => {
    let result = productService.getAll();

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
