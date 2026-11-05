/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchFilterPage } from './pages/SearchFilterPage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { SellerDashboard } from './pages/SellerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SellerRegistrationPage } from './pages/SellerRegistrationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { FaqPage } from './pages/FaqPage';

function MarketplaceApp() {
  const [activeView, setActiveView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<any>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toastMessage } = useMarketplace();

  const handleNavigate = (view: string, data: any = {}) => {
    setActiveView(view);
    setViewParams(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased selection:bg-emerald-800 selection:text-white">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-2 max-w-sm animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Header */}
      <Navbar
        onNavigate={handleNavigate}
        activeView={activeView}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomePage onNavigate={handleNavigate} />}

        {activeView === 'product-detail' && (
          <ProductDetailPage
            productId={viewParams.productId}
            onNavigate={handleNavigate}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {(activeView === 'search' || activeView === 'category') && (
          <SearchFilterPage
            initialQuery={viewParams.query || ''}
            initialCategory={viewParams.categorySlug || viewParams.category || 'all'}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'cart' && (
          <CartCheckoutPage
            initialStep="cart"
            onNavigate={handleNavigate}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeView === 'checkout' && (
          <CartCheckoutPage
            initialStep="checkout"
            onNavigate={handleNavigate}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {(activeView === 'customer-dashboard' || activeView === 'wishlist') && (
          <CustomerDashboard onNavigate={handleNavigate} />
        )}

        {activeView === 'seller-dashboard' && (
          <SellerDashboard onNavigate={handleNavigate} />
        )}

        {activeView === 'admin-dashboard' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}

        {activeView === 'seller-register' && (
          <SellerRegistrationPage
            onNavigate={handleNavigate}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeView === 'track-order' && (
          <TrackOrderPage onNavigate={handleNavigate} />
        )}

        {activeView === 'faq' && <FaqPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => handleNavigate('customer-dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceApp />
    </MarketplaceProvider>
  );
}
