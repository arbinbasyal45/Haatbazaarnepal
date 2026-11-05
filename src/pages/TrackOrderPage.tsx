import React, { useState } from 'react';
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Order } from '../types';

interface TrackOrderPageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ onNavigate }) => {
  const { orders } = useMarketplace();
  const [searchNumber, setSearchNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanNum = searchNumber.trim().toUpperCase();
    if (!cleanNum) return;

    const found = orders.find(
      (o) => o.orderNumber.toUpperCase() === cleanNum || o.id === searchNumber.trim()
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMsg(`No order found matching "${searchNumber}". Try "HB-2026-9041" or check your order history.`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900">
          Track Your Delivery in Nepal
        </h1>
        <p className="text-xs text-stone-500">
          Enter your HaatBazaar tracking code (e.g. HB-2026-9041) to view real-time transit status.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Enter Order Code (e.g. HB-2026-9041)"
            className="flex-1 text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl uppercase outline-hidden font-mono"
          />
          <button
            type="submit"
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Track Parcel
          </button>
        </form>

        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {searchedOrder && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4 text-xs">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-bold">
                Order Tracking Code
              </span>
              <span className="font-mono font-black text-stone-900 text-base">
                #{searchedOrder.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">
                Estimated Delivery
              </span>
              <span className="font-bold text-emerald-800">1 - 2 Business Days</span>
            </div>
          </div>

          {/* Stepper */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-stone-900">Delivery Milestones</div>
            <div className="space-y-3">
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((statusKey, i) => {
                const reached = searchedOrder.statusHistory.some((h) => h.status === statusKey);
                const historyEntry = searchedOrder.statusHistory.find((h) => h.status === statusKey);

                return (
                  <div key={statusKey} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        reached
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-50'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {reached ? '✓' : i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-bold capitalize ${reached ? 'text-stone-900' : 'text-stone-400'}`}>
                          {statusKey === 'pending'
                            ? 'Order Placed'
                            : statusKey === 'confirmed'
                            ? 'Payment & Order Verified'
                            : statusKey === 'processing'
                            ? 'Dispatched to Courier Hub'
                            : statusKey === 'shipped'
                            ? 'Out for Delivery / In Transit'
                            : 'Delivered to Doorstep'}
                        </span>
                        {historyEntry && (
                          <span className="text-[10px] text-stone-400">
                            {new Date(historyEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      {historyEntry?.note && (
                        <p className="text-[11px] text-stone-500 mt-0.5">{historyEntry.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Address and Items summary */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="font-bold text-stone-800 block">Shipping Destination</span>
              <div className="text-stone-700">{searchedOrder.shippingAddress.fullName}</div>
              <div className="text-stone-500">
                {searchedOrder.shippingAddress.street}, {searchedOrder.shippingAddress.city},{' '}
                {searchedOrder.shippingAddress.province}
              </div>
              <div className="font-mono text-emerald-900 font-semibold">
                Phone: {searchedOrder.shippingAddress.phone}
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl space-y-1">
              <span className="font-bold text-stone-800 block">Payment Summary</span>
              <div className="text-stone-700 uppercase font-semibold">
                Gateway: {searchedOrder.paymentMethod}
              </div>
              <div className="text-stone-500">
                Payment Status: <strong className="text-stone-800 uppercase">{searchedOrder.paymentStatus}</strong>
              </div>
              <div className="font-mono font-bold text-stone-900">
                Total: Rs. {searchedOrder.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
