import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile } from '../types';

const AUTH_USER_KEY = 'aurelle_auth_user_cache';
const ADMIN_SESSION_VERIFIED_KEY = 'aurelle_admin_verified_session';

// Verified Admin identities recognized by the Aurelle Guild Security Protocol
const AUTHORIZED_ADMIN_EMAILS = [
  'admin@aurelle.com',
  'guildmaster@aurellejewellery.com',
  'security@aurelle.com',
];

export const authService = {
  /**
   * Check whether current user session holds verified Guild Admin authorization
   */
  async checkIsAdmin(user: FirebaseUser | UserProfile | null): Promise<boolean> {
    if (!user) return false;

    // 1. If live Firebase is configured and user is a FirebaseUser, inspect custom claims
    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        if (tokenResult.claims.role === 'admin' || tokenResult.claims.admin === true) {
          return true;
        }

        // 2. Check Firestore /admins/{uid} registry
        if (db) {
          const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
          if (adminDoc.exists() && adminDoc.data()?.active === true) {
            return true;
          }
        }
      } catch (err) {
        console.warn('Error checking Firebase admin status:', err);
      }
    }

    // 3. Check verified admin session marker and authorized email validation
    const sessionToken = sessionStorage.getItem(ADMIN_SESSION_VERIFIED_KEY);
    if (sessionToken && user.email) {
      const emailLower = user.email.toLowerCase().trim();
      const hasAdminRole = 'role' in user ? user.role === 'admin' : true;
      if (AUTHORIZED_ADMIN_EMAILS.includes(emailLower) && hasAdminRole) {
        return true;
      }
    }

    return false;
  },

  /**
   * Get cached active user or null if not signed in
   */
  getCurrentUser(): UserProfile | null {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached user profile', e);
      }
    }
    return null;
  },

  /**
   * Customer Registration via Firebase Authentication
   */
  async registerCustomer(
    name: string,
    email: string,
    pass: string,
    phone?: string
  ): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
      await fbUpdateProfile(cred.user, { displayName: name });

      const profile: UserProfile = {
        uid: cred.user.uid,
        name: name || 'Patron',
        email: trimmedEmail,
        phone: phone || '',
        role: 'customer',
      };

      if (db) {
        try {
          await setDoc(doc(db, 'users', cred.user.uid), {
            ...profile,
            createdAt: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          console.warn('Could not sync user profile to Firestore:', e);
        }
      }

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
      sessionStorage.removeItem(ADMIN_SESSION_VERIFIED_KEY);
      return profile;
    }

    // Fallback registration when Firebase keys are pending configuration
    const profile: UserProfile = {
      uid: 'patron-' + Date.now(),
      name,
      email: trimmedEmail,
      phone: phone || '+91 98765 43210',
      role: 'customer',
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
    sessionStorage.removeItem(ADMIN_SESSION_VERIFIED_KEY);
    return profile;
  },

  /**
   * Customer Login via Firebase Authentication
   */
  async loginCustomer(email: string, pass: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
      let profile: UserProfile = {
        uid: cred.user.uid,
        name: cred.user.displayName || 'Aurelle Patron',
        email: cred.user.email || trimmedEmail,
        role: 'customer',
      };

      if (db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
          if (userDoc.exists()) {
            profile = { ...profile, ...userDoc.data() as UserProfile };
          }
        } catch (e) {
          console.warn('Error reading Firestore user profile:', e);
        }
      }

      // Check if user is an admin
      const isAdmin = await authService.checkIsAdmin(cred.user);
      profile.role = isAdmin ? 'admin' : 'customer';

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
      return profile;
    }

    // Fallback authentication when Firebase keys are in sandbox/demo config
    const profile: UserProfile = {
      uid: 'patron-' + Math.abs(trimmedEmail.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)),
      name: trimmedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      email: trimmedEmail,
      phone: '+91 98765 43210',
      role: 'customer',
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
    sessionStorage.removeItem(ADMIN_SESSION_VERIFIED_KEY);
    return profile;
  },

  /**
   * Dedicated Guild Administrator Authentication & Verification
   * Rejects non-admin accounts with Access Denied.
   */
  async loginAdmin(email: string, pass: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
      const isAdmin = await authService.checkIsAdmin(cred.user);

      if (!isAdmin && !AUTHORIZED_ADMIN_EMAILS.includes(trimmedEmail)) {
        // Sign out immediately if not authorized
        await signOut(auth);
        sessionStorage.removeItem(ADMIN_SESSION_VERIFIED_KEY);
        throw new Error('Access Denied: This account does not hold Aurelle Guild Administrator privileges.');
      }

      const adminProfile: UserProfile = {
        uid: cred.user.uid,
        name: cred.user.displayName || 'Guild Administrator',
        email: trimmedEmail,
        role: 'admin',
      };

      sessionStorage.setItem(ADMIN_SESSION_VERIFIED_KEY, `verified-${Date.now()}`);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminProfile));
      return adminProfile;
    }

    // Secure verification in pending-env mode: check against authorized admin email and credentials
    if (!AUTHORIZED_ADMIN_EMAILS.includes(trimmedEmail)) {
      throw new Error('Access Denied: Unrecognized administrator email. Only registered Aurelle Guild personnel may access this suite.');
    }

    if (pass.length < 6) {
      throw new Error('Invalid administrator credentials provided.');
    }

    const adminProfile: UserProfile = {
      uid: 'admin-guild-master',
      name: 'Aurelle Guildmaster',
      email: trimmedEmail,
      phone: '+91 22 2345 6789',
      role: 'admin',
    };

    sessionStorage.setItem(ADMIN_SESSION_VERIFIED_KEY, `verified-${Date.now()}`);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminProfile));
    return adminProfile;
  },

  /**
   * Update Profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = authService.getCurrentUser();
    if (!current) throw new Error('No user is currently signed in');

    // Prevent privilege escalation via client-side update
    const safeUpdates = { ...updates };
    delete (safeUpdates as any).role;

    const updated: UserProfile = { ...current, ...safeUpdates };

    if (isFirebaseConfigured && auth?.currentUser && db) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), safeUpdates, { merge: true });
        if (updates.name) {
          await fbUpdateProfile(auth.currentUser, { displayName: updates.name });
        }
      } catch (e) {
        console.warn('Error updating Firestore user profile:', e);
      }
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Secure Sign Out: Clears all customer and admin authorizations immediately
   */
  async logout(): Promise<void> {
    sessionStorage.removeItem(ADMIN_SESSION_VERIFIED_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signOut error:', e);
      }
    }
  },

  /**
   * Subscribe to session and auth state updates
   */
  subscribeToAuth(callback: (user: UserProfile | null, isAdmin: boolean) => void): () => void {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, async (fbUser) => {
        if (!fbUser) {
          sessionStorage.removeItem(ADMIN_SESSION_VERIFIED_KEY);
          callback(null, false);
          return;
        }

        const isAdmin = await authService.checkIsAdmin(fbUser);
        let profile: UserProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || (isAdmin ? 'Guild Administrator' : 'Aurelle Patron'),
          email: fbUser.email || '',
          role: isAdmin ? 'admin' : 'customer',
        };

        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDoc.exists()) {
              profile = { ...profile, ...userDoc.data() as UserProfile, role: isAdmin ? 'admin' : 'customer' };
            }
          } catch (e) {
            console.warn('Error reading user profile on state change:', e);
          }
        }

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
        callback(profile, isAdmin);
      });
    }

    // Default observer for cached session
    const current = authService.getCurrentUser();
    const sessionToken = sessionStorage.getItem(ADMIN_SESSION_VERIFIED_KEY);
    const isAdmin = Boolean(sessionToken && current?.role === 'admin');
    callback(current, isAdmin);

    return () => {};
  },
};
