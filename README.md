# Aurelle Jewellery — Luxury E-Commerce & Customer Account Platform

> **"Timeless Elegance. Crafted for You."**

A complete, high-end jewellery e-commerce platform built with **React**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Lucide Icons**, and **Firebase** architecture, faithfully matching the **Aurelle Jewellery Luxury UI Moodboard**.

---

## ✦ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Production Build
```bash
npm run build
```

---

## ✦ Key Features Implemented

### 1. Visual & Brand Identity
- **Luxury Color Palette**: Obsidian Black (`#090806`), Champagne Gold (`#D8B47A`), Warm Ivory (`#F7F1E7`), and Espresso Brown (`#24170F`).
- **Typography**: Editorial Serif headlines (`Cormorant Garamond` / `Cinzel`) paired with geometric sans-serif (`Montserrat`).
- **Mobile Responsive Design**: App-like bottom navigation dock (Home, Shop, Wishlist, Account, Cart) matching the mobile layout in the brief's visual moodboard.

### 2. Live Bullion Rates Panel & Transparent Calculator
- **Today's Gold Rate**: 22K Gold (₹8,455/g), 24K Gold (₹9,205/g), Silver (₹102/g).
- Real-time refresh button with micro-market fluctuation simulation and live indicator.
- **Transparent Gold Price Calculator**: Unbundled pricing breakdown formula (`Gold Weight × Benchmark Rate + Artisan Making Charges + Solitaire Carats + 3% GST`).

### 3. Collections & Product Details
- **Multi-Category Filter**: Rings, Necklaces, Earrings, Bangles, Bracelets, Pendants, Mangalsutras, Bridal Jewellery, and New Arrivals.
- Filter by Category, Purity (24K, 22K, 18K, 14K), Style, and Price range slider.
- **Product Detail Pages**: Multi-angle gallery with crosshair zoom, SKU, BIS hallmark verification, size guide, and transparent price formula.

### 4. Interactive Virtual Try-On Studio (`/try-on`)
- Try jewellery pieces directly on portrait, neckline, and hand models.
- Interactive positioning (drag & drop), scale sizing (50%–200%), and angle rotation.
- Instant "Add to Bag" from the Try-On studio.

### 5. Unique Aurelle Innovations
- **Find Your Forever Piece**: AI Recommendation Wizard matching occasions (Bridal, Engagement, Everyday) and budget.
- **Aurelle Heirloom Passport™ (`/passport`)**: Digital authenticity certificate displaying Hallmark UID (HUID), serial numbers, and guild inspection timelines.
- **Jewellery Savings Schemes (`/schemes`)**:
  - Swarna Nidhi (10+1 Month Bonus Scheme) with interactive maturity return simulator.
  - Folio tracking and installment remittance.
- **Pay Due Portal (`/pay-due`)**: Look up outstanding invoice balances by bill number or mobile, record partial/full payments, and print receipts.
- **Customer Ledger (`/ledger`)**: Cryptographic statement of transactions, debits, credits, and running balance.
- **Add Existing Jewellery (`/add-existing`)**: Customer submission form for old-gold exchange appraisal or digital vault registration.

### 6. Admin Control Centre (`/admin`)
- Role-based switcher in navigation (toggle between **Customer** and **Admin** mode).
- Manage product inventory, override bullion rates across the platform, and generate customer Pay Due invoices.

---

## ✦ Project Deliverables

- **Verified Runnable Project**: Serving live at `http://localhost:5173`.
- **Downloadable ZIP Archive**: `aurelle-jewellery.zip` (compressed directly in the project root, excluding `node_modules`).
- **Firebase Security & Config**:
  - `firestore.rules` (Owner-privacy and role-based access control)
  - `firestore.indexes.json` (Compound indexes)
  - `storage.rules` (Upload validation)
  - `firebase.json` (Hosting rewrites and deployment config)
  - `.env.example` (Firebase environment template)
