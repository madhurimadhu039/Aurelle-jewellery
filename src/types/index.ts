export type Category = 
  | 'Gold Jewellery'
  | 'Diamond Jewellery'
  | 'Rings'
  | 'Necklaces'
  | 'Earrings'
  | 'Bangles'
  | 'Bracelets'
  | 'Pendants'
  | 'Mangalsutras'
  | 'Bridal Jewellery'
  | 'New Arrivals';

export type MetalPurity = '24K' | '22K' | '18K' | '14K' | '950 Platinum' | '925 Silver';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  material: string;
  purity: MetalPurity;
  weightGrams: number;
  makingChargePercent?: number;
  diamondCarat?: number;
  diamondClarity?: string;
  gemstone?: string;
  stock: number;
  style: string;
  occasion: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBridal?: boolean;
  rating: number;
  reviewsCount: number;
  dimensions?: string;
  careInstructions?: string[];
  certification?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  engravingText?: string;
}

export interface MetalRateData {
  gold22k: number;
  gold24k: number;
  silver1g: number;
  lastUpdated: string;
  isLive: boolean;
  provider: string;
  currency: string;
  goldChange24h: number;
  silverChange24h: number;
  city: string;
}

export interface Scheme {
  id: string;
  name: string;
  tagline: string;
  durationMonths: number;
  monthlyOptions: number[];
  bonusPercentage: number;
  benefits: string[];
  terms: string[];
  minAmount: number;
}

export interface SchemeEnrollment {
  id: string;
  schemeId: string;
  schemeName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  monthlyAmount: number;
  tenureMonths: number;
  installmentsPaid: number;
  startDate: string;
  nextDueDate: string;
  maturityDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  paymentsHistory: {
    installmentNo: number;
    amount: number;
    paidDate: string;
    receiptNo: string;
    mode: string;
  }[];
}

export interface PayDueRecord {
  id: string;
  billNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  status: 'PAID' | 'PARTIALLY_PAID' | 'PENDING' | 'OVERDUE';
  orderSummary: string;
  paymentsHistory: {
    id: string;
    amount: number;
    date: string;
    paymentMode: string;
    receiptNumber: string;
  }[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  refNumber: string;
  type: 'PURCHASE' | 'PAYMENT' | 'SCHEME_INSTALLMENT' | 'REFUND' | 'ADJUSTMENT';
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface HeirloomPassport {
  id: string;
  passportId: string;
  productName: string;
  sku: string;
  serialNumber: string;
  hallmarkUid: string;
  purity: string;
  metalWeight: string;
  gemstoneDetails: string;
  purchaseDate: string;
  customerName: string;
  warrantyPeriod: string;
  inspectionHistory: {
    date: string;
    type: string;
    technician: string;
    status: string;
  }[];
}

export interface ExistingJewellerySubmission {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  billNumber?: string;
  purchaseDate?: string;
  description: string;
  metalType: string;
  purity: string;
  estimatedWeightGrams: number;
  hasBill: boolean;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_INFO';
  staffNotes?: string;
  submittedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  purity: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
  };
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'STORE_PAYMENT';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  status: 'PLACED' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  }[];
}
