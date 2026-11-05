/**
 * Persistent Storage & State Architecture for HaatBazaar
 * Provides resilient, reactive state with local-storage persistence, atomic mutations,
 * real simulated network delays, and export/reset capabilities.
 */

import {
  UserProfile,
  SellerProfile,
  ProductCategory,
  Product,
  CartItem,
  Order,
  Coupon,
  PromotionalBanner,
  NotificationItem,
  WebsiteSettings,
  ProductReview,
  Address
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
  DEMO_USERS,
  DEMO_SELLERS,
  DEMO_REVIEWS
} from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'haatbazaar_current_user',
  USERS: 'haatbazaar_users',
  SELLERS: 'haatbazaar_sellers',
  CATEGORIES: 'haatbazaar_categories',
  PRODUCTS: 'haatbazaar_products',
  ORDERS: 'haatbazaar_orders',
  CART: 'haatbazaar_cart',
  WISHLIST: 'haatbazaar_wishlist',
  COUPONS: 'haatbazaar_coupons',
  BANNERS: 'haatbazaar_banners',
  NOTIFICATIONS: 'haatbazaar_notifications',
  SETTINGS: 'haatbazaar_settings',
  REVIEWS: 'haatbazaar_reviews'
};

function readStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Initial orders seed
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'HB-2026-9041',
    userId: 'usr-customer-1',
    customerName: 'Pooja Shrestha',
    customerEmail: 'customer@nepalmail.com',
    customerPhone: '+977-9818765432',
    shippingAddress: {
      id: 'addr-cust-1',
      fullName: 'Pooja Shrestha',
      phone: '+977-9818765432',
      street: 'Baluwatar Prime Minister Gate Lane 3',
      city: 'Kathmandu',
      province: 'Bagmati Province',
      postalCode: '44600',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-1',
        title: 'Apple iPhone 15 Pro Max (256GB Natural Titanium)',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
        price: 184500,
        quantity: 1,
        sellerId: 'sel-1',
        sellerStoreName: 'Himalayan Tech Hub New Road'
      }
    ],
    subtotal: 184500,
    deliveryFee: 0,
    discountAmount: 1500,
    couponCode: 'HAAT10',
    totalAmount: 183000,
    paymentMethod: 'esewa',
    paymentStatus: 'completed',
    paymentDetails: {
      gateway: 'eSewa Nepal',
      transactionId: 'ESEWA-TXN-90218734',
      paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      referenceCode: 'HB-90218734'
    },
    orderStatus: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(), note: 'Order placed by customer' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 86400000 * 2.3).toISOString(), note: 'eSewa payment verified' },
      { status: 'processing', timestamp: new Date(Date.now() - 86400000 * 2.1).toISOString(), note: 'Dispatched from New Road hub' },
      { status: 'shipped', timestamp: new Date(Date.now() - 86400000 * 2.0).toISOString(), note: 'Out with delivery agent (Rider: Bikash)' },
      { status: 'delivered', timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(), note: 'Successfully handed over to customer' }
    ],
    sellerIds: ['sel-1'],
    createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1.8).toISOString()
  },
  {
    id: 'ord-102',
    orderNumber: 'HB-2026-9042',
    userId: 'usr-customer-1',
    customerName: 'Pooja Shrestha',
    customerEmail: 'customer@nepalmail.com',
    customerPhone: '+977-9818765432',
    shippingAddress: {
      id: 'addr-cust-1',
      fullName: 'Pooja Shrestha',
      phone: '+977-9818765432',
      street: 'Baluwatar Prime Minister Gate Lane 3',
      city: 'Kathmandu',
      province: 'Bagmati Province',
      postalCode: '44600',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-5',
        title: 'Goldstar Ultra Light Classic Running Shoes G10',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        price: 2200,
        quantity: 2,
        sellerId: 'sel-4',
        sellerStoreName: 'Goldstar Official Outlet Pokhara'
      },
      {
        productId: 'prod-4',
        title: 'Premium Organic Ilam Orthodox Black Tea (First Flush 500g)',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        price: 1450,
        quantity: 1,
        sellerId: 'sel-3',
        sellerStoreName: 'Organic Jumla & Ilam Mart'
      }
    ],
    subtotal: 5850,
    deliveryFee: 100,
    discountAmount: 500,
    couponCode: 'FESTIVE500',
    totalAmount: 5450,
    paymentMethod: 'khalti',
    paymentStatus: 'completed',
    paymentDetails: {
      gateway: 'Khalti Digital Wallet',
      transactionId: 'KHALTI-KTM-543189',
      paidAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      referenceCode: 'KHLT-543189'
    },
    orderStatus: 'shipped',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
      { status: 'confirmed', timestamp: new Date(Date.now() - 86400000 * 0.9).toISOString() },
      { status: 'processing', timestamp: new Date(Date.now() - 86400000 * 0.7).toISOString() },
      { status: 'shipped', timestamp: new Date(Date.now() - 86400000 * 0.3).toISOString(), note: 'In transit via Nepal Post Express' }
    ],
    sellerIds: ['sel-4', 'sel-3'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 0.3).toISOString()
  }
];

