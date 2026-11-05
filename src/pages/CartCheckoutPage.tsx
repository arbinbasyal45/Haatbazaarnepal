import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
  MapPin,
  CreditCard,
  Building,
  Truck,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Address, PaymentMethod } from '../types';
import { PaymentService } from '../services/paymentService';

interface CartCheckoutProps {
  onNavigate: (view: string, data?: any) => void;
  onOpenAuthModal: () => void;
  initialStep?: 'cart' | 'checkout';
}

export const CartCheckoutPage: React.FC<CartCheckoutProps> = ({
  onNavigate,
  onOpenAuthModal,
  initialStep = 'cart'
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discountTotal,
    cartGrandTotal,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    currentUser,
    saveAddress,
    createOrder,
    settings,
    showToast
  } = useMarketplace();

  const [step, setStep] = useState<'cart' | 'checkout' | 'payment_process' | 'success'>(
    initialStep === 'checkout' && cart.length > 0 ? 'checkout' : 'cart'
  );

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; text?: string } | null>(null);

  // Checkout address selection state
  const defaultAddress = currentUser?.savedAddresses.find((a) => a.isDefault) || currentUser?.savedAddresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id || 'new');

  // New address form
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+977-98');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [province, setProvince] = useState('Bagmati Province');
  const [notes, setNotes] = useState('');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentOtp, setPaymentOtp] = useState('');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    setCouponFeedback({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    setStep('checkout');
  };

  const handleInitiateOrder = async () => {
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    // Determine target shipping address
    let shippingAddress: Address;
    const existing = currentUser.savedAddresses.find((a) => a.id === selectedAddressId);

    if (existing) {
      shippingAddress = existing;
    } else {
      if (!fullName.trim() || !phone.trim() || !street.trim()) {
        showToast('Please provide your complete name, phone number, and street address.');
        return;
      }
      shippingAddress = {
        id: `addr-${Date.now()}`,
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city,
        province,
        isDefault: true
      };
      saveAddress(shippingAddress);
    }

    setIsProcessingPayment(true);
    setStep('payment_process');

    try {
      // Create order in database
      const order = await createOrder({
        shippingAddress,
        paymentMethod,
        customerNotes: notes
      });

      setCreatedOrderNumber(order.orderNumber);

      // Verify payment through gateway simulation
      const verifyResult = await PaymentService.verifyPayment({
        gateway: paymentMethod,
        transactionId: order.paymentDetails?.transactionId || `TXN-${Date.now()}`,
        amount: order.totalAmount,
        referenceCode: order.orderNumber,
        verificationCode: paymentOtp || 'AUTO_VERIFIED'
      });

      setPaymentReceipt(verifyResult.receiptData);
      setIsProcessingPayment(false);
      setStep('success');
    } catch (e: any) {
      setIsProcessingPayment(false);
      showToast(e.message || 'Error processing order');
      setStep('checkout');
    }
  };

  // SUCCESS STEP VIEW
  if (step === 'success') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              ORDER CONFIRMED &bull; PAYMENT SUCCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-stone-900 mt-2">
              Dhanyabad! Your order is placed.
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Order Reference:{' '}
              <span className="font-mono font-bold text-stone-900">{createdOrderNumber}</span>
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left text-xs space-y-3">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <span className="font-bold text-stone-700">Payment Gateway</span>
              <span className="font-bold text-emerald-800 uppercase">
                {paymentMethod === 'esewa'
                  ? 'eSewa Nepal'
                  : paymentMethod === 'khalti'
                  ? 'Khalti Digital Wallet'
                  : paymentMethod === 'bank_transfer'
                  ? 'Nabil Bank Direct'
                  : 'Cash on Delivery (COD)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Amount Paid / Due</span>
              <span className="font-mono font-black text-stone-900 text-sm">
                Rs. {cartGrandTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Delivery Status</span>
              <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                CONFIRMED &bull; DISPATCH PENDING
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('customer-dashboard')}
              className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Track Order in Customer Portal
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PAYMENT IN-FLIGHT SIMULATION MODAL
  if (step === 'payment_process') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center space-y-6">
        <div className="w-16 h-16 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="text-xl font-bold font-serif text-stone-900">
          Connecting to {paymentMethod.toUpperCase()} Nepal Gateway...
        </h3>
        <p className="text-xs text-stone-500">
          Securing encrypted transaction handshake with merchant server. Please do not refresh.
        </p>
      </div>
    );
  }

  // EMPTY CART
  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black font-serif text-stone-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Explore authentic Nepali crafts, high performance smartphones, shoes, and organic foods.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-colors"
        >
          Start Shopping in HaatBazaar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center gap-3 text-xs font-bold text-stone-500">
        <span
          onClick={() => setStep('cart')}
          className={`cursor-pointer pb-1 border-b-2 transition-colors ${
            step === 'cart' ? 'border-emerald-800 text-emerald-950 font-black' : 'border-transparent'
          }`}
        >
          1. Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
        </span>
        <span>&rarr;</span>
        <span
          className={`pb-1 border-b-2 transition-colors ${
            step === 'checkout'
              ? 'border-emerald-800 text-emerald-950 font-black'
              : 'border-transparent'
          }`}
        >
          2. Delivery &amp; Nepali Payment
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Cart Items or Delivery/Payment Form */}
        <div className="lg:col-span-8 space-y-6">
          {step === 'cart' ? (
            /* CART VIEW */
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-lg font-black font-serif text-stone-900">Items in Your Cart</h2>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.productId} className="py-4 flex gap-4 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-emerald-800">
                        {item.product.brand} &bull; {item.product.sellerStoreName}
                      </div>
                      <h4
                        onClick={() => onNavigate('product-detail', { productId: item.productId })}
                        className="text-xs sm:text-sm font-bold text-stone-900 hover:text-emerald-800 cursor-pointer truncate"
                      >
                        {item.product.title}
                      </h4>
                      <div className="text-xs font-serif font-black text-stone-900 mt-1">
                        Rs. {item.selectedPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-stone-900 font-mono">
                        Rs. {(item.selectedPrice * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors mt-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* CHECKOUT STEP: ADDRESS & PAYMENT DETAILS */
            <div className="space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <h3 className="text-base font-black font-serif text-stone-900">
                    Delivery Address in Nepal
                  </h3>
                </div>

                {/* Existing saved addresses */}
                {currentUser && currentUser.savedAddresses.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700 block">
                      Choose Saved Address:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentUser.savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-emerald-700 bg-emerald-50/50 ring-2 ring-emerald-700/20'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="font-bold text-stone-900">{addr.fullName}</div>
                          <div className="text-stone-600 mt-0.5">{addr.street}</div>
                          <div className="text-stone-500">
                            {addr.city}, {addr.province}
                          </div>
                          <div className="text-[11px] font-mono text-emerald-900 mt-1 font-semibold">
                            Phone: {addr.phone}
                          </div>
                        </div>
                      ))}

                      <div
                        onClick={() => setSelectedAddressId('new')}
                        className={`p-3.5 rounded-xl border border-dashed text-xs flex items-center justify-center cursor-pointer transition-all ${
                          selectedAddressId === 'new'
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                            : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        + Add New Address
                      </div>
                    </div>
                  </div>
                )}

                {/* New Address Fields */}
                {(!currentUser || selectedAddressId === 'new') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Pooja Shrestha"
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+977-98XXXXXXXX"
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Street Address / Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. House 42, Baluwatar Prime Minister Lane 3"
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                      >
                        <option value="Kathmandu">Kathmandu</option>
                        <option value="Lalitpur">Lalitpur</option>
                        <option value="Bhaktapur">Bhaktapur</option>
                        <option value="Pokhara">Pokhara</option>
                        <option value="Biratnagar">Biratnagar</option>
                        <option value="Bharatpur">Bharatpur / Chitwan</option>
                        <option value="Butwal">Butwal</option>
                        <option value="Dharan">Dharan</option>
                        <option value="Nepalgunj">Nepalgunj</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Province
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
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
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <CreditCard className="w-4 h-4 text-emerald-800" />
                  <h3 className="text-base font-black font-serif text-stone-900">
                    Select Payment Gateway for Nepal
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* eSewa */}
                  <div
                    onClick={() => setPaymentMethod('esewa')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'esewa'
                        ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-green-700">eSewa Fonepay</span>
                      <span className="text-[10px] bg-green-100 text-green-800 font-extrabold px-2 py-0.5 rounded">
                        OFFICIAL GATEWAY
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Pay instantly via eSewa digital wallet or linked Nepali bank account.
                    </p>
                  </div>

                  {/* Khalti */}
                  <div
                    onClick={() => setPaymentMethod('khalti')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'khalti'
                        ? 'border-purple-700 bg-purple-50/60 ring-2 ring-purple-700/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-purple-700">Khalti Wallet</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded">
                        INSTANT CASHBACK
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Direct Khalti mobile number verification with secure PIN handshake.
                    </p>
                  </div>

                  {/* Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-stone-900">Bank Transfer</span>
                      <Building className="w-4 h-4 text-stone-500" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Nabil Bank / ConnectIPS direct account transfer.
                    </p>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-stone-900">Cash on Delivery</span>
                      <Truck className="w-4 h-4 text-stone-500" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Pay cash to delivery rider when parcel reaches your doorstep.
                    </p>
                  </div>
                </div>

                {/* Bank details note if selected */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                    <div className="font-bold text-stone-800">
                      Bank Name: {settings.bankAccountDetails.bankName}
                    </div>
                    <div className="text-stone-600">
                      Account Name: {settings.bankAccountDetails.accountName}
                    </div>
                    <div className="font-mono font-bold text-emerald-900">
                      A/C No: {settings.bankAccountDetails.accountNumber}
                    </div>
                    <div className="text-stone-500">
                      Branch: {settings.bankAccountDetails.branch}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs sticky top-24">
            <h3 className="text-base font-black font-serif text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-mono font-bold text-stone-900">
                  Rs. {cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Standard Delivery Fee</span>
                <span className="font-mono font-bold text-stone-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `Rs. ${deliveryFee}`
                  )}
                </span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Discount ({activeCoupon?.code})</span>
                  <span className="font-mono font-bold">
                    - Rs. {discountTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
                <span className="font-black text-stone-900 text-sm">Grand Total (NPR)</span>
                <span className="text-xl font-black text-stone-950 font-serif">
                  Rs. {cartGrandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="border-t border-stone-100 pt-4">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Discount Coupon
              </label>
              {activeCoupon ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{activeCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. HAAT10 or FESTIVE500"
                    className="flex-1 text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg uppercase outline-hidden"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3 py-2 rounded-lg"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p
                  className={`text-[11px] mt-1.5 font-medium ${
                    couponFeedback.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {couponFeedback.text}
                </p>
              )}
            </div>

            {/* Main CTA */}
            {step === 'cart' ? (
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/10"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleInitiateOrder}
                  disabled={isProcessingPayment}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/10 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Pay Rs. {cartGrandTotal.toLocaleString('en-IN')} via{' '}
                    {paymentMethod.toUpperCase()}
                  </span>
                </button>
                <button
                  onClick={() => setStep('cart')}
                  className="w-full text-center text-xs text-stone-500 hover:underline py-1"
                >
                  &larr; Back to Cart Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
