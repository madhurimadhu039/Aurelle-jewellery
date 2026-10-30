import { Product, MetalRateData, Scheme, PayDueRecord, LedgerEntry, HeirloomPassport, ExistingJewellerySubmission } from '../types';

export const INITIAL_RATES: MetalRateData = {
  gold22k: 13195,
  gold24k: 14395,
  silver1g: 165,
  lastUpdated: '',
  isLive: true,
  provider: 'National Bullion Market Standard (IBJA Benchmark)',
  currency: 'INR',
  goldChange24h: 35.0,
  silverChange24h: 1.5,
  city: 'Mumbai / Pan India Standard',
  rateStatus: 'current',
  unit: '₹ per gram',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    "id": "aur-001",
    "name": "Royal Brilliant Solitaire Diamond Engagement Ring",
    "sku": "AUR-RNG-001",
    "category": "Rings",
    "description": "An exquisite hand-set 1.50 carat VVS1 solitaire natural diamond nestled in a 18K solid white gold band with pavé micro-diamonds along the shank.",
    "price": 128000,
    "originalPrice": 142000,
    "images": [
      "/images/editorial-ring.jpg"
    ],
    "material": "18K White Gold & Solitaire Diamond",
    "purity": "18K",
    "weightGrams": 4.8,
    "diamondCarat": 1.5,
    "diamondClarity": "VVS1 / E-F Color",
    "gemstone": "Natural Conflict-free Diamond",
    "stock": 7,
    "style": "Solitaire Classic",
    "occasion": [
      "Engagement",
      "Anniversary",
      "Luxury Daily"
    ],
    "isFeatured": true,
    "isNewArrival": false,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 38,
    "dimensions": "Band width 2.2mm, Crown height 5.8mm",
    "careInstructions": [
      "Store in provided velvet presentation case",
      "Clean periodically using warm soapy water and soft brush",
      "Complimentary lifetime ultrasonic cleaning at Aurelle boutiques"
    ],
    "certification": "IGI Certified & BIS Hallmarked"
  },
  {
    "id": "aur-002",
    "name": "Eternal Diamond Cascade Choker Necklace",
    "sku": "AUR-NCK-002",
    "category": "Necklaces",
    "description": "A breathtaking cascade of brilliant-cut and marquise diamonds handcrafted in luminous 18K white gold. Designed to rest gracefully on the collarbone for grand galas and soirees.",
    "price": 245000,
    "originalPrice": 275000,
    "images": [
      "/images/diamond-cascade-choker.jpg"
    ],
    "material": "18K White Gold with Natural Diamonds",
    "purity": "18K",
    "weightGrams": 28.4,
    "diamondCarat": 4.2,
    "diamondClarity": "VS / G-H Color",
    "gemstone": "Natural Diamonds",
    "stock": 3,
    "style": "Royal Gala Choker",
    "occasion": [
      "Red Carpet",
      "Cocktail",
      "Anniversary Gala"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 5,
    "reviewsCount": 19,
    "dimensions": "Length 16 inches + adjustable gold chain link",
    "careInstructions": [
      "Keep away from direct contact with perfume and hairspray",
      "Store flat in original Aurelle heirloom box"
    ],
    "certification": "SGL Certified & BIS Hallmarked"
  },
  {
    "id": "aur-003",
    "name": "Golden Heritage 22K Pure Gold Chandbali Jhumkis",
    "sku": "AUR-EAR-003",
    "category": "Earrings",
    "description": "Traditional 22K pure yellow gold chandbali jhumkas featuring handcrafted antique filigree lace work, crescent motifs, and dangling gold droplet bells inspired by royal Deccan courts.",
    "price": 98000,
    "originalPrice": 108000,
    "images": [
      "/images/gold-chandbali-jhumkis.jpg"
    ],
    "material": "22K Hallmarked Solid Yellow Gold",
    "purity": "22K",
    "weightGrams": 16.4,
    "stock": 9,
    "style": "Heritage Antique",
    "occasion": [
      "Festive",
      "Traditional",
      "Temple Puja",
      "Family Heirloom"
    ],
    "isFeatured": true,
    "isNewArrival": false,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 42,
    "dimensions": "Drop length 52mm, Width 30mm",
    "careInstructions": [
      "Store in provided velvet presentation case",
      "Wipe gently with soft cotton cloth after wearing"
    ],
    "certification": "BIS 916 Hallmarked"
  },
  {
    "id": "aur-004",
    "name": "Graceful Modern Diamond Tennis Flow Bracelet",
    "sku": "AUR-BRC-004",
    "category": "Bracelets",
    "description": "Intricately articulated links woven in 18K yellow gold, each crowned with brilliant cluster petals. Secured with an invisible double-lock safety clasp.",
    "price": 175000,
    "originalPrice": 190000,
    "images": [
      "/images/bracelet-2.jpg"
    ],
    "material": "18K Yellow Gold with Diamonds",
    "purity": "18K",
    "weightGrams": 18.6,
    "diamondCarat": 2.1,
    "diamondClarity": "SI-VVS / F Color",
    "gemstone": "Diamonds",
    "stock": 5,
    "style": "Modern Tennis Flow",
    "occasion": [
      "Cocktail",
      "Luxury Daily",
      "Anniversary"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 27,
    "dimensions": "Length 7.2 inches, Standard wrist fit",
    "careInstructions": [
      "Double lock check recommended before wearing"
    ],
    "certification": "IGI Certified & BIS Hallmarked"
  },
  {
    "id": "aur-005",
    "name": "Imperial 22K Solid Gold Heritage Bangles (Pair)",
    "sku": "AUR-BNG-005",
    "category": "Bangles",
    "description": "A majestic pair of handcrafted 22-carat yellow gold bangles featuring traditional Nakshi repoussé filigree and high-polish gold ridges crafted by Master Guild Artisans.",
    "price": 215000,
    "originalPrice": 230000,
    "images": [
      "/images/gold-bangles-stack.jpg"
    ],
    "material": "Pure 22K Solid Yellow Gold",
    "purity": "22K",
    "weightGrams": 32.5,
    "stock": 4,
    "style": "Temple Nakshi Craft",
    "occasion": [
      "Festive",
      "Godh Bharai",
      "Diwali / Dhanteras"
    ],
    "isFeatured": true,
    "isNewArrival": false,
    "isBridal": false,
    "rating": 5,
    "reviewsCount": 31,
    "dimensions": "Size 2.6 (Inside Diameter 60mm)",
    "careInstructions": [
      "Keep in velvet roll to prevent surface friction"
    ],
    "certification": "BIS 916 Hallmark Guaranteed"
  },
  {
    "id": "aur-006",
    "name": "Celestial Dewdrop Pear Solitaire Diamond Pendant",
    "sku": "AUR-PND-006",
    "category": "Pendants",
    "description": "A captivating 1.2-carat pear-shaped natural solitaire diamond haloed by sparkling micropavé stones suspended from an 18K white gold chain.",
    "price": 64000,
    "originalPrice": 72000,
    "images": [
      "/images/diamond-dewdrop-pendant.jpg"
    ],
    "material": "18K White Gold & Natural Diamond",
    "purity": "18K",
    "weightGrams": 3.6,
    "diamondCarat": 1.2,
    "diamondClarity": "VVS2 / G Color",
    "gemstone": "Diamonds",
    "stock": 12,
    "style": "Modern Minimalist",
    "occasion": [
      "Daily Wear",
      "Everyday Elegance",
      "Office Chic"
    ],
    "isFeatured": false,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.8,
    "reviewsCount": 14,
    "dimensions": "Pendant drop 18mm, 18-inch chain included",
    "careInstructions": [
      "Ultrasonic cleaning safe"
    ],
    "certification": "IGI Authenticated"
  },
  {
    "id": "aur-007",
    "name": "Aadya Modern Cushion Solitaire Diamond Pendant",
    "sku": "AUR-PND-007",
    "category": "Pendants",
    "description": "A geometric cushion-cut natural diamond framed in micro-pavé diamonds and crafted in 18K white gold for subtle luxury.",
    "price": 89000,
    "originalPrice": 99000,
    "images": [
      "/images/diamond-cushion-pendant.jpg"
    ],
    "material": "18K White Gold with Natural Diamonds",
    "purity": "18K",
    "weightGrams": 4.2,
    "diamondCarat": 0.95,
    "stock": 8,
    "style": "Contemporary Nuptial",
    "occasion": [
      "Anniversary",
      "Luxury Daily",
      "Cocktail"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 52,
    "dimensions": "Length 18 inches with adjustment loop",
    "certification": "BIS Hallmark & SGL Diamond Guarantee"
  },
  {
    "id": "aur-008",
    "name": "The Empress Royal 22K Temple Gold Ruby Choker Ensemble",
    "sku": "AUR-BRD-008",
    "category": "Bridal Jewellery",
    "description": "A museum-calibre bridal grand ensemble featuring a statement royal temple choker necklace and matching stud earrings set with natural Burmese ruby cabochons.",
    "price": 580000,
    "originalPrice": 650000,
    "images": [
      "/images/gold-ruby-necklace.jpg"
    ],
    "material": "22K Solid Gold with Natural Burmese Rubies",
    "purity": "22K",
    "weightGrams": 75,
    "gemstone": "Natural Burmese Rubies",
    "stock": 2,
    "style": "Imperial Royal Heirloom",
    "occasion": [
      "Wedding Day",
      "Royal Reception",
      "Bridal Troussaeu"
    ],
    "isFeatured": true,
    "isNewArrival": false,
    "isBridal": true,
    "rating": 5,
    "reviewsCount": 16,
    "dimensions": "Statement choker necklace with matching earrings",
    "careInstructions": [
      "Private vault storage and annual guild inspection included for 5 years"
    ],
    "certification": "BIS 916 Hallmark Guaranteed"
  },
  {
    "id": "aur-009",
    "name": "Aurelle 22K Pure Gold Blossom Stud Earrings",
    "sku": "AUR-EAR-009",
    "category": "Earrings",
    "description": "Delicately sculpted pure 22K yellow gold floral studs with six radiant polished petals and a granulated gold center dome, designed for everyday comfort and warm golden radiance.",
    "price": 38500,
    "originalPrice": 42000,
    "images": [
      "/images/gold-blossom-studs.jpg"
    ],
    "material": "22K Solid Yellow Gold",
    "purity": "22K",
    "weightGrams": 3.2,
    "stock": 14,
    "style": "Modern Minimalist",
    "occasion": [
      "Daily Wear",
      "Everyday Luxury",
      "Office Chic",
      "Gifting"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.8,
    "reviewsCount": 24,
    "dimensions": "Diameter 10mm, Secure screw back",
    "certification": "BIS 916 Hallmark"
  },
  {
    "id": "aur-010",
    "name": "Aurelle Halo Solitaire Diamond Cushion Ring",
    "sku": "AUR-RNG-010",
    "category": "Rings",
    "description": "A slender band crowned with a brilliant round diamond encircled by a delicate pavé halo, perfect for subtle everyday glamour and stacking.",
    "price": 44500,
    "originalPrice": 48000,
    "images": [
      "/images/diamond-halo-ring.jpg"
    ],
    "material": "18K White Gold with Natural Diamonds",
    "purity": "18K",
    "weightGrams": 2.2,
    "diamondCarat": 0.45,
    "diamondClarity": "VS-SI / F-G Color",
    "gemstone": "Natural Conflict-free Diamonds",
    "stock": 11,
    "style": "Modern Minimalist",
    "occasion": [
      "Daily Wear",
      "Everyday Elegance",
      "Anniversary"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 19,
    "dimensions": "Band width 1.8mm",
    "certification": "IGI Certified & BIS 750 Hallmark"
  },
  {
    "id": "aur-011",
    "name": "Aadya 22K Royal Temple Kasu Haar Necklace",
    "sku": "AUR-NCK-011",
    "category": "Necklaces",
    "description": "A magnificent traditional 22K pure yellow gold Kasu Mala necklace featuring handcrafted minted coins depicting Goddess Lakshmi, framed by antique Nakshi floral scrollwork.",
    "price": 345000,
    "originalPrice": 370000,
    "images": [
      "/images/gold-temple-necklace.jpg"
    ],
    "material": "22K Hallmarked Pure Yellow Gold",
    "purity": "22K",
    "weightGrams": 52,
    "stock": 4,
    "style": "Temple Nakshi Craft",
    "occasion": [
      "Festive",
      "Traditional",
      "Temple Puja",
      "Heritage Gala"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 28,
    "dimensions": "Length 22 inches, broad temple kasu necklace",
    "careInstructions": [
      "Store in provided velvet pouch",
      "Wipe with soft cotton cloth"
    ],
    "certification": "BIS 916 Hallmark"
  },
  {
    "id": "aur-012",
    "name": "Aurelle 22K Royal Solid Gold Lion-Head Singhamukha Kada",
    "sku": "AUR-BNG-012",
    "category": "Bangles",
    "description": "An opulent 22-carat yellow gold heavy solid kada pair featuring high-relief handcrafted royal lion-head finials and antique chased floral repoussé craftsmanship.",
    "price": 275000,
    "originalPrice": 295000,
    "images": [
      "/images/gold-royal-kada.jpg"
    ],
    "material": "22K Solid Yellow Gold",
    "purity": "22K",
    "weightGrams": 42,
    "stock": 5,
    "style": "Heritage Antique",
    "occasion": [
      "Diwali",
      "Dhanteras",
      "Royal Festive"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 5,
    "reviewsCount": 21,
    "dimensions": "Size 2.6 (Inside Diameter 60mm), Solid gold heavy kada",
    "careInstructions": [
      "Avoid sudden impacts",
      "Keep in flannel velvet roll"
    ],
    "certification": "BIS 916 Hallmark Guaranteed"
  },
  {
    "id": "aur-013",
    "name": "Aurelle 24K 999 Pure Gold Lakshmi Bullion Ingot Pendant",
    "sku": "AUR-PND-013",
    "category": "Pendants",
    "description": "An auspicious 24K 999 pure yellow gold minted bullion medallion featuring Goddess Lakshmi seated on a lotus, set within an ornate 22K gold filigree border on a 22K gold rope chain.",
    "price": 89000,
    "originalPrice": 95000,
    "images": [
      "/images/gold-lakshmi-pendant.jpg"
    ],
    "material": "24K 999 Pure Bullion with 22K Gold Bezel & Rope Chain",
    "purity": "24K",
    "weightGrams": 10,
    "stock": 18,
    "style": "Temple Nakshi Craft",
    "occasion": [
      "Akshaya Tritiya",
      "Dhanteras",
      "Auspicious Gifting"
    ],
    "isFeatured": false,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 47,
    "dimensions": "Drop length 28mm, Width 18mm",
    "careInstructions": [
      "Pure gold is soft; handle with care and keep in sealed pouch"
    ],
    "certification": "MMTC-PAMP Assay Certified & BIS Hallmarked"
  },
  {
    "id": "aur-014",
    "name": "Imperial Solitaire Diamond Stud Earrings (1.00ctw)",
    "sku": "AUR-EAR-014",
    "category": "Earrings",
    "description": "A dazzling pair of certified 0.50-carat each round brilliant-cut diamonds, hand-set in four-prong 18K white gold baskets with double-notched security posts.",
    "price": 115000,
    "originalPrice": 128000,
    "images": [
      "/images/diamond-solitaire-studs.jpg"
    ],
    "material": "18K White Gold with Solitaire Diamonds",
    "purity": "18K",
    "weightGrams": 3.2,
    "diamondCarat": 1,
    "diamondClarity": "VVS2 / F Color",
    "gemstone": "Natural Conflict-free Diamonds",
    "stock": 6,
    "style": "Solitaire Classic",
    "occasion": [
      "Cocktail",
      "Anniversary",
      "Luxury Daily"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 5,
    "reviewsCount": 33,
    "dimensions": "Diamond diameter 5.1mm each",
    "careInstructions": [
      "Complimentary lifetime ultrasonic cleaning at Aurelle boutiques"
    ],
    "certification": "IGI Certified & BIS Hallmarked"
  },
  {
    "id": "aur-015",
    "name": "Aurelle Signature Brilliant Diamond Eternity Ring",
    "sku": "AUR-RNG-015",
    "category": "Rings",
    "description": "A continuous unbroken circle of hand-selected round brilliant diamonds set in an 18K white gold shared-prong gallery.",
    "price": 68000,
    "originalPrice": 76000,
    "images": [
      "/images/diamond-eternity-band.jpg"
    ],
    "material": "18K White Gold with Diamonds",
    "purity": "18K",
    "weightGrams": 3.4,
    "diamondCarat": 0.85,
    "diamondClarity": "VS / G-H Color",
    "gemstone": "Natural Diamonds",
    "stock": 9,
    "style": "Modern Minimalist",
    "occasion": [
      "Anniversary",
      "Cocktail",
      "Luxury Daily"
    ],
    "isFeatured": false,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 22,
    "dimensions": "Band width 2.4mm",
    "careInstructions": [
      "Avoid wearing while lifting heavy weights"
    ],
    "certification": "SGL Certified & BIS Hallmarked"
  },
  {
    "id": "aur-016",
    "name": "Maharani Heavy 22K Kundan Polki Bridal Choker & Rani Haar Set",
    "sku": "AUR-BRD-016",
    "category": "Bridal Jewellery",
    "description": "A grand, heavy 135-gram imperial royal bridal set comprising a wide 7-tier Kundan Polki choker, matching layered long Rani Haar, chandelier earrings, and maang tikka with deep green Russian emerald drops and Basra pearls.",
    "price": 695000,
    "originalPrice": 780000,
    "images": [
      "/images/wedding-polki-choker.jpg"
    ],
    "material": "22K Solid Gold, Uncut Polki Diamonds, Russian Emeralds & Pearls",
    "purity": "22K",
    "weightGrams": 135,
    "diamondCarat": 12.5,
    "gemstone": "Certified Uncut Polki Diamonds & Natural Emeralds",
    "stock": 2,
    "style": "Imperial Royal Heirloom",
    "occasion": [
      "Wedding Day",
      "Grand Bridal Trousseau",
      "Royal Wedding"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": true,
    "rating": 5,
    "reviewsCount": 18,
    "dimensions": "Full 5-piece Grand Bridal Set in bespoke mahogany trousseau chest",
    "careInstructions": [
      "Private vault storage and annual guild inspection included for 5 years"
    ],
    "certification": "IGI Gemological Certificate & BIS 916 Hallmark"
  },
  {
    "id": "aur-017",
    "name": "Royal 22K Temple Nakshi Heavy Bridal Kamarbandh (Waistbelt)",
    "sku": "AUR-BRD-017",
    "category": "Bridal Jewellery",
    "description": "A majestic 98-gram pure 22K gold bridal waistband featuring intricate high-relief Nakshi carving of Goddess Lakshmi flanked by dancing apsaras, peacocks, and hanging gold ghungroos.",
    "price": 485000,
    "originalPrice": 540000,
    "images": [
      "/images/wedding-temple-kamarbandh.jpg"
    ],
    "material": "Pure 22K Solid Gold with Natural Burmese Rubies",
    "purity": "22K",
    "weightGrams": 98,
    "stock": 3,
    "style": "Temple Nakshi Craft",
    "occasion": [
      "Wedding Day",
      "Bridal Troussaeu",
      "South Indian Wedding"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": true,
    "rating": 5,
    "reviewsCount": 14,
    "dimensions": "Adjustable length 28-36 inches with solid gold chain loops",
    "careInstructions": [
      "Store flat in custom velvet-lined bridal box"
    ],
    "certification": "BIS 916 Hallmark Guaranteed"
  },
  {
    "id": "aur-018",
    "name": "Imperial 22K Solid Gold Heavy Bridal Broad Kada Bangles (Pair)",
    "sku": "AUR-BRD-018",
    "category": "Bridal Jewellery",
    "description": "An imposing pair of handcrafted 68-gram solid 22K gold heavy bridal kadas with elephant-head clasp finials, antique repoussé filigree, and ruby cabochon highlights.",
    "price": 395000,
    "originalPrice": 435000,
    "images": [
      "/images/gold-antique-bangles.jpg"
    ],
    "material": "Pure 22K Solid Gold with Natural Rubies",
    "purity": "22K",
    "weightGrams": 68,
    "stock": 4,
    "style": "Temple Nakshi Craft",
    "occasion": [
      "Wedding Day",
      "Bridal Troussaeu",
      "Sangeet"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": true,
    "rating": 4.9,
    "reviewsCount": 20,
    "dimensions": "Size 2.6 (Inside Diameter 60mm), Pair weight 68 grams",
    "careInstructions": [
      "Wipe clean with soft lint-free flannel"
    ],
    "certification": "BIS 916 Hallmark Guaranteed"
  },
  {
    "id": "aur-019",
    "name": "Devi 22K Gold Heavy Bridal Jhumkas & Matha Patti Set",
    "sku": "AUR-BRD-019",
    "category": "Bridal Jewellery",
    "description": "A grand 48.5-gram 22K gold bridal ensemble consisting of 3-tier grand chandelier jhumkas with pearl ear-chains and a royal floral Matha Patti adorned with seed pearls and rubies.",
    "price": 290000,
    "originalPrice": 320000,
    "images": [
      "/images/wedding-matha-patti.jpg"
    ],
    "material": "22K Hallmarked Gold with Basra Pearls & Rubies",
    "purity": "22K",
    "weightGrams": 48.5,
    "stock": 4,
    "style": "Imperial Royal Heirloom",
    "occasion": [
      "Wedding Day",
      "Mehendi",
      "Bridal Troussaeu"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": true,
    "rating": 4.9,
    "reviewsCount": 25,
    "dimensions": "Jhumka length 78mm; Matha Patti length 14 inches",
    "careInstructions": [
      "Keep pearls away from direct moisture and perfume"
    ],
    "certification": "BIS 916 Hallmark Guaranteed"
  },
  {
    "id": "aur-020",
    "name": "Aurelle 18K Minimalist Gold Paperclip Bracelet",
    "sku": "AUR-BRC-020",
    "category": "Bracelets",
    "description": "A sleek, featherlight Italian paperclip link chain bracelet in 18K solid yellow gold with a high-polish finish and lobster clasp.",
    "price": 32000,
    "originalPrice": 36000,
    "images": [
      "/images/bracelet-1.jpg"
    ],
    "material": "18K Yellow Gold",
    "purity": "18K",
    "weightGrams": 4.1,
    "stock": 15,
    "style": "Modern Minimalist",
    "occasion": [
      "Daily Wear",
      "Everyday Luxury",
      "Office Chic"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.8,
    "reviewsCount": 17,
    "dimensions": "Length 7.0 inches, adjustable",
    "careInstructions": [
      "Safe for everyday wear and handwashing"
    ],
    "certification": "BIS 750 Hallmark"
  },
  {
    "id": "aur-021",
    "name": "Aurelle Cushion Pink Gemstone Rose Gold Ring",
    "sku": "AUR-RNG-021",
    "category": "Rings",
    "description": "An elegant handcrafted 18K rose gold cocktail ring crowned with a vibrant cushion-cut pink tourmaline gem haloed by micropavé diamonds.",
    "price": 36500,
    "originalPrice": 41000,
    "images": [
      "/images/rose-gold-cushion-ring.jpg"
    ],
    "material": "18K Rose Gold with Tourmaline & Diamonds",
    "purity": "18K",
    "weightGrams": 2.6,
    "diamondCarat": 0.15,
    "diamondClarity": "SI / G-H Color",
    "gemstone": "Pink Tourmaline",
    "stock": 16,
    "style": "Modern Minimalist",
    "occasion": [
      "Daily Wear",
      "Everyday Luxury",
      "Office Chic"
    ],
    "isFeatured": false,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.7,
    "reviewsCount": 12,
    "dimensions": "Band width 1.6mm",
    "careInstructions": [
      "Ultrasonic cleaning safe"
    ],
    "certification": "IGI Certified & BIS 750 Hallmark"
  },
  {
    "id": "aur-022",
    "name": "Aurelle 24K 999 Fine Gold Minted Bullion Bars",
    "sku": "AUR-BAR-022",
    "category": "Pendants",
    "description": "Certified 24K 999.9 pure investment-grade minted gold bullion bars with tamper-proof assay certification and individual serial numbering.",
    "price": 145000,
    "originalPrice": 152000,
    "images": [
      "/images/gold-bullion-bars.jpg"
    ],
    "material": "24K 999.9 Fine Investment Gold",
    "purity": "24K",
    "weightGrams": 10,
    "stock": 25,
    "style": "Bullion Mint",
    "occasion": [
      "Akshaya Tritiya",
      "Dhanteras",
      "Wealth Preservation",
      "Auspicious Gifting"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 5,
    "reviewsCount": 56,
    "dimensions": "Assay card 85mm x 54mm",
    "careInstructions": [
      "Keep in tamper-proof assay blister pack"
    ],
    "certification": "BIS 999 Hallmarked & LBMA Accredited Refinery"
  },
  {
    "id": "aur-023",
    "name": "Aurelle 22K Royal Emerald & Solitaire Diamond Collar Necklace",
    "sku": "AUR-NCK-023",
    "category": "Necklaces",
    "description": "A magnificent 22-carat yellow gold royal princess collar necklace featuring hand-carved floral filigree lace, brilliant conflict-free diamonds, and pear-cut Colombian emerald teardrops with delicate seed pearl droplets.",
    "price": 175000,
    "originalPrice": 195000,
    "images": [
      "/images/royal-emerald-gold-necklace.jpg"
    ],
    "material": "22K Solid Yellow Gold & Natural Emerald",
    "purity": "22K",
    "weightGrams": 24.5,
    "diamondCarat": 1.2,
    "diamondClarity": "VVS1 / E-F Color",
    "gemstone": "Natural Colombian Emerald & Conflict-Free Diamonds",
    "stock": 8,
    "style": "Royal Heritage Collar",
    "occasion": [
      "Royal Wedding",
      "Festive Gala",
      "Heirloom Ceremony"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 42,
    "dimensions": "Collar inner circumference 16 inches, Front drop 45mm",
    "careInstructions": [
      "Store in provided velvet presentation case",
      "Clean gently using a soft lint-free jewellery cloth"
    ],
    "certification": "BIS 916 Hallmark & IGI Gemstone Certificate"
  },
  {
    "id": "aur-024",
    "name": "Aurelle 22K Solid Gold Royal Filigree Cuff Bracelet",
    "sku": "AUR-BRC-024",
    "category": "Bracelets",
    "description": "A magnificent handcrafted 22K yellow gold broad cuff bracelet featuring traditional Indian lattice filigree and high-polish gold ridges with dual safety latch.",
    "price": 168000,
    "originalPrice": 182000,
    "images": [
      "/images/gold-cuff-bracelet.jpg"
    ],
    "material": "22K Solid Yellow Gold",
    "purity": "22K",
    "weightGrams": 22.4,
    "stock": 6,
    "style": "Temple Nakshi Craft",
    "occasion": [
      "Festive",
      "Diwali",
      "Heritage Gala"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 23,
    "dimensions": "Inner circumference 6.8 inches",
    "careInstructions": [
      "Store flat in provided velvet case"
    ],
    "certification": "BIS 916 Hallmark"
  },
  {
    "id": "aur-025",
    "name": "Aurelle 22K Royal Antique Hand-Carved Gold Ring",
    "sku": "AUR-RNG-025",
    "category": "Rings",
    "description": "A majestic solid 22K yellow gold royal statement band ring featuring deeply carved Nakshi repoussé floral scrollwork and ornamental foliage.",
    "price": 58000,
    "originalPrice": 64000,
    "images": [
      "/images/gold-royal-carved-ring.jpg"
    ],
    "material": "22K Solid Yellow Gold",
    "purity": "22K",
    "weightGrams": 8.5,
    "stock": 14,
    "style": "Heritage Antique",
    "occasion": [
      "Daily Wear",
      "Festive",
      "Everyday Luxury"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 5,
    "reviewsCount": 39,
    "dimensions": "Band width 7.5mm",
    "careInstructions": [
      "Safe for daily wear; clean with mild soapy water"
    ],
    "certification": "BIS 916 Hallmark"
  },
  {
    "id": "aur-026",
    "name": "Lumina Brilliant Cushion Solitaire Diamond Pendant",
    "sku": "AUR-PND-026",
    "category": "Pendants",
    "description": "An exceptional 0.95-carat cushion-cut natural diamond in a double four-prong basket with pavé diamond bail on 18K white gold link chain.",
    "price": 82000,
    "originalPrice": 91000,
    "images": [
      "/images/diamond-solitaire-ring.jpg"
    ],
    "material": "18K White Gold with Natural Diamond",
    "purity": "18K",
    "weightGrams": 3.8,
    "diamondCarat": 0.95,
    "gemstone": "Natural Diamond",
    "stock": 8,
    "style": "Modern Minimalist",
    "occasion": [
      "Anniversary",
      "Luxury Daily",
      "Cocktail"
    ],
    "isFeatured": false,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.9,
    "reviewsCount": 17,
    "dimensions": "Pendant drop 16mm, 18-inch chain included",
    "careInstructions": [
      "Ultrasonic cleaning safe"
    ],
    "certification": "IGI Certified & BIS 750 Hallmark"
  },
  {
    "id": "aur-027",
    "name": "Imperial Pavé Diamond Royal Flora Bangle",
    "sku": "AUR-BNG-027",
    "category": "Bangles",
    "description": "A stunning hinged oval bangle crafted in 18K rose gold encrusted with 2.40 carats of handset brilliant pavé diamonds in undulating scroll motifs.",
    "price": 195000,
    "originalPrice": 215000,
    "images": [
      "/images/diamond-pave-bangle.jpg"
    ],
    "material": "18K Rose Gold with Pavé Diamonds",
    "purity": "18K",
    "weightGrams": 21,
    "diamondCarat": 2.4,
    "diamondClarity": "VS / G-H Color",
    "gemstone": "Natural Diamonds",
    "stock": 5,
    "style": "Modern Tennis Flow",
    "occasion": [
      "Cocktail",
      "Anniversary",
      "Luxury Daily"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 5,
    "reviewsCount": 31,
    "dimensions": "Size 2.4, Oval wrist profile with push-button lock",
    "careInstructions": [
      "Double-lock check before wearing"
    ],
    "certification": "IGI Certified & BIS 750 Hallmark"
  },
  {
    "id": "aur-028",
    "name": "Aurelle 18K Gold Layered Paperclip Chain & Medallion Pendant",
    "sku": "AUR-PND-028",
    "category": "Pendants",
    "description": "A chic multi-strand 18K yellow gold necklace combining delicate ball chain, elongated paperclip links, and an embossed sunburst gold medallion pendant.",
    "price": 28500,
    "originalPrice": 32000,
    "images": [
      "/images/gold-layered-pendant.jpg"
    ],
    "material": "18K Yellow Gold",
    "purity": "18K",
    "weightGrams": 3.5,
    "stock": 22,
    "style": "Modern Minimalist",
    "occasion": [
      "Daily Wear",
      "Everyday Luxury",
      "Office Chic",
      "Gifting"
    ],
    "isFeatured": true,
    "isNewArrival": true,
    "isBridal": false,
    "rating": 4.8,
    "reviewsCount": 29,
    "dimensions": "Multi-layer 16 and 18 inches with 2-inch extension",
    "careInstructions": [
      "Safe for everyday wear and handwashing"
    ],
    "certification": "BIS 750 Hallmark"
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