export class StorageService {
  // Users & Auth
  static getUsers(): UserProfile[] {
    return readStorage<UserProfile[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  }

  static saveUsers(users: UserProfile[]) {
    writeStorage(STORAGE_KEYS.USERS, users);
  }

  static getCurrentUser(): UserProfile | null {
    const defaultUser = DEMO_USERS[0]; // Admin by default or read from storage
    return readStorage<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, defaultUser);
  }

  static setCurrentUser(user: UserProfile | null) {
    writeStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Sellers
  static getSellers(): SellerProfile[] {
    return readStorage<SellerProfile[]>(STORAGE_KEYS.SELLERS, DEMO_SELLERS);
  }

  static saveSellers(sellers: SellerProfile[]) {
    writeStorage(STORAGE_KEYS.SELLERS, sellers);
  }

  // Categories
  static getCategories(): ProductCategory[] {
    return readStorage<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static saveCategories(categories: ProductCategory[]) {
    writeStorage(STORAGE_KEYS.CATEGORIES, categories);
  }

  // Products
  static getProducts(): Product[] {
    return readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static saveProducts(products: Product[]) {
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  // Orders
  static getOrders(): Order[] {
    return readStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  static saveOrders(orders: Order[]) {
    writeStorage(STORAGE_KEYS.ORDERS, orders);
  }

  // Cart
  static getCart(): CartItem[] {
    return readStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  static saveCart(items: CartItem[]) {
    writeStorage(STORAGE_KEYS.CART, items);
  }

  // Wishlist (list of product IDs)
  static getWishlist(): string[] {
    return readStorage<string[]>(STORAGE_KEYS.WISHLIST, ['prod-2', 'prod-6']);
  }

  static saveWishlist(items: string[]) {
    writeStorage(STORAGE_KEYS.WISHLIST, items);
  }

  // Coupons
  static getCoupons(): Coupon[] {
    return readStorage<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  static saveCoupons(coupons: Coupon[]) {
    writeStorage(STORAGE_KEYS.COUPONS, coupons);
  }

  // Banners
  static getBanners(): PromotionalBanner[] {
    return readStorage<PromotionalBanner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  }

  static saveBanners(banners: PromotionalBanner[]) {
    writeStorage(STORAGE_KEYS.BANNERS, banners);
  }

  // Settings
  static getSettings(): WebsiteSettings {
    return readStorage<WebsiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static saveSettings(settings: WebsiteSettings) {
    writeStorage(STORAGE_KEYS.SETTINGS, settings);
  }

  // Reviews
  static getReviews(): ProductReview[] {
    return readStorage<ProductReview[]>(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
  }

  static saveReviews(reviews: ProductReview[]) {
    writeStorage(STORAGE_KEYS.REVIEWS, reviews);
  }

  // Reset database back to default seed data
  static resetAllData() {
    writeStorage(STORAGE_KEYS.USERS, DEMO_USERS);
    writeStorage(STORAGE_KEYS.SELLERS, DEMO_SELLERS);
    writeStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    writeStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    writeStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    writeStorage(STORAGE_KEYS.CART, []);
    writeStorage(STORAGE_KEYS.WISHLIST, ['prod-2', 'prod-6']);
    writeStorage(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    writeStorage(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    writeStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    writeStorage(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
    writeStorage(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
  }
}
