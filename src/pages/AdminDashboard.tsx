import React, { useState } from 'react';
import {
  Shield,
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Sliders,
  Settings,
  Tag,
  Image,
  RefreshCw,
  AlertOctagon
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCategory, PromotionalBanner, Coupon } from '../types';

interface AdminDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    users,
    sellers,
    products,
    orders,
    categories,
    banners,
    coupons,
    settings,
    approveSeller,
    suspendUser,
    approveProduct,
    addCategory,
    deleteCategory,
    addBanner,
    deleteBanner,
    updateSettings,
    resetAllData,
    showToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'metrics' | 'sellers' | 'products' | 'categories' | 'coupons' | 'banners' | 'settings' | 'users'
  >('metrics');

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatImg, setNewCatImg] = useState('');

  // Banner modal
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('FESTIVAL PROMO');
  const [newBannerImg, setNewBannerImg] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Restricted Admin Access</h2>
        <p className="text-xs text-stone-500">Only authorized platform administrators may view this console.</p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-purple-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  // Summary Metrics
  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCompletedOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
  const pendingSellerApplications = sellers.filter((s) => s.status === 'pending');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory({
      name: newCatName,
      slug: newCatSlug || newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      iconName: 'Boxes',
      imageUrl: newCatImg || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
      displayOrder: categories.length + 1,
      featured: true
    });
    setNewCatName('');
    setNewCatSlug('');
    setNewCatImg('');
    setShowCategoryModal(false);
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle) return;
    addBanner({
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      badge: newBannerBadge,
      imageUrl: newBannerImg || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      targetLink: '/category/electronics',
      active: true,
      displayOrder: banners.length + 1
    });
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImg('');
    setShowBannerModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Admin Title Header */}
      <div className="bg-gradient-to-r from-purple-950 to-indigo-950 rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-800 text-purple-200 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-400 text-stone-900 font-black px-2 py-0.5 rounded uppercase">
                SUPER ADMIN CONSOLE
              </span>
              <span className="text-xs text-purple-200">
                Logged in as: {currentUser.fullName} ({currentUser.email})
              </span>
            </div>
            <h1 className="text-2xl font-black font-serif mt-1">HaatBazaar Master Admin</h1>
          </div>
        </div>

        <button
          onClick={resetAllData}
          className="bg-rose-900/60 hover:bg-rose-900 border border-rose-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Catalog to Defaults</span>
        </button>
      </div>

      {/* High-level Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Total Customers</span>
          <div className="text-xl font-black font-serif text-stone-900 mt-1">
            {users.filter((u) => u.role === 'customer').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Active Sellers</span>
          <div className="text-xl font-black font-serif text-emerald-800 mt-1">
            {sellers.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Total Products</span>
          <div className="text-xl font-black font-serif text-stone-900 mt-1">
            {products.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Total Orders</span>
          <div className="text-xl font-black font-serif text-stone-900 mt-1">
            {orders.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Total GMV Sales</span>
          <div className="text-base sm:text-lg font-black font-serif text-purple-900 mt-1 truncate">
            Rs. {totalSalesRevenue.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 font-medium">Categories</span>
          <div className="text-xl font-black font-serif text-stone-900 mt-1">
            {categories.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto text-xs font-bold text-stone-600 gap-2">
        {(
          [
            ['metrics', 'System Overview'],
            ['sellers', `Sellers (${sellers.length})`],
            ['products', `Products (${products.length})`],
            ['categories', `Categories (${categories.length})`],
            ['banners', `Banners (${banners.length})`],
            ['coupons', `Coupons (${coupons.length})`],
            ['users', `User Management (${users.length})`],
            ['settings', 'Payment & Platform Settings']
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-3 px-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === key ? 'border-purple-800 text-purple-950 font-black' : 'border-transparent hover:text-stone-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* SELLERS MANAGEMENT */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-900">Registered Vendor Stores</h3>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Store Name</th>
                  <th className="p-3">PAN / Tax ID</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sellers.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-stone-900">
                      <div>{s.storeName}</div>
                      <div className="text-[10px] text-stone-400 font-normal">{s.email}</div>
                    </td>
                    <td className="p-3 font-mono text-stone-700">{s.panNumber}</td>
                    <td className="p-3 text-stone-600">
                      {s.locationCity}, {s.locationProvince}
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          s.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-600">{s.rating} ★</td>
                    <td className="p-3 text-right space-x-2">
                      {s.status !== 'approved' ? (
                        <button
                          onClick={() => approveSeller(s.id, true)}
                          className="bg-emerald-800 text-white font-bold px-2.5 py-1 rounded text-[11px]"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => approveSeller(s.id, false)}
                          className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded text-[11px]"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTS MODERATION */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900">Marketplace Product Catalog Moderation</h3>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Price (NPR)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-9 h-9 rounded object-cover border border-stone-200"
                      />
                      <span className="font-bold text-stone-900 truncate max-w-xs">{p.title}</span>
                    </td>
                    <td className="p-3 text-stone-600">{p.sellerStoreName}</td>
                    <td className="p-3 font-mono font-bold text-stone-900">
                      Rs. {(p.discountPrice || p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          p.approvalStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.approvalStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {p.approvalStatus === 'approved' ? (
                        <button
                          onClick={() => approveProduct(p.id, false)}
                          className="text-rose-600 hover:underline font-bold"
                        >
                          Reject
                        </button>
                      ) : (
                        <button
                          onClick={() => approveProduct(p.id, true)}
                          className="text-emerald-700 hover:underline font-bold"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-900">Categories Architecture</h3>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-purple-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={c.imageUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="font-bold text-stone-900">{c.name}</div>
                    <div className="text-[10px] text-stone-400">slug: {c.slug}</div>
                  </div>
                </div>
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="text-stone-300 hover:text-rose-600 p-1"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Category Modal */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-xl text-xs">
                <h4 className="font-bold text-sm text-stone-900">Add New Marketplace Category</h4>
                <form onSubmit={handleCreateCategory} className="space-y-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Traditional Musical Instruments"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={newCatImg}
                      onChange={(e) => setNewCatImg(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(false)}
                      className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-900 text-white rounded-lg font-bold"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BANNERS MANAGEMENT */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-900">Homepage Hero Banners</h3>
            <button
              onClick={() => setShowBannerModal(true)}
              className="bg-purple-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                <img src={b.imageUrl} alt="" className="w-full h-32 object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] bg-amber-400 text-stone-900 font-extrabold px-1.5 py-0.5 rounded uppercase">
                        {b.badge}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900 mt-1">{b.title}</h4>
                      <p className="text-xs text-stone-500">{b.subtitle}</p>
                    </div>
                    <button
                      onClick={() => deleteBanner(b.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Banner Modal */}
          {showBannerModal && (
            <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-xl text-xs">
                <h4 className="font-bold text-sm text-stone-900">Add Homepage Banner</h4>
                <form onSubmit={handleCreateBanner} className="space-y-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Banner Title</label>
                    <input
                      type="text"
                      required
                      value={newBannerTitle}
                      onChange={(e) => setNewBannerTitle(e.target.value)}
                      placeholder="e.g. New Year Mega Clearance"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={newBannerSubtitle}
                      onChange={(e) => setNewBannerSubtitle(e.target.value)}
                      placeholder="Up to 40% OFF"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={newBannerImg}
                      onChange={(e) => setNewBannerImg(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBannerModal(false)}
                      className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-900 text-white rounded-lg font-bold"
                    >
                      Publish Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLATFORM SETTINGS & PAYMENTS CONFIG */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-2xl space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-stone-900">
            Payment Gateways &amp; Platform Settings
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                eSewa Merchant Code (Sandbox / Live)
              </label>
              <input
                type="text"
                value={settings.esewaMerchantCode}
                onChange={(e) => updateSettings({ esewaMerchantCode: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Khalti Public Key (Sandbox / Live)
              </label>
              <input
                type="text"
                value={settings.khaltiPublicKey}
                onChange={(e) => updateSettings({ khaltiPublicKey: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Default Delivery Fee (NPR)
                </label>
                <input
                  type="number"
                  value={settings.defaultDeliveryFee}
                  onChange={(e) => updateSettings({ defaultDeliveryFee: Number(e.target.value) })}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Free Delivery Threshold (NPR)
                </label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => updateSettings({ freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Announcement Top Bar Text
              </label>
              <input
                type="text"
                value={settings.announcementText || ''}
                onChange={(e) => updateSettings({ announcementText: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900">User Account Controls</h3>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{u.fullName}</div>
                      <div className="text-[10px] text-stone-400">{u.email}</div>
                    </td>
                    <td className="p-3 uppercase font-bold text-[10px]">{u.role}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => suspendUser(u.id, u.status === 'active')}
                          className="font-bold text-rose-600 hover:underline"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OVERVIEW METRICS */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            <h4 className="font-bold text-sm text-stone-900">Recent Marketplace Orders</h4>
            <div className="space-y-2 text-xs">
              {orders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="p-3 bg-stone-50 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-stone-900">#{o.orderNumber}</span>
                    <div className="text-[11px] text-stone-500">
                      {o.customerName} &bull; {o.paymentMethod.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-stone-900">
                      Rs. {o.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <div className="text-[10px] text-emerald-800 font-bold uppercase">
                      {o.orderStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            <h4 className="font-bold text-sm text-stone-900">Nepali Platform Architecture</h4>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="p-2.5 bg-emerald-50 text-emerald-950 rounded-lg">
                <strong>eSewa &amp; Khalti Ready:</strong> Instant verified payment callbacks configured with merchant sandbox parameters.
              </div>
              <div className="p-2.5 bg-stone-50 rounded-lg">
                <strong>7 Provinces Supported:</strong> Real-time regional address mapping for Bagmati, Gandaki, Koshi, Lumbini, Madhesh, Karnali &amp; Sudurpashchim.
              </div>
              <div className="p-2.5 bg-purple-50 text-purple-950 rounded-lg">
                <strong>Multi-Vendor RBAC:</strong> Strict boundary separation between Customers, Verified Sellers, and Master Administrators.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
