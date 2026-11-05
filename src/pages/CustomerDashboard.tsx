import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  XCircle,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { OrderStatus } from '../types';

interface CustomerDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    orders,
    wishlist,
    products,
    saveAddress,
    deleteAddress,
    updateUserProfile,
    updateOrderStatus,
    showToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist' | 'tracking'>('orders');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // New address form modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Kathmandu');
  const [newAddrProvince, setNewAddrProvince] = useState('Bagmati Province');

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Sign In Required</h2>
        <p className="text-xs text-stone-500">Please sign in to view your orders and profile.</p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  // Filter user orders
  const myOrders = orders.filter((o) => o.userId === currentUser.id || o.customerEmail === currentUser.email);
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrPhone || !newAddrStreet) return;

    saveAddress({
      fullName: newAddrName,
      phone: newAddrPhone,
      street: newAddrStreet,
      city: newAddrCity,
      province: newAddrProvince,
      isDefault: currentUser.savedAddresses.length === 0
    });

    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrStreet('');
    setShowAddressModal(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">Shipped / In Transit</span>;
      case 'processing':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">Processing</span>;
      case 'confirmed':
        return <span className="bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">Order Confirmed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">Cancelled</span>;
      default:
        return <span className="bg-stone-100 text-stone-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">Pending</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Top Profile Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-700/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-800 text-white font-black text-xl flex items-center justify-center">
              {currentUser.fullName.charAt(0)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-serif text-stone-900">{currentUser.fullName}</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-stone-500">{currentUser.email} &bull; {currentUser.phone || 'Phone not set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'customer' && (
            <button
              onClick={() => onNavigate('seller-register')}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Apply to Sell on HaatBazaar
            </button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-200 overflow-x-auto text-xs font-bold text-stone-600 gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'wishlist' ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-stone-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'addresses' ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-stone-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({currentUser.savedAddresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'profile' ? 'border-emerald-800 text-emerald-900' : 'border-transparent hover:text-stone-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500">Explore Nepal&apos;s largest catalog and place your first order.</p>
              <button
                onClick={() => onNavigate('home')}
                className="bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      #{order.orderNumber}
                    </span>
                    <span className="text-stone-400 ml-2">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-mono font-black text-stone-900 text-sm">
                      Rs. {order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover border border-stone-200"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="font-bold text-stone-900 truncate">{item.title}</div>
                        <div className="text-stone-500">
                          Seller: {item.sellerStoreName} &bull; Qty: {item.quantity}
                        </div>
                        <div className="text-emerald-800 font-bold font-mono">
                          Rs. {item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Order Timeline */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Order Tracking Status
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((stepStatus, idx) => {
                      const isReached = order.statusHistory.some((h) => h.status === stepStatus);
                      return (
                        <div key={stepStatus} className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isReached
                                ? 'bg-emerald-700 text-white'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {stepStatus}
                          </span>
                          {idx < 4 && <span className="text-stone-300">&rarr;</span>}
                        </div>
                      );
                    })}
                  </div>

                  {order.statusHistory.length > 0 && (
                    <div className="text-[11px] text-stone-500 pt-1">
                      Latest note: {order.statusHistory[order.statusHistory.length - 1].note || 'Order is on schedule'}
                    </div>
                  )}
                </div>

                {/* Footer details */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-stone-500 border-t border-stone-100">
                  <div>
                    Payment: <strong className="uppercase text-stone-800">{order.paymentMethod}</strong> (Status: {order.paymentStatus})
                  </div>
                  {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled', 'Cancelled by customer')}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800">Your Wishlist is Empty</h3>
              <p className="text-xs text-stone-500">Tap the heart on any product to save it here for later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wishlistedProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-xs">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-40 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 truncate">{p.title}</h4>
                    <div className="text-xs font-black font-serif text-emerald-800 mt-1">
                      Rs. {(p.discountPrice || p.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('product-detail', { productId: p.id })}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 rounded-lg"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SAVED ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-800">Saved Delivery Addresses</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentUser.savedAddresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-xl border border-stone-200 p-4 space-y-2 relative shadow-xs">
                {addr.isDefault && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded uppercase">
                    Default
                  </span>
                )}
                <div className="font-bold text-xs text-stone-900">{addr.fullName}</div>
                <div className="text-xs text-stone-600">{addr.street}</div>
                <div className="text-xs text-stone-500">{addr.city}, {addr.province}</div>
                <div className="text-xs font-mono font-semibold text-emerald-900">Phone: {addr.phone}</div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-stone-900">Add New Address</h3>
                <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      placeholder="+977-98XXXXXXXX"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Street / House Address</label>
                    <input
                      type="text"
                      required
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Province</label>
                      <select
                        value={newAddrProvince}
                        onChange={(e) => setNewAddrProvince(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                      >
                        <option value="Bagmati Province">Bagmati Province</option>
                        <option value="Gandaki Province">Gandaki Province</option>
                        <option value="Koshi Province">Koshi Province</option>
                        <option value="Madhesh Province">Madhesh Province</option>
                        <option value="Lumbini Province">Lumbini Province</option>
                        <option value="Karnali Province">Karnali Province</option>
                        <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACCOUNT SETTINGS TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 max-w-xl shadow-xs">
          <h3 className="text-base font-bold text-stone-900">Personal Information</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={currentUser.fullName}
                onChange={(e) => updateUserProfile({ fullName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-lg outline-hidden text-stone-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Primary Phone</label>
              <input
                type="tel"
                value={currentUser.phone || ''}
                onChange={(e) => updateUserProfile({ phone: e.target.value })}
                placeholder="+977-98XXXXXXXX"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={currentUser.avatarUrl || ''}
                onChange={(e) => updateUserProfile({ avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
