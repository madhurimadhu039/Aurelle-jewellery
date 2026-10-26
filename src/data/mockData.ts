import { Product, MetalRateData, Scheme, PayDueRecord, LedgerEntry, HeirloomPassport, ExistingJewellerySubmission } from '../types';

export const INITIAL_RATES: MetalRateData = {
  gold22k: 8455,
  gold24k: 9205,
  silver1g: 102,
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
  isLive: true,
  provider: 'IBJA Authorized Benchmark (Aurelle Live Feed)',
  currency: 'INR',
  goldChange24h: 38.5,
  silverChange24h: 1.2,
  city: 'Mumbai / Pan India Standard',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'aur-001',
    name: 'Royal Solitaire Diamond Ring',
    sku: 'AUR-RNG-001',
    category: 'Rings',
    description: 'An exquisite hand-set 1.50 carat VVS1 solitaire diamond nestled in a 18K solid yellow gold band with pavé micro-diamonds along the shank.',
    price: 128000,
    originalPrice: 142000,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80'
    ],
    material: 'Yellow Gold & Solitaire Diamond',
    purity: '18K',
    weightGrams: 4.8,
    diamondCarat: 1.5,
    diamondClarity: 'VVS1 / E-F Color',
    gemstone: 'Natural Conflict-free Diamond',
    stock: 7,
    style: 'Solitaire Classic',
    occasion: ['Engagement', 'Anniversary', 'Bridal', 'Luxury Daily'],
    isFeatured: true,
    isNewArrival: false,
    isBridal: true,
    rating: 4.9,
    reviewsCount: 38,
    dimensions: 'Band width 2.2mm, Crown height 5.8mm',
    careInstructions: [
      'Store in provided velvet presentation case',
      'Clean periodically using warm soapy water and soft brush',
      'Complimentary lifetime ultrasonic cleaning at Aurelle boutiques'
    ],
    certification: 'IGI Certified & BIS Hallmarked'
  },
  {
    id: 'aur-002',
    name: 'Eternal Diamond Choker Necklace',
    sku: 'AUR-NCK-002',
    category: 'Necklaces',
    description: 'A breathtaking cascade of brilliant-cut diamonds handcrafted in luminous 18K white gold. Designed to rest gracefully on the collarbone for grand galas and weddings.',
    price: 245000,
    originalPrice: 275000,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
    ],
    material: '18K White Gold with Natural Diamonds',
    purity: '18K',
    weightGrams: 28.4,
    diamondCarat: 4.2,
    diamondClarity: 'VS / G-H Color',
    gemstone: 'Diamonds',
    stock: 3,
    style: 'Royal Gala Choker',
    occasion: ['Bridal', 'Red Carpet', 'Reception'],
    isFeatured: true,
    isNewArrival: true,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 19,
    dimensions: 'Length 16 inches + adjustable gold chain link',
    careInstructions: [
      'Keep away from direct contact with perfume and hairspray',
      'Store flat in original Aurelle heirloom box'
    ],
    certification: 'SGL Certified & BIS Hallmarked'
  },
  {
    id: 'aur-003',
    name: 'Golden Heritage Chandbali Earrings',
    sku: 'AUR-EAR-003',
    category: 'Earrings',
    description: 'Traditional 22K yellow gold chandbali earrings featuring intricate filigree lace work, South Sea pearl drops, and rubies inspired by royal Deccan courts.',
    price: 98000,
    originalPrice: 108000,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'
    ],
    material: '22K Hallmarked Gold',
    purity: '22K',
    weightGrams: 14.2,
    gemstone: 'Natural Burmese Rubies & Seed Pearls',
    stock: 9,
    style: 'Heritage Antique',
    occasion: ['Festive', 'Wedding', 'Family Heirloom'],
    isFeatured: true,
    isNewArrival: false,
    isBridal: true,
    rating: 4.8,
    reviewsCount: 42,
    dimensions: 'Drop length 52mm, Width 30mm',
    careInstructions: [
      'Avoid dipping pearls into ultrasonic chemical baths',
      'Wipe gently with soft cotton cloth after wearing'
    ],
    certification: 'BIS 916 Hallmarked'
  },
  {
    id: 'aur-004',
    name: 'Graceful Floral Diamond Bracelet',
    sku: 'AUR-BRC-004',
    category: 'Bracelets',
    description: 'Intricately articulated links woven in 18K yellow gold, each crowned with brilliant cluster petals. Secured with an invisible double-lock safety clasp.',
    price: 175000,
    originalPrice: 190000,
    images: [
      'https://images.unsplash.com/photo-1611591475155-4284fa2c2e7f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80'
    ],
    material: '18K Yellow Gold with Diamonds',
    purity: '18K',
    weightGrams: 18.6,
    diamondCarat: 2.1,
    diamondClarity: 'SI-VVS / F Color',
    gemstone: 'Diamonds',
    stock: 5,
    style: 'Modern Tennis Flow',
    occasion: ['Cocktail', 'Luxury Daily', 'Anniversary'],
    isFeatured: true,
    isNewArrival: true,
    isBridal: false,
    rating: 4.9,
    reviewsCount: 27,
    dimensions: 'Length 7.2 inches, Standard wrist fit',
    careInstructions: ['Double lock check recommended before wearing'],
    certification: 'IGI Certified & BIS Hallmarked'
  },
  {
    id: 'aur-005',
    name: 'Imperial 22K Gold Heritage Bangles (Set of 2)',
    sku: 'AUR-BNG-005',
    category: 'Bangles',
    description: 'A majestic pair of handcrafted 22-carat gold broad bangles featuring Nakshi handcrafted deities and floral motifs crafted by Master Guild Artisans.',
    price: 215000,
    originalPrice: 230000,
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611591475155-4284fa2c2e7f?auto=format&fit=crop&w=900&q=80'
    ],
    material: 'Pure 22K Solid Gold',
    purity: '22K',
    weightGrams: 32.5,
    stock: 4,
    style: 'Temple Nakshi Craft',
    occasion: ['Bridal', 'Godh Bharai', 'Diwali / Dhanteras'],
    isFeatured: true,
    isNewArrival: false,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 31,
    dimensions: 'Size 2.6 (Inside Diameter 60mm)',
    careInstructions: ['Keep in velvet roll to prevent surface friction'],
    certification: 'BIS 916 Hallmark Guaranteed'
  },
  {
    id: 'aur-006',
    name: 'Celestial Dewdrop Diamond Pendant',
    sku: 'AUR-PND-006',
    category: 'Pendants',
    description: 'A captivating pear-shaped solitaire haloed by sparkling micropavé stones suspended from an 18K rose gold chain.',
    price: 64000,
    originalPrice: 72000,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    material: '18K Rose Gold & Diamond',
    purity: '18K',
    weightGrams: 3.6,
    diamondCarat: 0.75,
    diamondClarity: 'VVS2 / G Color',
    gemstone: 'Diamonds',
    stock: 12,
    style: 'Modern Minimalist',
    occasion: ['Everyday Elegance', 'Birthday Gift', 'Office Chic'],
    isFeatured: false,
    isNewArrival: true,
    isBridal: false,
    rating: 4.7,
    reviewsCount: 14,
    dimensions: 'Pendant drop 18mm, 18-inch chain included',
    careInstructions: ['Ultrasonic cleaning safe'],
    certification: 'IGI Authenticated'
  },
  {
    id: 'aur-007',
    name: 'Aadya Modern Diamond Mangalsutra',
    sku: 'AUR-MNG-007',
    category: 'Mangalsutras',
    description: 'Traditional auspicious black beads blended with a geometric cluster of brilliant diamonds crafted in 18K yellow gold, reimagined for the contemporary woman.',
    price: 89000,
    originalPrice: 99000,
    images: [
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    material: '18K Gold, Natural Black Beads & Diamond',
    purity: '18K',
    weightGrams: 6.2,
    diamondCarat: 0.65,
    stock: 8,
    style: 'Contemporary Nuptial',
    occasion: ['Daily Nuptial', 'Anniversary', 'Bridal'],
    isFeatured: true,
    isNewArrival: true,
    isBridal: true,
    rating: 4.9,
    reviewsCount: 52,
    dimensions: 'Length 18 inches with adjustment loop',
    certification: 'BIS Hallmark & SGL Diamond Guarantee'
  },
  {
    id: 'aur-008',
    name: 'The Empress Emerald & Diamond Royal Suite',
    sku: 'AUR-BRD-008',
    category: 'Bridal Jewellery',
    description: 'A museum-calibre bridal grand ensemble featuring a statement choker necklace, chandelier earrings, maang tikka, and hathphool set with Zambian emeralds and uncut Polki diamonds.',
    price: 580000,
    originalPrice: 650000,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    material: '22K Gold, Zambian Emeralds, Polki & South Sea Pearls',
    purity: '22K',
    weightGrams: 110.5,
    diamondCarat: 8.5,
    gemstone: 'Certified Zambian Emeralds & Uncut Polki',
    stock: 2,
    style: 'Imperial Royal Heirloom',
    occasion: ['Wedding Day', 'Royal Reception', 'Bridal Troussaeu'],
    isFeatured: true,
    isNewArrival: false,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 16,
    dimensions: 'Full 4-piece Bridal Set with custom fitted mahogany chest',
    careInstructions: ['Private vault storage and annual guild inspection included for 5 years'],
    certification: 'IGI Gemological Certificate & BIS 916 Hallmark'
  }
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 'swarna-nidhi-11',
    name: 'Swarna Nidhi Savings Scheme',
    tagline: 'Pay 10 Installments, Aurelle Pays the 11th Month!',
    durationMonths: 11,
    monthlyOptions: [5000, 10000, 20000, 50000, 100000],
    bonusPercentage: 100, // 1 month bonus equivalent
    benefits: [
      '100% of 11th installment bonus contributed by Aurelle',
      'Zero making charges up to 18% on your redemption jewellery purchase',
      'Lock in gold weight at the lowest prevailing rate during the scheme period',
      'Free insured delivery of your selected jewellery on maturity',
      'Full flexibility to redeem across all collections: Gold, Diamond, or Polki'
    ],
    terms: [
      'Payments must be remitted by the 10th of every calendar month',
      'Valid for 11 months from date of initial enrollment',
      'Redeemable exclusively for jewellery at Aurelle offline boutiques or online portal',
      'No cash refunds; redemption for precious jewellery only'
    ],
    minAmount: 5000
  },
  {
    id: 'ratna-samriddhi-6',
    name: 'Ratna Samriddhi Diamond Scheme',
    tagline: 'Bespoke Diamond Savings with 20% Extra Jewellery Value',
    durationMonths: 6,
    monthlyOptions: [10000, 25000, 50000, 100000],
    bonusPercentage: 20,
    benefits: [
      'Guaranteed 20% extra voucher on total accumulated deposits towards diamond jewellery',
      'Complimentary Heirloom Passport & laser inscription on your redeemed diamond',
      'Access to exclusive VIP previews of high-jewellery novelties',
      'Personal diamond concierge assigned for styling & selection'
    ],
    terms: [
      'Dedicated strictly towards certified diamond and solitaire creations',
      '6 consecutive monthly contributions required for full bonus eligibility'
    ],
    minAmount: 10000
  }
];

