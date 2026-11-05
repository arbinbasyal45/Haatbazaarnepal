/**
 * Default Seed Data for HaatBazaar
 * Provides high quality initial catalog with authentic Nepali brands, electronics, handicrafts, clothing, groceries, and demo accounts.
 */

import { ProductCategory, Product, PromotionalBanner, Coupon, WebsiteSettings } from '../types';

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat-1', name: 'Electronics', slug: 'electronics', iconName: 'Cpu', displayOrder: 1, featured: true, imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-2', name: 'Mobile Phones', slug: 'mobile-phones', iconName: 'Smartphone', displayOrder: 2, featured: true, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-3', name: 'Computers & Laptops', slug: 'computers-and-laptops', iconName: 'Laptop', displayOrder: 3, featured: true, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-4', name: 'Fashion & Clothing', slug: 'fashion-and-clothing', iconName: 'Shirt', displayOrder: 4, featured: true, imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-5', name: 'Shoes & Footwear', slug: 'shoes', iconName: 'Footprints', displayOrder: 5, featured: true, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-6', name: 'Beauty & Personal Care', slug: 'beauty-and-personal-care', iconName: 'Sparkles', displayOrder: 6, featured: true, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-7', name: 'Home & Kitchen', slug: 'home-and-kitchen', iconName: 'Home', displayOrder: 7, featured: true, imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-8', name: 'Furniture', slug: 'furniture', iconName: 'Armchair', displayOrder: 8, featured: true, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-9', name: 'Sports & Fitness', slug: 'sports-and-fitness', iconName: 'Dumbbell', displayOrder: 9, featured: true, imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-10', name: 'Books & Education', slug: 'books-and-education', iconName: 'BookOpen', displayOrder: 10, featured: true, imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-11', name: 'Toys & Games', slug: 'toys-and-games', iconName: 'Gamepad2', displayOrder: 11, featured: false, imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-12', name: 'Vehicles & Accessories', slug: 'vehicles-and-accessories', iconName: 'Car', displayOrder: 12, featured: false, imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-13', name: 'Grocery & Organic Food', slug: 'grocery', iconName: 'ShoppingBag', displayOrder: 13, featured: true, imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-14', name: 'Other Products & Crafts', slug: 'other-products', iconName: 'Boxes', displayOrder: 14, featured: false, imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80' },
];

