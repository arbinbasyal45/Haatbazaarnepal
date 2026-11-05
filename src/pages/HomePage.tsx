import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  Flame,
  TrendingUp,
  Percent,
  Award,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { categories, products, banners, showToast } = useMarketplace();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Grouped products
  const featuredProducts = products.filter((p) => p.isFeatured && p.approvalStatus === 'approved');
  const trendingProducts = products.filter((p) => p.isTrending && p.approvalStatus === 'approved');
  const latestProducts = [...products]
    .filter((p) => p.approvalStatus === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  const bestSellers = products.filter((p) => p.isBestSeller && p.approvalStatus === 'approved');
  const discountProducts = products.filter(
    (p) => p.discountPrice && p.discountPrice < p.price && p.approvalStatus === 'approved'
  );

  const activeBanner = banners[activeBannerIndex] || banners[0];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      showToast('Thank you for subscribing to HaatBazaar exclusive deals!');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner Slider */}
      <section className="relative overflow-hidden bg-emerald-950 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Banner Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-stone-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {activeBanner.badge || 'SPECIAL OFFER'}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif leading-tight text-white">
                {activeBanner.title}
              </h1>

              <p className="text-emerald-100 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                {activeBanner.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('search', {})}
                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold px-6 py-3 rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-2 text-sm"
                >
                  <span>Explore All Deals</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('seller-register')}
                  className="bg-emerald-900/80 hover:bg-emerald-900 border border-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                >
                  Sell on HaatBazaar
                </button>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-2 pt-4">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBannerIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeBannerIndex ? 'w-8 bg-amber-400' : 'w-2 bg-emerald-800'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Banner Image Display */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-800 aspect-4/3">
                <img
                  src={activeBanner.imageUrl}
                  alt={activeBanner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-xs text-emerald-200">
                    Trusted by 10,000+ shoppers across Kathmandu, Pokhara, Chitwan &amp; beyond.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Value Pillars */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Nationwide Delivery</h4>
              <p className="text-[11px] text-stone-500">All 7 Provinces of Nepal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Secure Payments</h4>
              <p className="text-[11px] text-stone-500">eSewa, Khalti &amp; Bank Transfer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">7-Day Easy Returns</h4>
              <p className="text-[11px] text-stone-500">Hassle-free guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">24/7 Nepali Support</h4>
              <p className="text-[11px] text-stone-500">Direct phone &amp; email help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs text-stone-500">Explore authentic Nepali handicrafts, gadgets, fashion &amp; more</p>
          </div>
          <button
            onClick={() => onNavigate('search', {})}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onNavigate('category', { categorySlug: category.slug })}
              className="group bg-white rounded-xl border border-stone-200 hover:border-emerald-600 p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-stone-100 ring-2 ring-stone-100 group-hover:ring-emerald-700/30 transition-all">
                <img
                  src={category.imageUrl || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-bold text-stone-800 group-hover:text-emerald-800 line-clamp-1">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 tracking-tight">
                Featured Highlights
              </h2>
              <p className="text-xs text-stone-500">Hand-curated top products across Nepal</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('search', {})}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>See more</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Discount & Special Deals (Nepali Festive Spotlight) */}
      {discountProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-6 text-white mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs bg-rose-600 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-white">
                  LIMITED TIME SAVINGS
                </span>
                <h3 className="text-2xl font-black font-serif mt-1">Super Discount Deals</h3>
                <p className="text-xs text-emerald-200">Huge savings with verified seller warranty</p>
              </div>
              <button
                onClick={() => onNavigate('search', {})}
                className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                Browse All Discounts
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {discountProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* Trending & Best Selling Tabs */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 tracking-tight">
                Trending in Nepal
              </h2>
              <p className="text-xs text-stone-500">Most clicked and favored by shoppers this week</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-stone-900 tracking-tight">
                Just Arrived
              </h2>
              <p className="text-xs text-stone-500">Newly listed items from verified vendors across the country</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {latestProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Authentic Nepali Brands Showcase */}
      <section className="container mx-auto px-4">
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 md:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100/60 px-3 py-1 rounded-full">
              Made in Nepal &bull; Hamro Gaurav
            </span>
            <h3 className="text-2xl font-black font-serif text-stone-900 mt-2">
              Popular Brands &amp; Heritage Artisans
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Empowering local craftsmanship from the streets of Patan to the high hills of Ilam
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => onNavigate('search', { query: 'Goldstar' })}
              className="bg-white p-4 rounded-xl border border-stone-200 text-center hover:border-emerald-700 cursor-pointer transition-all shadow-xs"
            >
              <div className="font-black text-lg text-stone-900 tracking-wider">GOLDSTAR</div>
              <p className="text-[11px] text-stone-500 mt-0.5">Nepal&apos;s Iconic Footwear</p>
            </div>

            <div
              onClick={() => onNavigate('search', { query: 'Pashmina' })}
              className="bg-white p-4 rounded-xl border border-stone-200 text-center hover:border-emerald-700 cursor-pointer transition-all shadow-xs"
            >
              <div className="font-black text-lg text-emerald-900 tracking-wider">CHYANGRA PASHMINA</div>
              <p className="text-[11px] text-stone-500 mt-0.5">Authentic Himalayan Cashmere</p>
            </div>

            <div
              onClick={() => onNavigate('search', { query: 'Dhaka' })}
              className="bg-white p-4 rounded-xl border border-stone-200 text-center hover:border-emerald-700 cursor-pointer transition-all shadow-xs"
            >
              <div className="font-black text-lg text-stone-900 tracking-wider">PALPALI DHAKA</div>
              <p className="text-[11px] text-stone-500 mt-0.5">Traditional Handloom Weaves</p>
            </div>

            <div
              onClick={() => onNavigate('search', { query: 'Ilam' })}
              className="bg-white p-4 rounded-xl border border-stone-200 text-center hover:border-emerald-700 cursor-pointer transition-all shadow-xs"
            >
              <div className="font-black text-lg text-emerald-800 tracking-wider">ILAM TEA ESTATES</div>
              <p className="text-[11px] text-stone-500 mt-0.5">First Flush Mountain Harvest</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-black font-serif text-stone-900 tracking-tight">
            Loved by Shoppers Across Nepal
          </h2>
          <p className="text-xs text-stone-500 mt-1">Real feedback from verified purchasers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              &ldquo;Ordered my iPhone 15 Pro Max in Kathmandu at 10 AM, received it at Baluwatar by 1 PM! Original sealed pack with GenNext warranty card. Outstanding service!&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="Pooja Shrestha"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h5 className="text-xs font-bold text-stone-900">Pooja Shrestha</h5>
                <p className="text-[10px] text-stone-400">Kathmandu &bull; Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              &ldquo;The Changthangi Cashmere shawl is authentic and ultra-soft. My mother was so thrilled with the gift. Seamless Khalti payment too.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                BA
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900">Bikash Adhikari</h5>
                <p className="text-[10px] text-stone-400">Pokhara &bull; Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              &ldquo;As a seller from New Road, HaatBazaar gave our electronics shop customers all over Chitwan and Butwal. Instant settlements and clear commission!&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Sunil Shakya"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h5 className="text-xs font-bold text-stone-900">Sunil Shakya</h5>
                <p className="text-[10px] text-stone-400">New Road Vendor &bull; Verified Store</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="container mx-auto px-4">
        <div className="bg-emerald-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-bold bg-amber-400 text-stone-900 px-3 py-1 rounded-full uppercase tracking-wider">
              HAATBAZAAR VIP CLUB
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif">
              Get Special Discount Coupons in Your Inbox
            </h3>
            <p className="text-xs text-emerald-100 max-w-md mx-auto">
              Subscribe to receive weekly flash sales, Dashain &amp; Tihar vouchers, and new product alerts.
            </p>

            {newsletterSubscribed ? (
              <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You&apos;re subscribed! Use coupon code &apos;HAAT10&apos; for 10% off your first order.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email (e.g., name@gmail.com)"
                  className="bg-white text-stone-900 text-xs px-4 py-3 rounded-xl flex-1 outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs px-6 py-3 rounded-xl transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
