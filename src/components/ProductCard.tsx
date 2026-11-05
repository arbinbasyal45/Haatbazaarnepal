import React from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  MapPin,
  CheckCircle,
  Eye,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (view: string, data?: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart, wishlist, toggleWishlist } = useMarketplace();
  const isWishlisted = wishlist.includes(product.id);

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl border border-stone-200 hover:border-emerald-700/50 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {hasDiscount && (
          <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs tracking-wider">
            -{discountPercent}% OFF
          </span>
        )}
        {product.condition === 'New' && (
          <span className="bg-emerald-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
            Brand New
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
            : 'bg-white/90 text-stone-500 hover:text-rose-500 hover:bg-white shadow-xs'
        }`}
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
      </button>

      {/* Product Image */}
      <div
        onClick={() => onNavigate('product-detail', { productId: product.id })}
        className="w-full pt-[80%] relative overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-amber-500/90 text-stone-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
            Only {product.stock} left in Nepal!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
            <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="font-semibold text-emerald-800 uppercase tracking-wider">{product.brand}</span>
            <span className="flex items-center gap-0.5 text-stone-400">
              <MapPin className="w-3 h-3 text-stone-400" />
              {product.locationCity}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onNavigate('product-detail', { productId: product.id })}
            className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 hover:text-emerald-800 cursor-pointer transition-colors mb-2"
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-stone-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-[11px] text-stone-400">({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-stone-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-xs text-stone-500 font-medium">Price in Nepal</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-stone-950 font-serif">
                Rs. {displayPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through">
                  Rs. {product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            className={`p-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              product.stock === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