export const INITIAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'ban-1',
    title: 'Dashain & Tihar Mega Bazaar',
    subtitle: 'Up to 45% OFF on latest smartphones, laptops & traditional Nepali Dhaka fabrics!',
    badge: 'FESTIVAL SPECIAL',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80',
    targetLink: '/category/electronics',
    backgroundColorHex: '#064e3b',
    active: true,
    displayOrder: 1
  },
  {
    id: 'ban-2',
    title: 'Authentic Himalayan Organics & Teas',
    subtitle: 'Direct from Ilam & Jumla farmers with instant eSewa & Khalti cashback.',
    badge: '100% ORGANIC',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80',
    targetLink: '/category/grocery',
    backgroundColorHex: '#14532d',
    active: true,
    displayOrder: 2
  },
  {
    id: 'ban-3',
    title: 'Himalayan Pashmina & Woolen Wear',
    subtitle: 'Handwoven in Bhaktapur & Patan. Warm, luxury styling for chilly mountain seasons.',
    badge: 'CERTIFIED HANDICRAFT',
    imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1600&q=80',
    targetLink: '/category/fashion-and-clothing',
    backgroundColorHex: '#1e3a8a',
    active: true,
    displayOrder: 3
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sellerId: 'sel-1',
    sellerStoreName: 'Himalayan Tech Hub New Road',
    title: 'Apple iPhone 15 Pro Max (256GB Natural Titanium)',
    slug: 'apple-iphone-15-pro-max-256gb',
    description: 'Original Apple Nepal authorized product with 1 year GenNext official warranty, A17 Pro chip, Super Retina XDR display, and 5x telephoto optical camera.',
    categoryId: 'cat-2',
    categoryName: 'Mobile Phones',
    brand: 'Apple',
    price: 198000,
    discountPrice: 184500,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    condition: 'New',
    specifications: [
      { key: 'Storage', value: '256 GB' },
      { key: 'Display', value: '6.7-inch OLED 120Hz Promotion' },
      { key: 'Chipset', value: 'Apple A17 Pro (3nm)' },
      { key: 'Battery', value: '4422 mAh with MagSafe' },
      { key: 'Warranty', value: '1 Year Authorized Apple Warranty Nepal' }
    ],
    locationCity: 'Kathmandu',
    locationProvince: 'Bagmati Province',
    isAvailable: true,
    isFeatured: true,
    isTrending: true,
    isLatest: true,
    isBestSeller: true,
    approvalStatus: 'approved',
    rating: 4.9,
    reviewCount: 48,
    viewsCount: 1420,
    salesCount: 89,
    deliveryTimeDays: 1,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    sellerId: 'sel-2',
    sellerStoreName: 'Patan Heritage Crafts',
    title: 'Authentic 100% Cashmere Pashmina Shawl (Hand-Spun)',
    slug: 'authentic-cashmere-pashmina-shawl-handspun',
    description: 'Ultra-soft, feather-light authentic Changthangi goat pashmina woven by master artisans of Lalitpur. Certified Chyangra Pashmina Nepal trademark standard.',
    categoryId: 'cat-4',
    categoryName: 'Fashion & Clothing',
    brand: 'Chyangra Pashmina',
    price: 12500,
    discountPrice: 9800,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    condition: 'New',
    specifications: [
      { key: 'Material', value: '100% Pure Cashmere Pashmina' },
      { key: 'Size', value: '200 cm x 70 cm' },
      { key: 'Origin', value: 'Patan, Lalitpur, Nepal' },
      { key: 'Care', value: 'Dry Clean Only' }
    ],
    locationCity: 'Lalitpur',
    locationProvince: 'Bagmati Province',
    isAvailable: true,
    isFeatured: true,
    isTrending: true,
    isLatest: false,
    isBestSeller: true,
    approvalStatus: 'approved',
    rating: 4.95,
    reviewCount: 62,
    viewsCount: 2300,
    salesCount: 140,
    deliveryTimeDays: 2,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    sellerId: 'sel-1',
    sellerStoreName: 'Himalayan Tech Hub New Road',
    title: 'Dell XPS 15 9530 Core i7 13th Gen (16GB RAM / 1TB SSD / RTX 4060)',
    slug: 'dell-xps-15-core-i7-13th-gen',
    description: 'Powerhouse workstation for designers, developers, and creators. OLED 3.5K touch display, CNC aluminum chassis, carbon fiber palm rest.',
    categoryId: 'cat-3',
    categoryName: 'Computers & Laptops',
    brand: 'Dell',
    price: 275000,
    discountPrice: 258000,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 7,
    condition: 'New',
    specifications: [
      { key: 'Processor', value: 'Intel Core i7-13700H (14 cores)' },
      { key: 'Memory', value: '16GB DDR5 4800MHz' },
      { key: 'Storage', value: '1TB M.2 PCIe Gen 4 NVMe SSD' },
      { key: 'GPU', value: 'NVIDIA GeForce RTX 4060 8GB GDDR6' },
      { key: 'Display', value: '15.6" 3.5K OLED InfinityEdge' }
    ],
    locationCity: 'Kathmandu',
    locationProvince: 'Bagmati Province',
    isAvailable: true,
    isFeatured: true,
    isTrending: false,
    isLatest: true,
    isBestSeller: false,
    approvalStatus: 'approved',
    rating: 4.8,
    reviewCount: 19,
    viewsCount: 940,
    salesCount: 32,
    deliveryTimeDays: 1,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    sellerId: 'sel-3',
    sellerStoreName: 'Organic Jumla & Ilam Mart',
    title: 'Premium Organic Ilam Orthodox Black Tea (First Flush 500g)',
    slug: 'premium-organic-ilam-orthodox-black-tea-500g',
    description: 'High-altitude organic orthodox whole-leaf tea harvested at 6,500ft in the misty hills of Kanyam, Ilam. Flowery muscatel aroma and rich natural antioxidants.',
    categoryId: 'cat-13',
    categoryName: 'Grocery & Organic Food',
    brand: 'Ilam Tea Garden',
    price: 1800,
    discountPrice: 1450,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 80,
    condition: 'New',
    specifications: [
      { key: 'Net Weight', value: '500 grams' },
      { key: 'Flush', value: 'First Flush Spring Harvest' },
      { key: 'Origin', value: 'Ilam, Eastern Nepal' },
      { key: 'Organic Certification', value: 'JAS / USDA Organic equivalent' }
    ],
    locationCity: 'Ilam',
    locationProvince: 'Koshi Province',
    isAvailable: true,
    isFeatured: false,
    isTrending: true,
    isLatest: true,
    isBestSeller: true,
    approvalStatus: 'approved',
    rating: 4.9,
    reviewCount: 110,
    viewsCount: 3400,
    salesCount: 380,
    deliveryTimeDays: 3,
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    sellerId: 'sel-4',
    sellerStoreName: 'Goldstar Official Outlet Pokhara',
    title: 'Goldstar Ultra Light Classic Running Shoes G10',
    slug: 'goldstar-ultra-light-classic-running-shoes-g10',
    description: 'Proudly Made in Nepal. High durability vulcanized rubber sole, breathable mesh upper, and all-day cushioned comfort for hiking, sports, and casual wear.',
    categoryId: 'cat-5',
    categoryName: 'Shoes & Footwear',
    brand: 'Goldstar',
    price: 2650,
    discountPrice: 2200,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    condition: 'New',
    specifications: [
      { key: 'Manufacturer', value: 'Kiran Shoes Manufacturers, Nepal' },
      { key: 'Material', value: 'Mesh Fabric + Phylon Outsole' },
      { key: 'Sizes Available', value: '38, 39, 40, 41, 42, 43 EU' },
      { key: 'Weight', value: '290g per shoe' }
    ],
    locationCity: 'Pokhara',
    locationProvince: 'Gandaki Province',
    isAvailable: true,
    isFeatured: true,
    isTrending: true,
    isLatest: false,
    isBestSeller: true,
    approvalStatus: 'approved',
    rating: 4.75,
    reviewCount: 95,
    viewsCount: 2890,
    salesCount: 420,
    deliveryTimeDays: 2,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    sellerId: 'sel-1',
    sellerStoreName: 'Himalayan Tech Hub New Road',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    slug: 'sony-wh-1000xm5-wireless-noise-canceling',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Hi-Res audio, 30-hour battery life, and crystal clear hands-free calling.',
    categoryId: 'cat-1',
    categoryName: 'Electronics',
    brand: 'Sony',
    price: 49500,
    discountPrice: 44999,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    condition: 'New',
    specifications: [
      { key: 'Battery Life', value: 'Up to 30 Hours (NC On)' },
      { key: 'Connectivity', value: 'Bluetooth 5.2, LDAC, 3.5mm Aux' },
      { key: 'Charging', value: 'USB-PD Fast Charge (3 mins = 3 hrs)' },
      { key: 'Warranty', value: '1 Year Brand Warranty' }
    ],
    locationCity: 'Kathmandu',
    locationProvince: 'Bagmati Province',
    isAvailable: true,
    isFeatured: false,
    isTrending: true,
    isLatest: true,
    isBestSeller: false,
    approvalStatus: 'approved',
    rating: 4.88,
    reviewCount: 34,
    viewsCount: 1670,
    salesCount: 65,
    deliveryTimeDays: 1,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    sellerId: 'sel-2',
    sellerStoreName: 'Patan Heritage Crafts',
    title: 'Handcrafted Traditional Nepali Dhaka Topi & Kurta Set',
    slug: 'traditional-nepali-palpali-dhaka-topi-kurta',
    description: 'Original Palpali hand-loomed Dhaka top & cotton-silk kurta churidar. Traditional geometric Nepali patterns worn for weddings, festivals, and cultural events.',
    categoryId: 'cat-4',
    categoryName: 'Fashion & Clothing',
    brand: 'Palpali Dhaka',
    price: 5200,
    discountPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    condition: 'New',
    specifications: [
      { key: 'Weave Type', value: 'Palpali Handloom Dhaka' },
      { key: 'Fabric', value: 'Pure Cotton & Silk Thread' },
      { key: 'Origin', value: 'Tansen, Palpa, Nepal' }
    ],
    locationCity: 'Lalitpur',
    locationProvince: 'Bagmati Province',
    isAvailable: true,
    isFeatured: false,
    isTrending: true,
    isLatest: false,
    isBestSeller: true,
    approvalStatus: 'approved',
    rating: 4.92,
    reviewCount: 41,
    viewsCount: 1820,
    salesCount: 110,
    deliveryTimeDays: 2,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    sellerId: 'sel-5',
    sellerStoreName: 'Boudha Himalayan Herbs',
    title: 'Pure Himalayan Shilajit Resin (50g Lab Tested Grade A)',
    slug: 'pure-himalayan-shilajit-resin-50g',
    description: 'Collected from above 16,000 feet in the pristine Dhaulagiri ranges. Rich in fulvic acid, minerals, and revitalizing ayurvedic strength.',
    categoryId: 'cat-6',
    categoryName: 'Beauty & Personal Care',
    brand: 'Himalayan Gold',
    price: 3500,
    discountPrice: 2950,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    condition: 'New',
    specifications: [
      { key: 'Net Content', value: '50g Natural Purified Resin' },
      { key: 'Fulvic Acid', value: 'Over 75% Lab Certified' },
      { key: 'Origin', value: 'Mustang / Manang, Nepal' }
    ],
    locationCity: 'Kathmandu',
    locationProvince: 'Bagmati Province',
    isAvailable: true,
    isFeatured: true,
    isTrending: true,
    isLatest: true,
    isBestSeller: true,
    approvalStatus: 'approved',
    rating: 4.86,
    reviewCount: 77,
    viewsCount: 3100,
    salesCount: 245,
    deliveryTimeDays: 2,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'HAAT10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseAmount: 2000,
    maxDiscountAmount: 1500,
    expiryDate: '2027-12-31',
    isActive: true,
    usageCount: 142,
    usageLimit: 1000
  },
  {
    id: 'c-2',
    code: 'FESTIVE500',
    discountType: 'fixed',
    discountValue: 500,
    minPurchaseAmount: 5000,
    expiryDate: '2027-12-31',
    isActive: true,
    usageCount: 88,
    usageLimit: 500
  },
  {
    id: 'c-3',
    code: 'WELCOMEHAAT',
    discountType: 'percentage',
    discountValue: 15,
    minPurchaseAmount: 1000,
    maxDiscountAmount: 800,
    expiryDate: '2027-12-31',
    isActive: true,
    usageCount: 320,
    usageLimit: 2000
  }
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  siteName: 'HaatBazaar',
  supportPhone: '+977-1-4268999 / +977-9801234567',
  supportEmail: 'support@haatbazaar.com.np',
  officeAddress: 'Putalisadak, New Plaza Commercial Building 4th Floor, Kathmandu 44600, Nepal',
  defaultDeliveryFee: 100,
  freeDeliveryThreshold: 4000,
  currency: 'NPR',
  esewaMerchantCode: 'EPAYTEST',
  khaltiPublicKey: 'test_public_key_dc74e0fd69cb46cd934448e4b52b3f64',
  bankAccountDetails: {
    bankName: 'Nabil Bank Ltd.',
    accountName: 'HaatBazaar E-Commerce Pvt. Ltd.',
    accountNumber: '00100175024889',
    branch: 'Teendhara Branch, Durbar Marg, Kathmandu'
  },
  enableCod: true,
  enableEsewa: true,
  enableKhalti: true,
  enableBankTransfer: true,
  announcementText: '🇳🇵 Nationwide Delivery Across All 7 Provinces of Nepal | Instant eSewa & Khalti Payments Available!'
};

