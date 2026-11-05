/**
 * HaatBazaar Core Domain Models & Schemas
 * Comprehensive types for Marketplace: Auth, RBAC, Products, Orders, Payments, Reviews, Vendors, Settings
 */

export type UserRole = 'customer' | 'seller' | 'admin';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string; // e.g., Kathmandu, Lalitpur, Pokhara, Biratnagar, Bharatpur, Butwal, Dharan
  province: string; // Province 1 to Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim
  postalCode?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  emailVerified: boolean;
  savedAddresses: Address[];
  sellerId?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'suspended';
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  phone: string;
  email: string;
  panNumber: string; // Permanent Account Number (Nepal taxation)
  businessRegistrationNumber?: string;
  locationCity: string;
  locationProvince: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  ratingCount: number;
  totalSales: number;
  revenue: number;
  commissionRate: number; // e.g. 5%
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName: string;
  imageUrl?: string;
  displayOrder: number;
  featured?: boolean;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  verifiedPurchase: boolean;
  sellerReply?: string;
  createdAt: string;
  status: 'published' | 'hidden';
}

export interface Product {
  id: string;
  sellerId: string;
  sellerStoreName: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  price: number; // NPR (Rs.)
  discountPrice?: number; // Discounted NPR
  images: string[];
  stock: number;
  condition: 'New' | 'Used';
  specifications: ProductSpecification[];
  locationCity: string;
  locationProvince: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  isBestSeller?: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  rating: number;
  reviewCount: number;
  viewsCount: number;
  salesCount: number;
  deliveryTimeDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
}

export type PaymentMethod = 'esewa' | 'khalti' | 'bank_transfer' | 'cod';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerStoreName: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. HB-2026-9812
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDetails?: {
    gateway: string;
    transactionId?: string;
    paidAt?: string;
    referenceCode?: string;
  };
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  sellerIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  targetLink: string;
  categorySlug?: string;
  badge?: string;
  backgroundColorHex?: string;
  active: boolean;
  displayOrder: number;
}

export interface NotificationItem {
  id: string;
  userId: string; // or 'admin' or 'seller_{id}'
  title: string;
  message: string;
  type: 'order' | 'product' | 'system' | 'seller';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface WebsiteSettings {
  siteName: string;
  supportPhone: string;
  supportEmail: string;
  officeAddress: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  currency: string; // 'NPR' or 'Rs.'
  esewaMerchantCode: string;
  khaltiPublicKey: string;
  bankAccountDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
  };
  enableCod: boolean;
  enableEsewa: boolean;
  enableKhalti: boolean;
  enableBankTransfer: boolean;
  announcementText?: string;
}