export const MOCK_PAY_DUES: PayDueRecord[] = [
  {
    id: 'pd-101',
    billNumber: 'AUR-INV-2026-8941',
    customerName: 'Madhurima Sharma',
    customerPhone: '9876543210',
    customerEmail: 'madhurima@example.com',
    totalAmount: 128000,
    amountPaid: 80000,
    balanceDue: 48000,
    dueDate: '2026-11-15',
    status: 'PARTIALLY_PAID',
    orderSummary: 'Royal Solitaire Diamond Ring (Order #AUR-9842)',
    paymentsHistory: [
      {
        id: 'pay-001',
        amount: 80000,
        date: '2026-10-10',
        paymentMode: 'UPI (Ref: UPI/261010/893)',
        receiptNumber: 'RCP-26-0811'
      }
    ]
  },
  {
    id: 'pd-102',
    billNumber: 'AUR-INV-2026-9023',
    customerName: 'Aarav Singhania',
    customerPhone: '9811223344',
    customerEmail: 'aarav@example.com',
    totalAmount: 98000,
    amountPaid: 0,
    balanceDue: 98000,
    dueDate: '2026-11-05',
    status: 'PENDING',
    orderSummary: 'Golden Heritage Chandbali Earrings (Order #AUR-9901)',
    paymentsHistory: []
  }
];

