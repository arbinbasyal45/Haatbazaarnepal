import React, { useState } from 'react';
import { Store, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface SellerRegistrationPageProps {
  onNavigate: (view: string, data?: any) => void;
  onOpenAuthModal: () => void;
}

export const SellerRegistrationPage: React.FC<SellerRegistrationPageProps> = ({
  onNavigate,
  onOpenAuthModal
}) => {
  const { currentUser, registerSeller } = useMarketplace();

  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '+977-98');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [panNumber, setPanNumber] = useState('');
  const [businessReg, setBusinessReg] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [province, setProvince] = useState('Bagmati Province');
  const [bankName, setBankName] = useState('Nabil Bank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branch, setBranch] = useState('New Road Branch');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    setIsSubmitting(true);
    try {
      await registerSeller({
        storeName,
        storeSlug: storeName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
        phone,
        email: email || currentUser.email,
        panNumber,
        businessRegistrationNumber: businessReg,
        locationCity: city,
        locationProvince: province,
        bankDetails: {
          bankName,
          accountName: accountName || storeName,
          accountNumber,
          branch
        },
        commissionRate: 5
      });
      onNavigate('seller-dashboard');
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-stone-900">
          Become a Verified Seller on HaatBazaar
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Reach thousands of shoppers across Kathmandu, Pokhara, Chitwan, Biratnagar, and all 7 provinces of Nepal.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="border-b border-stone-100 pb-2 font-bold text-sm text-stone-900">
            Store &amp; Business Information
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Store / Business Name *</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Pokhara Heritage Handicrafts"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Store Description *</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell buyers what makes your products authentic..."
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">PAN Number (9 Digits) *</label>
              <input
                type="text"
                required
                maxLength={9}
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="60XXXXXXXX"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Business Reg No. (Optional)</label>
              <input
                type="text"
                value={businessReg}
                onChange={(e) => setBusinessReg(e.target.value)}
                placeholder="REG-2024-..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Location City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Province *</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
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

          <div className="border-b border-stone-100 pt-3 pb-2 font-bold text-sm text-stone-900">
            Bank Settlement Details (For Payouts)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Bank Name *</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Account Holder Name *</label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Name as in bank"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Account Number *</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="001001000XXXXX"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/10"
            >
              <span>Submit Application &amp; Launch Vendor Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
