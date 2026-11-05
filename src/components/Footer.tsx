import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface FooterProps {
  onNavigate: (view: string, data?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { categories, settings } = useMarketplace();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 text-xs">
      <div className="container mx-auto px-4 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-lg shadow-md">
                HB
              </div>
              <span className="text-2xl font-black font-serif text-white tracking-tight">
                Haat<span className="text-emerald-500">Bazaar</span>
              </span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Nepal&apos;s premier multi-vendor e-commerce marketplace. Connecting authentic Nepali artisans, retailers, and major electronics distributors with buyers nationwide.
            </p>

            <div className="space-y-1.5 text-stone-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{settings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{settings.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-stone-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category', { categorySlug: cat.slug })}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customer-dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  My Account &amp; History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Return &amp; Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Help Center &amp; FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Seller & Payments in Nepal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Vendor &amp; Payments
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('seller-register')}
                  className="hover:text-emerald-400 transition-colors text-amber-400 font-bold"
                >
                  Sell on HaatBazaar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('seller-dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Seller Central Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-emerald-400 transition-colors text-purple-400"
                >
                  Administrator Portal
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">
                Accepted Gateways in Nepal
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-stone-800 text-green-400 px-2 py-1 rounded text-[10px] font-bold">
                  eSewa
                </span>
                <span className="bg-stone-800 text-purple-400 px-2 py-1 rounded text-[10px] font-bold">
                  Khalti
                </span>
                <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded text-[10px] font-bold">
                  ConnectIPS
                </span>
                <span className="bg-stone-800 text-amber-400 px-2 py-1 rounded text-[10px] font-bold">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-stone-800 pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            &copy; {new Date().getFullYear()} HaatBazaar E-Commerce Pvt. Ltd. All rights reserved. Registered under Government of Nepal Department of Commerce.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Built with pride for</span>
            <span className="text-white font-bold">Nepal 🇳🇵</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