export const MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'led-001',
    date: '2026-08-15',
    refNumber: 'TXN-88210',
    type: 'PURCHASE',
    description: 'Purchase: Royal Solitaire Diamond Ring (SKU: AUR-RNG-001)',
    debit: 128000,
    credit: 0,
    balance: 128000
  },
  {
    id: 'led-002',
    date: '2026-08-15',
    refNumber: 'PAY-44120',
    type: 'PAYMENT',
    description: 'Advance Booking Payment via Card',
    debit: 0,
    credit: 80000,
    balance: 48000
  },
  {
    id: 'led-003',
    date: '2026-09-01',
    refNumber: 'SCH-10029',
    type: 'SCHEME_INSTALLMENT',
    description: 'Swarna Nidhi Scheme Installment #1 Credit',
    debit: 0,
    credit: 10000,
    balance: 38000
  },
  {
    id: 'led-004',
    date: '2026-10-01',
    refNumber: 'SCH-10045',
    type: 'SCHEME_INSTALLMENT',
    description: 'Swarna Nidhi Scheme Installment #2 Credit',
    debit: 0,
    credit: 10000,
    balance: 28000
  }
];

export const MOCK_HEIRLOOM_PASSPORT: HeirloomPassport = {
  id: 'pass-001',
  passportId: 'AUR-PASSPORT-2026-0098',
  productName: 'Royal Solitaire Diamond Ring',
  sku: 'AUR-RNG-001',
  serialNumber: 'AUR-SOL-882194',
  hallmarkUid: 'HUID-MH-9182374',
  purity: '18K (750 Hallmark)',
  metalWeight: '4.80 grams',
  gemstoneDetails: '1.50 Ct Natural Solitaire (VVS1 / E-Color)',
  purchaseDate: '2026-08-15',
  customerName: 'Madhurima Sharma',
  warrantyPeriod: 'Lifetime Authenticity Guarantee',
  inspectionHistory: [
    {
      date: '2026-08-15',
      type: 'Initial Guild Quality & Prong Inspection',
      technician: 'Master Jeweller V. Mehta',
      status: 'Pristine'
    },
    {
      date: '2026-10-12',
      type: 'Ultrasonic Luster Refresh & Prong Tension Check',
      technician: 'Aurelle Flagship Boutique, Mumbai',
      status: 'Certified Flawless'
    }
  ]
};

export const MOCK_SUBMISSIONS: ExistingJewellerySubmission[] = [
  {
    id: 'sub-001',
    customerName: 'Pooja Kapoor',
    phone: '9920391822',
    email: 'pooja.k@example.com',
    billNumber: 'VINT-BILL-2018-44',
    purchaseDate: '2018-11-04',
    description: 'Ancestral 22K Gold Antique Choker with uncut stones',
    metalType: 'Yellow Gold',
    purity: '22K',
    estimatedWeightGrams: 42.0,
    hasBill: true,
    status: 'VERIFIED',
    staffNotes: 'Purity verified via XRF Assay at 91.6%. Valuation quote issued for exchange credit ₹3,48,000.',
    submittedAt: '2026-10-18'
  }
];
