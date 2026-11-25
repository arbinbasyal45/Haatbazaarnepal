import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Shield,
  Store,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Sparkles,
  LogOut,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';


interface NavbarProps {
  onNavigate: (view: string, data?: any) => void;
  activeView: string;
  onOpenAuthModal: () => void;
}


export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView, onOpenAuthModal }) => {
  const {
    currentUser,
    cart,
    wishlist,
    categories,
    settings,
    products,
  // Filtered live suggestions
  const suggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      onNavigate('search', { query: searchQuery, category: selectedCategory });
    }
  };


  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-950 text-white text-xs px-4 py-1.5 flex justify-between items-center tracking-wide">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
              NEPAL&apos;S BAZAAR
            </span>
            <span className="hidden sm:inline font-medium text-emerald-100">
              {settings.announcementText || 'Nationwide delivery across all 7 provinces | Pay with eSewa, Khalti & COD'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200 text-xs">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              {settings.supportPhone.split('/')[0]}
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              {settings.supportEmail}
            </span>
            {/* Quick Role Switcher for instant testing */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1 text-[11px] transition-colors"
                title="Switch role for testing"
              >
                <Shield className="w-3 h-3 text-emerald-300" />
                <span>Role: {currentUser?.role?.toUpperCase() || 'GUEST'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tight">HB</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-emerald-950 font-serif">
                  Haat<span className="text-emerald-700">Bazaar</span>
                </span>
                <span className="text-[10px] bg-amber-400 text-stone-900 font-extrabold px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                  NP
                </span>
              </div>
              <p className="text-[10px] font-medium text-stone-500 tracking-wider uppercase -mt-0.5">
                Nepal&apos;s Mega Online Marketplace
              </p>
            </div>
          </div>


          {/* Search Bar with Category Dropdown & Suggestions */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center border-2 border-emerald-800/80 rounded-xl overflow-hidden focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-600/20 shadow-xs"
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter products by category"
                className="bg-stone-50 border-r border-stone-300 text-xs text-stone-700 font-medium px-3 py-2.5 outline-hidden cursor-pointer max-w-[140px] truncate"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>


              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search smartphones, pashmina, Goldstar shoes, Ilam tea..."
                className="w-full px-3.5 py-2 text-sm text-stone-800 placeholder-stone-400 outline-hidden bg-white"
              />


              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 transition-colors flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>


            {/* Suggestions Overlay */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50">
                <div className="p-2 border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Product Suggestions
                </div>
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowSuggestions(false);
                      onNavigate('product-detail', { productId: p.id });
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-stone-50 last:border-0"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-10 h-10 rounded-md object-cover border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-800 truncate">{p.title}</p>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-bold text-emerald-800">
                          Rs. {(p.discountPrice || p.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-stone-400">&bull;</span>
                        <span className="text-stone-500">{p.categoryName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Right Action Icons: Dashboards, Cart, Wishlist, Account */}
          <div className="flex items-center gap-3">
            {/* Seller Portal Link */}
            {currentUser?.role === 'seller' ? (
              <button
                onClick={() => onNavigate('seller-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'seller-dashboard'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Seller Hub</span>
              </button>
            ) : currentUser?.role === 'admin' ? (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'admin-dashboard'
                    ? 'bg-purple-900 text-white'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentUser) {
                    onNavigate('seller-register');
                  } else {
                    onOpenAuthModal();
                  }
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-emerald-700" />
                <span>Become a Seller</span>
              </button>
            )}


            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 rounded-lg text-stone-600 hover:text-emerald-800 hover:bg-stone-100 transition-colors"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>


            {/* Shopping Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative flex items-center gap-2 p-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold transition-colors"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-emerald-800" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">
                {totalCartCount > 0 ? Rs. ${cart.reduce((s, i) => s + i.selectedPrice * i.quantity, 0).toLocaleString('en-IN')} : 'Cart'}
              </span>
            </button>


            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative group">
                <button
                  onClick={() => onNavigate('customer-dashboard')}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-700/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.fullName.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-stone-800 hidden xl:inline max-w-[100px] truncate">
                    {currentUser.fullName}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}


            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>


        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products in Nepal..."
              className="w-full px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 outline-hidden"
            />
            <button type="submit" className="bg-emerald-800 text-white px-3 py-2">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>


      {/* Horizontal Category Navigation Bar */}
      <nav className="bg-stone-50 border-t border-stone-200 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs font-semibold text-stone-700">
          <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                activeView === 'home'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'hover:bg-stone-200 text-stone-800'
              }`}
            >
              All Categories &amp; Deals
            </button>
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('category', { categorySlug: cat.slug })}
                className="px-3 py-1 rounded-md hover:bg-stone-200 text-stone-700 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
          </div>


          <div className="flex items-center gap-3 shrink-0 pl-4 py-2 text-emerald-800 font-bold">
            <button
              onClick={() => onNavigate('track-order')}
              className="hover:underline flex items-center gap-1 text-[11px]"
            >
              Track Order
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => onNavigate('faq')}
              className="hover:underline text-[11px]"
            >
              Help &amp; FAQs
            </button>
          </div>
        </div>
      </nav>


      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="font-bold text-stone-700 text-xs">Categories</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-xs text-stone-500">
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('category', { categorySlug: c.slug });
                }}
                className="text-left py-1.5 px-2 rounded-md hover:bg-emerald-50 text-stone-700 font-medium"
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('customer-dashboard');
              }}
              className="w-full text-left py-2 px-3 rounded-lg bg-stone-100 font-semibold text-xs flex items-center justify-between"
            >
              <span>Customer Account &amp; Orders</span>
              <User className="w-4 h-4 text-emerald-800" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('seller-dashboard');
              }}
              className="w-full text-left py-2 px-3 rounded-lg bg-emerald-50 font-semibold text-xs text-emerald-900 flex items-center justify-between"
            >
              <span>Seller Central</span>
              <Store className="w-4 h-4 text-emerald-800" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin-dashboard');
              }}
              className="w-full text-left py-2 px-3 rounded-lg bg-purple-50 font-semibold text-xs text-purple-900 flex items-center justify-between"
            >
              <span>Administrator Portal</span>
              <Shield className="w-4 h-4 text-purple-800" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