export const DEMO_USERS = [
  {
    id: 'usr-admin-1',
    email: 'admin@haatbazaar.com.np',
    fullName: 'Arbin Basyal (System Admin)',
    phone: '+977-9841234567',
    role: 'admin' as const,
    emailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    savedAddresses: [
      {
        id: 'addr-admin-1',
        fullName: 'Arbin Basyal',
        phone: '+977-9841234567',
        street: 'Lazimpat Embassy Road, House 42',
        city: 'Kathmandu',
        province: 'Bagmati Province',
        postalCode: '44600',
        isDefault: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active' as const
  },
  {
    id: 'usr-seller-1',
    email: 'seller@newroadhub.com.np',
    fullName: 'Sunil Shakya (Vendor)',
    phone: '+977-9851098765',
    role: 'seller' as const,
    sellerId: 'sel-1',
    emailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    savedAddresses: [
      {
        id: 'addr-seller-1',
        fullName: 'Sunil Shakya',
        phone: '+977-9851098765',
        street: 'New Road Pako Complex Shop #14',
        city: 'Kathmandu',
        province: 'Bagmati Province',
        postalCode: '44600',
        isDefault: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active' as const
  },
  {
    id: 'usr-customer-1',
    email: 'customer@nepalmail.com',
    fullName: 'Pooja Shrestha (Shopper)',
    phone: '+977-9818765432',
    role: 'customer' as const,
    emailVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    savedAddresses: [
      {
        id: 'addr-cust-1',
        fullName: 'Pooja Shrestha',
        phone: '+977-9818765432',
        street: 'Baluwatar Prime Minister Gate Lane 3',
        city: 'Kathmandu',
        province: 'Bagmati Province',
        postalCode: '44600',
        isDefault: true
      },
      {
        id: 'addr-cust-2',
        fullName: 'Pooja Shrestha (Home)',
        phone: '+977-9818765432',
        street: 'Lakeside Baidam, Ward 6',
        city: 'Pokhara',
        province: 'Gandaki Province',
        postalCode: '33700',
        isDefault: false
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active' as const
  }
];

export const DEMO_SELLERS = [
  {
    id: 'sel-1',
    userId: 'usr-seller-1',
    storeName: 'Himalayan Tech Hub New Road',
    storeSlug: 'himalayan-tech-hub',
    description: 'Official electronics, smartphones, and workstation laptops retailer in Kathmandu New Road since 2012.',
    logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
    phone: '+977-9851098765',
    email: 'seller@newroadhub.com.np',
    panNumber: '602345891',
    businessRegistrationNumber: 'REG-KTM-2018-994',
    locationCity: 'Kathmandu',
    locationProvince: 'Bagmati Province',
    bankDetails: {
      bankName: 'Global IME Bank',
      accountName: 'Himalayan Tech Hub Pvt Ltd',
      accountNumber: '0100100028945',
      branch: 'New Road Branch'
    },
    status: 'approved' as const,
    rating: 4.88,
    ratingCount: 142,
    totalSales: 412,
    revenue: 1854000,
    commissionRate: 5,
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString()
  },
  {
    id: 'sel-2',
    userId: 'usr-seller-2',
    storeName: 'Patan Heritage Crafts',
    storeSlug: 'patan-heritage-crafts',
    description: 'Traditional metal crafts, singing bowls, Pashmina shawls, and wood carvings straight from Lalitpur master artisans.',
    logoUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=200&q=80',
    phone: '+977-9841555666',
    email: 'patan.heritage@nepalmail.com',
    panNumber: '301298455',
    locationCity: 'Lalitpur',
    locationProvince: 'Bagmati Province',
    bankDetails: {
      bankName: 'Siddhartha Bank Ltd',
      accountName: 'Patan Heritage Crafts',
      accountNumber: '002019485721',
      branch: 'Patan Dhoka Branch'
    },
    status: 'approved' as const,
    rating: 4.95,
    ratingCount: 88,
    totalSales: 210,
    revenue: 940000,
    commissionRate: 5,
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString()
  }
];

export const DEMO_REVIEWS = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'usr-customer-1',
    userName: 'Pooja Shrestha',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Received 100% genuine sealed pack iPhone with GenNext warranty card! Fast delivery to Baluwatar within 3 hours. Paid smoothly with eSewa.',
    verifiedPurchase: true,
    sellerReply: 'Dhanyabad Pooja ji! We are delighted to serve you authentic products with full warranty.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'published' as const
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    userId: 'usr-customer-2',
    userName: 'Bikash Adhikari',
    rating: 5,
    comment: 'The cashmere quality is extraordinary. So lightweight and warm. Beautiful craftsmanship from Lalitpur artisans.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    status: 'published' as const
  },
  {
    id: 'rev-3',
    productId: 'prod-5',
    userId: 'usr-customer-1',
    userName: 'Pooja Shrestha',
    rating: 5,
    comment: 'Goldstar is love! Great grip for morning walks in Shivapuri and daily jogging. Proud of our Nepali products.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'published' as const
  }
];
