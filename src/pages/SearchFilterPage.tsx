import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';

interface SearchFilterPageProps {
  initialQuery?: string;
  initialCategory?: string;
  onNavigate: (view: string, data?: any) => void;
}

export const SearchFilterPage: React.FC<SearchFilterPageProps> = ({
  initialQuery = '',
  initialCategory = 'all',
  onNavigate
}) => {
  const { products, categories } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState<'all' | 'New' | 'Used'>('all');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'newest'>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Distinct cities from catalog
  const cities = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.locationCity));
    return Array.from(set);
  }, [products]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.approvalStatus !== 'approved') return false;

        // Query check
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCategory = p.categoryName.toLowerCase().includes(q);
          const matchStore = p.sellerStoreName.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchCategory && !matchStore) return false;
        }

        // Category check
        if (selectedCategory !== 'all') {
          const cat = categories.find((c) => c.slug === selectedCategory);
          if (cat && p.categoryId !== cat.id && p.categoryName !== cat.name) {
            return false;
          }
        }

        // City check
        if (selectedCity !== 'all' && p.locationCity !== selectedCity) {
          return false;
        }

        // Condition check
        if (selectedCondition !== 'all' && p.condition !== selectedCondition) {
          return false;
        }

        // Price check
        const price = p.discountPrice || p.price;
        if (minPrice !== '' && price < minPrice) return false;
        if (maxPrice !== '' && price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === 'price_low') return priceA - priceB;
        if (sortBy === 'price_high') return priceB - priceA;
        if (sortBy === 'newest')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default: popular
        return b.salesCount - a.salesCount;
      });
  }, [
    products,
    categories,
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedCondition,
    minPrice,
    maxPrice,
    sortBy
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSelectedCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('popular');
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Top Search Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex-1 min-w-[260px] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands, or cities in Nepal..."
            className="w-full text-xs py-2.5 pl-9 pr-4 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-emerald-700"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-3">
          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 py-2 px-3 rounded-xl outline-hidden cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-2 rounded-xl"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar Filter (Desktop) */}
        <div className={`space-y-6 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-1.5 font-black text-xs text-stone-900 uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-800" />
                <span>Filter Catalog</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-emerald-800 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 block">Category</label>
              <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors truncate ${
                      selectedCategory === c.slug
                        ? 'bg-emerald-800 text-white font-bold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 block">Price Range (NPR)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Rs."
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
                <input
                  type="number"
                  placeholder="Max Rs."
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
                />
              </div>
            </div>

            {/* City Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 block">Dispatched From</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden"
              >
                <option value="all">All Cities in Nepal</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Condition */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 block">Item Condition</label>
              <div className="flex gap-2">
                {(['all', 'New', 'Used'] as const).map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedCondition === cond
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {cond === 'all' ? 'All' : cond}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Showing <strong className="text-stone-900">{filteredProducts.length}</strong> products
              found
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No matching products found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your search terms, removing filters, or browsing other categories.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
