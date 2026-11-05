/**
 * Global Marketplace Context
 * Centralized state provider for:
 * - Current User Authentication & RBAC (Admin, Seller, Customer)
 * - Switchable active user for testing roles seamlessly
 * - Product Catalog, Filtering, Categories, Banners
 * - Shopping Cart & Wishlist persistence
 * - Orders, Checkout, Real-time status transitions
 * - Seller & Admin CRUD capabilities
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SellerProfile,
  ProductCategory,
  Product,
  CartItem,
  Order,
  OrderStatus,
  PaymentStatus,
  Coupon,
  PromotionalBanner,
  WebsiteSettings,
  ProductReview,
  Address,
  PaymentMethod
} from '../types';
import { StorageService } from '../services/storageService';
import { PaymentService, PaymentVerificationResult } from '../services/paymentService';

interface MarketplaceContextType {
  // Auth & RBAC
  currentUser: UserProfile | null;
  users: UserProfile[];
  sellers: SellerProfile[];
  currentSeller: SellerProfile | null;
  switchUser: (userId: string) => void;
  login: (email: string, role?: 'customer' | 'seller' | 'admin') => Promise<boolean>;
  register: (name: string, email: string, role?: 'customer' | 'seller') => Promise<UserProfile>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  saveAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;

  // Seller specific
  registerSeller: (data: Omit<SellerProfile, 'id' | 'userId' | 'status' | 'rating' | 'ratingCount' | 'totalSales' | 'revenue' | 'createdAt'>) => Promise<SellerProfile>;
  updateSellerProfile: (sellerId: string, data: Partial<SellerProfile>) => void;

  // Categories & Banners
  categories: ProductCategory[];
  banners: PromotionalBanner[];
  addCategory: (cat: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => void;
  addBanner: (banner: Omit<PromotionalBanner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<PromotionalBanner>) => void;
  deleteBanner: (id: string) => void;

  // Products
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'viewsCount' | 'salesCount'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  approveProduct: (id: string, approved: boolean) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Checkout & Coupons
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string; discount?: number };
  removeCoupon: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  discountTotal: number;
  cartGrandTotal: number;
  createOrder: (data: {
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
    customerNotes?: string;
  }) => Promise<Order>;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, details?: any) => void;

  // Reviews
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt' | 'status'>) => void;
  replyReview: (reviewId: string, reply: string) => void;

  // Admin Controls & Settings
  settings: WebsiteSettings;
  updateSettings: (settings: Partial<WebsiteSettings>) => void;
  approveSeller: (sellerId: string, approved: boolean) => void;
  suspendUser: (userId: string, suspend: boolean) => void;
  resetAllData: () => void;

  // Global Notification / Toast helper
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => StorageService.getCurrentUser());
  const [users, setUsers] = useState<UserProfile[]>(() => StorageService.getUsers());
  const [sellers, setSellers] = useState<SellerProfile[]>(() => StorageService.getSellers());
  const [categories, setCategories] = useState<ProductCategory[]>(() => StorageService.getCategories());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => StorageService.getWishlist());
  const [coupons, setCoupons] = useState<Coupon[]>(() => StorageService.getCoupons());
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [banners, setBanners] = useState<PromotionalBanner[]>(() => StorageService.getBanners());
  const [settings, setSettings] = useState<WebsiteSettings>(() => StorageService.getSettings());
  const [reviews, setReviews] = useState<ProductReview[]>(() => StorageService.getReviews());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Sync state to storage
  useEffect(() => {
    StorageService.setCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    StorageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    StorageService.saveSellers(sellers);
  }, [sellers]);

  useEffect(() => {
    StorageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    StorageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    StorageService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    StorageService.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    StorageService.saveWishlist(wishlist);
  }, [wishlist]);

  useEffect(() => {
    StorageService.saveCoupons(coupons);
  }, [coupons]);

  useEffect(() => {
    StorageService.saveBanners(banners);
  }, [banners]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    StorageService.saveReviews(reviews);
  }, [reviews]);

  // Current Seller helper
  const currentSeller = sellers.find((s) => s.userId === currentUser?.id) || null;

  // Switch between demo accounts or registered users easily
  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast(`Switched active profile to ${target.fullName} (${target.role.toUpperCase()})`);
    }
  };

  const login = async (email: string, role: 'customer' | 'seller' | 'admin' = 'customer'): Promise<boolean> => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      showToast(`Welcome back, ${existing.fullName}!`);
      return true;
    }
    // Auto register for seamless access
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      role,
      emailVerified: true,
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          fullName: email.split('@')[0],
          phone: '+977-9800000000',
          street: 'Kathmandu Valley Central',
          city: 'Kathmandu',
          province: 'Bagmati Province',
          postalCode: '44600',
          isDefault: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };
    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUser(newUser);
    showToast(`Account created successfully for ${email}`);
    return true;
  };

  const register = async (name: string, email: string, role: 'customer' | 'seller' = 'customer'): Promise<UserProfile> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: name,
      role,
      emailVerified: true,
      savedAddresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Welcome to HaatBazaar, ${name}!`);
    return newUser;
  };

  const logout = () => {
    // Switch to null or back to a guest customer profile
    setCurrentUser(null);
    showToast('Logged out successfully.');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profile, updatedAt: new Date().toISOString() };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showToast('Profile updated successfully.');
  };

  const saveAddress = (addressData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      ...addressData
    };
    const updatedAddresses = addressData.isDefault
      ? [...currentUser.savedAddresses.map((a) => ({ ...a, isDefault: false })), newAddress]
      : [...currentUser.savedAddresses, newAddress];

    updateUserProfile({ savedAddresses: updatedAddresses });
    showToast('Delivery address saved.');
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    const updatedAddresses = currentUser.savedAddresses.filter((a) => a.id !== id);
    updateUserProfile({ savedAddresses: updatedAddresses });
    showToast('Address removed.');
  };

  // Seller Registration
  const registerSeller = async (data: Omit<SellerProfile, 'id' | 'userId' | 'status' | 'rating' | 'ratingCount' | 'totalSales' | 'revenue' | 'createdAt'>): Promise<SellerProfile> => {
    if (!currentUser) throw new Error('Must be logged in to apply as seller');
    const newSeller: SellerProfile = {
      id: `sel-${Date.now()}`,
      userId: currentUser.id,
      ...data,
      status: 'approved', // instantly approved for smooth testing
      rating: 5.0,
      ratingCount: 0,
      totalSales: 0,
      revenue: 0,
      createdAt: new Date().toISOString()
    };
    setSellers((prev) => [...prev, newSeller]);
    updateUserProfile({ role: 'seller', sellerId: newSeller.id });
    showToast(`Congratulations! "${newSeller.storeName}" is now registered and active on HaatBazaar.`);
    return newSeller;
  };

  const updateSellerProfile = (sellerId: string, data: Partial<SellerProfile>) => {
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, ...data } : s)));
    showToast('Store settings updated.');
  };

  // Category Management
  const addCategory = (cat: Omit<ProductCategory, 'id'>) => {
    const newCat: ProductCategory = {
      id: `cat-${Date.now()}`,
      ...cat
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added successfully.`);
  };

  const updateCategory = (id: string, cat: Partial<ProductCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...cat } : c)));
    showToast('Category updated.');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted.');
  };

  // Banner Management
  const addBanner = (banner: Omit<PromotionalBanner, 'id'>) => {
    const newB: PromotionalBanner = {
      id: `ban-${Date.now()}`,
      ...banner
    };
    setBanners((prev) => [...prev, newB]);
    showToast('Hero banner created.');
  };

  const updateBanner = (id: string, banner: Partial<PromotionalBanner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...banner } : b)));
    showToast('Banner updated.');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner removed.');
  };

  // Product Management
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'viewsCount' | 'salesCount'>): Product => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...productData,
      rating: 5.0,
      reviewCount: 0,
      viewsCount: 1,
      salesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.title}" added to catalog.`);
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p))
    );
    showToast('Product updated.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted.');
  };

  const approveProduct = (id: string, approved: boolean) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, approvalStatus: approved ? 'approved' : 'rejected', updatedAt: new Date().toISOString() }
          : p
      )
    );
    showToast(`Product ${approved ? 'approved' : 'rejected'}.`);
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    const priceToCharge = product.discountPrice || product.price;

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart((prev) => [
        ...prev,
        {
          productId: product.id,
          product,
          quantity,
          selectedPrice: priceToCharge
        }
      ]);
    }
    showToast(`Added "${product.title.slice(0, 30)}..." to shopping cart.`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item removed from cart.');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from wishlist.');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Added to wishlist!');
    }
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.selectedPrice * item.quantity, 0);

  const deliveryFee =
    cart.length === 0 ? 0 : cartSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.defaultDeliveryFee;

  let discountTotal = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      const calculated = (cartSubtotal * activeCoupon.discountValue) / 100;
      discountTotal = activeCoupon.maxDiscountAmount
        ? Math.min(calculated, activeCoupon.maxDiscountAmount)
        : calculated;
    } else {
      discountTotal = Math.min(activeCoupon.discountValue, cartSubtotal);
    }
  }

  const cartGrandTotal = Math.max(0, cartSubtotal + deliveryFee - discountTotal);

  const applyCoupon = (code: string) => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }
    if (coupon.minPurchaseAmount && cartSubtotal < coupon.minPurchaseAmount) {
      return {
        success: false,
        message: `Minimum order amount of Rs. ${coupon.minPurchaseAmount.toLocaleString('en-IN')} required.`
      };
    }
    setActiveCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('Coupon removed.');
  };

  // Create Order & Checkout
  const createOrder = async ({
    shippingAddress,
    paymentMethod,
    customerNotes
  }: {
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
    customerNotes?: string;
  }): Promise<Order> => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderNumber = `HB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Group seller IDs
    const sellerIds = Array.from(new Set(cart.map((item) => item.product.sellerId)));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id || 'guest',
      customerName: shippingAddress.fullName,
      customerEmail: currentUser?.email || 'customer@haatbazaar.com.np',
      customerPhone: shippingAddress.phone,
      shippingAddress,
      items: cart.map((item) => ({
        productId: item.productId,
        title: item.product.title,
        image: item.product.images[0] || '',
        price: item.selectedPrice,
        quantity: item.quantity,
        sellerId: item.product.sellerId,
        sellerStoreName: item.product.sellerStoreName
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      discountAmount: discountTotal,
      couponCode: activeCoupon?.code,
      totalAmount: cartGrandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      paymentDetails: {
        gateway:
          paymentMethod === 'esewa'
            ? 'eSewa Nepal'
            : paymentMethod === 'khalti'
            ? 'Khalti Digital Wallet'
            : paymentMethod === 'bank_transfer'
            ? 'Bank Transfer'
            : 'Cash on Delivery',
        transactionId: `${paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
        paidAt: new Date().toISOString()
      },
      orderStatus: 'confirmed',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: customerNotes || 'Order submitted by customer'
        },
        {
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          note: `Payment mode: ${paymentMethod.toUpperCase()} verified.`
        }
      ],
      sellerIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update product stock and seller stats
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((c) => c.productId === prod.id);
        if (cartItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartItem.quantity),
            salesCount: prod.salesCount + cartItem.quantity
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveCoupon(null);
    showToast(`Order #${orderNumber} created successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const history = [
            ...ord.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Order updated to ${status}`
            }
          ];
          return {
            ...ord,
            orderStatus: status,
            statusHistory: history,
            updatedAt: new Date().toISOString()
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to "${status.toUpperCase()}".`);
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus, details?: any) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: status,
            paymentDetails: details ? { ...ord.paymentDetails, ...details } : ord.paymentDetails,
            updatedAt: new Date().toISOString()
          };
        }
        return ord;
      })
    );
    showToast(`Payment marked as "${status.toUpperCase()}".`);
  };

  // Reviews
  const addReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'status'>) => {
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      createdAt: new Date().toISOString(),
      status: 'published'
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newRev];
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === reviewData.productId
          ? { ...p, rating: parseFloat(avg.toFixed(1)), reviewCount: prodReviews.length }
          : p
      )
    );
    showToast('Your verified review was published!');
  };

  const replyReview = (reviewId: string, reply: string) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, sellerReply: reply } : r)));
    showToast('Reply added to review.');
  };

  // Admin controls
  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Platform settings updated.');
  };

  const approveSeller = (sellerId: string, approved: boolean) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: approved ? 'approved' : 'rejected' } : s))
    );
    showToast(`Seller ${approved ? 'approved' : 'rejected'}.`);
  };

  const suspendUser = (userId: string, suspend: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: suspend ? 'suspended' : 'active' } : u))
    );
    showToast(`User ${suspend ? 'suspended' : 'reactivated'}.`);
  };

  const resetAllData = () => {
    StorageService.resetAllData();
    setUsers(StorageService.getUsers());
    setSellers(StorageService.getSellers());
    setCategories(StorageService.getCategories());
    setProducts(StorageService.getProducts());
    setOrders(StorageService.getOrders());
    setCart(StorageService.getCart());
    setWishlist(StorageService.getWishlist());
    setCoupons(StorageService.getCoupons());
    setBanners(StorageService.getBanners());
    setSettings(StorageService.getSettings());
    setReviews(StorageService.getReviews());
    setCurrentUser(StorageService.getCurrentUser());
    showToast('Marketplace data reset to initial Nepali catalog.');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        users,
        sellers,
        currentSeller,
        switchUser,
        login,
        register,
        logout,
        updateUserProfile,
        saveAddress,
        deleteAddress,
        registerSeller,
        updateSellerProfile,
        categories,
        banners,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        approveProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        coupons,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        deliveryFee,
        discountTotal,
        cartGrandTotal,
        createOrder,
        orders,
        updateOrderStatus,
        updatePaymentStatus,
        reviews,
        addReview,
        replyReview,
        settings,
        updateSettings,
        approveSeller,
        suspendUser,
        resetAllData,
        toastMessage,
        showToast
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
