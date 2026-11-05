import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const FaqPage: React.FC = () => {
  const { settings } = useMarketplace();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Which payment methods are accepted in Nepal?',
      a: 'HaatBazaar supports official eSewa digital wallet, Khalti wallet, Direct Bank Transfer (Nabil Bank & ConnectIPS), and Cash on Delivery (COD) for orders delivered across Nepal.'
    },
    {
      q: 'How long does delivery take inside and outside Kathmandu Valley?',
      a: 'Deliveries inside Kathmandu, Lalitpur, and Bhaktapur typically take 2 to 24 hours. Outside the valley (Pokhara, Chitwan, Biratnagar, Butwal, Dharan, Nepalgunj), delivery takes 1 to 3 business days via our express courier network.'
    },
    {
      q: 'How do I become a verified seller on HaatBazaar?',
      a: 'Any registered business or artisan in Nepal with a valid 9-digit PAN (Permanent Account Number) and bank account can click "Become a Seller" to register their store within 2 minutes.'
    },
    {
      q: 'What is your return and refund policy?',
      a: 'We offer a 7-day hassle-free return guarantee for damaged, defective, or incorrect items. Return pickups are arranged at your address and refunds are credited back to your original payment gateway (eSewa, Khalti, or Bank).'
    },
    {
      q: 'Are the brand products authentic?',
      a: 'Yes, authorized retailers provide brand warranty cards (e.g. GenNext Apple Nepal warranty, official Goldstar stamps, certified Chyangra Pashmina seals).'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-stone-500">
          Find answers to common questions about ordering, deliveries, and vendor policies in Nepal.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-stone-900 hover:text-emerald-800"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform ${
                  openIndex === idx ? 'rotate-180 text-emerald-800' : ''
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Support Box */}
      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <h4 className="font-bold text-stone-900">Still have questions?</h4>
          <p className="text-stone-600 mt-0.5">Our Kathmandu support desk is open 7 days a week.</p>
        </div>
        <div className="flex items-center gap-3 font-semibold text-emerald-900">
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-emerald-700" />
            {settings.supportPhone.split('/')[0]}
          </span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4 text-emerald-700" />
            {settings.supportEmail}
          </span>
        </div>
      </div>
    </div>
  );
};
