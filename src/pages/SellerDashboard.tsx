import React, { useState } from 'react';
import {
  Store,
  Package,
  TrendingUp,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  AlertTriangle,
  Upload,
  ChevronRight,
  Eye,
  Settings
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product, OrderStatus } from '../types';

interface SellerDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    currentSeller,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    categories,
    showToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states for adding/editing product
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-1');
  const [price, setPrice] = useState<number>(1000);
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number>(10);
  const [condition, setCondition] = useState<'New' | 'Used'>('New');
  const [imageUrl, setImageUrl] = useState('');
  const [locationCity, setLocationCity] = useState(currentSeller?.locationCity || 'Kathmandu');

  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Seller Account Required</h2>
        <p className="text-xs text-stone-500">
          You are currently signed in as {currentUser?.fullName || 'Guest'}.
        </p>
        <button
          onClick={() => onNavigate('seller-register')}
          className="bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          Register as a Vendor on HaatBazaar
        </button>
      </div>
    );
  }

  // Seller's scoped catalog & orders
  const myProducts = products.filter(
    (p) => p.sellerId === currentSeller?.id || p.sellerStoreName === currentSeller?.storeName
  );

  const myOrders = orders.filter((o) =>
    o.sellerIds.includes(currentSeller?.id || '') ||
    o.items.some((i) => i.sellerId === currentSeller?.id || i.sellerStoreName === currentSeller?.storeName)
  );

  // Calculated metrics
  const totalRevenue = myOrders
    .filter((o) => o.paymentStatus === 'completed')
    .reduce((sum, o) => {
      // Sum only items belonging to this seller
      const sellerItemTotal = o.items
        .filter((i) => i.sellerId === currentSeller?.id || i.sellerStoreName === currentSeller?.storeName)
        .reduce((s, i) => s + i.price * i.quantity, 0);
      return sum + sellerItemTotal;
    }, 0);

  const pendingOrdersCount = myOrders.filter((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'pending').length;

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setTitle('');
    setDescription('');
    setBrand('');
    setCategoryId(categories[0]?.id || 'cat-1');
    setPrice(1000);
    setDiscountPrice('');
    setStock(10);
    setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setTitle(prod.title);
    setDescription(prod.description);
    setBrand(prod.brand);
    setCategoryId(prod.categoryId);
    setPrice(prod.price);
    setDiscountPrice(prod.discountPrice || '');
    setStock(prod.stock);
    setImageUrl(prod.images[0] || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price) return;

    const cat = categories.find((c) => c.id === categoryId);

    if (editingProductId) {
      updateProduct(editingProductId, {
        title,
        description,
        brand,
        categoryId,
        categoryName: cat?.name || 'General',
        price,
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        stock,
        condition,
        images: [imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
        locationCity
      });
    } else {
      addProduct({
        sellerId: currentSeller?.id || 'sel-default',
        sellerStoreName: currentSeller?.storeName || 'My Store',
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
        categoryId,
        categoryName: cat?.name || 'General',
        brand: brand || 'Generic',
        price,
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        images: [imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
        stock,
        condition,
        specifications: [{ key: 'Condition', value: condition }],
        locationCity,
        locationProvince: currentSeller?.locationProvince || 'Bagmati Province',
        isAvailable: true,
        approvalStatus: 'approved'
      });
    }

    setShowProductModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Seller Header */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-400 text-stone-900 font-black px-2 py-0.5 rounded uppercase">
              VERIFIED VENDOR
            </span>
            <span className="text-xs text-emerald-300">
              PAN: {currentSeller?.panNumber || '602345891'}
            </span>
          </div>
          <h1 className="text-2xl font-black font-serif mt-1">
            {currentSeller?.storeName || 'My Vendor Hub'}
          </h1>
          <p className="text-xs text-emerald-200">
            {currentSeller?.locationCity}, {currentSeller?.locationProvince} &bull; Rating:{' '}
            {currentSeller?.rating || 4.9} ★
          </p>
        </div>

        <button
          onClick={handleOpenAddProduct}
          className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Revenue</span>
          <div className="text-xl font-black font-serif text-stone-900 mt-1">
            Rs. {totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">5% Platform Commission</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Active Products</span>
          <div className="text-xl font-black font-serif text-stone-900 mt-1">
            {myProducts.length}
          </div>
          <span className="text-[10px] text-stone-400">All live in marketplace</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Pending Orders</span>
          <div className="text-xl font-black font-serif text-amber-700 mt-1">
            {pendingOrdersCount}
          </div>
          <span className="text-[10px] text-amber-600 font-bold">Needs fulfillment dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Orders Received</span>
          <div className="text-xl font-black font-serif text-stone-900 mt-1">
            {myOrders.length}
          </div>
          <span className="text-[10px] text-stone-400">Across Nepal</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-stone-200 gap-2 text-xs font-bold text-stone-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'overview' ? 'border-emerald-800 text-emerald-900' : 'border-transparent'
          }`}
        >
          Store Inventory ({myProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'orders' ? 'border-emerald-800 text-emerald-900' : 'border-transparent'
          }`}
        >
          Customer Orders Received ({myOrders.length})
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-900">Your Listed Products</h3>
            <button
              onClick={handleOpenAddProduct}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Selling Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Sales</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {myProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400">
                      No products added yet. Click &ldquo;Add New Product&rdquo; to publish your first listing.
                    </td>
                  </tr>
                ) : (
                  myProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="p-3 flex items-center gap-2.5">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                        />
                        <div className="max-w-xs">
                          <div className="font-bold text-stone-900 truncate">{p.title}</div>
                          <div className="text-[10px] text-stone-400">{p.brand}</div>
                        </div>
                      </td>
                      <td className="p-3 text-stone-600">{p.categoryName}</td>
                      <td className="p-3 font-mono font-bold text-stone-900">
                        Rs. {(p.discountPrice || p.price).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            p.stock <= 3
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3 text-stone-600">{p.salesCount} sold</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="text-emerald-800 hover:text-emerald-950 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900">Customer Fulfillment Orders</h3>

          <div className="space-y-3">
            {myOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-400">
                No customer orders received yet.
              </div>
            ) : (
              myOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between text-xs border-b border-stone-100 pb-2">
                    <div>
                      <span className="font-mono font-bold text-stone-900">#{ord.orderNumber}</span>
                      <span className="text-stone-400 ml-2">Customer: {ord.customerName} ({ord.customerPhone})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-stone-500">Update Status:</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus, `Seller marked as ${e.target.value}`)}
                        className="bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs font-bold text-stone-800"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing / Packing</option>
                        <option value="shipped">Shipped / In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600">
                    <span className="font-bold">Shipping to:</span> {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.province}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black font-serif text-stone-900">
              {editingProductId ? 'Edit Product Listing' : 'Publish New Product to HaatBazaar'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Handmade Palpali Dhaka Scarf"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Goldstar, Apple, Local"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (NPR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Price (NPR)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Optional"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe authentic Nepali origin, features, warranty, specifications..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-bold"
                >
                  Save &amp; Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
