import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Order } from '../types';

const ORDERS_STORAGE_KEY = 'aurelle_orders_history';

export const orderService = {
  getAll(filterCustomerEmail?: string): Order[] {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    let orders: Order[] = [];
    if (data) {
      try {
        orders = JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }

    if (filterCustomerEmail) {
      const emailLower = filterCustomerEmail.trim().toLowerCase();
      return orders.filter((o) => o.customer.email.toLowerCase() === emailLower);
    }

    return orders;
  },

  async fetchFromFirestore(): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        if (!snap.empty) {
          const remote: Order[] = [];
          snap.forEach((d) => remote.push({ id: d.id, ...(d.data() as any) }));
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(remote));
          return remote;
        }
      } catch (e) {
        console.warn('Could not read orders from Firestore:', e);
      }
    }
    return orderService.getAll();
  },

  async createOrder(orderPayload: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const orders = orderService.getAll();
    const newOrder: Order = {
      ...orderPayload,
      id: 'ord-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', newOrder.id), newOrder);
      } catch (e) {
        console.warn('Could not save order to Firestore:', e);
      }
    }

    return newOrder;
  },
};

