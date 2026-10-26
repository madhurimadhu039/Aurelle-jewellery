import { UserProfile } from '../types';

const AUTH_USER_KEY = 'aurelle_auth_user';

const DEFAULT_DEMO_USER: UserProfile = {
  uid: 'usr-demo-001',
  name: 'Madhurima Sharma',
  email: 'madhurima@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  addresses: [
    {
      street: '14B, Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
    },
  ],
};

export const authService = {
  getCurrentUser: (): UserProfile => {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
    return DEFAULT_DEMO_USER;
  },

  setUserRole: (role: 'customer' | 'admin'): UserProfile => {
    const user = authService.getCurrentUser();
    const updated: UserProfile = { ...user, role };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    return updated;
  },

  updateProfile: (updates: Partial<UserProfile>): UserProfile => {
    const user = authService.getCurrentUser();
    const updated: UserProfile = { ...user, ...updates };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    return updated;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_USER_KEY);
  },
};
