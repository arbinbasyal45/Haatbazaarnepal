import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingCart,
  MapPin,
  Check,
  Store,
  ChevronRight,
  MessageSquare,
  Share2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (view: string, data?: any) => void;
  onOpenAuthModal: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
  onOpenAuthModal
}) => {
  const {
    products,
    reviews,
    addReview,
    currentUser,
    addToCart,
    wishlist,
    toggleWishlist,
    showToast,
    orders
  } = useMarketplace();

  const product = products.find((p) => p.id === productId) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-800">Product Not Found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'published');
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  // Check if current user has purchased this product (Verified Purchase check)
  const hasPurchased = Boolean(
    currentUser &&
      orders.some(
        (o) =>
          o.userId === currentUser.id &&
          o.items.some((item) => item.productId === product.id) &&
          (o.orderStatus === 'delivered' || o.orderStatus === 'confirmed' || o.orderStatus === 'shipped')
      )
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    addReview({
      productId: product.id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userAvatar: currentUser.avatarUrl,
      rating: newRating,
      comment: newComment.trim(),
      verifiedPurchase: hasPurchased
    });

    setNewComment('');
    setIsSubmittingReview(false);
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <button onClick={() => onNavigate('home')} className="hover:text-emerald-800">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <button
          onClick={() => onNavigate('category', { categorySlug: product.categoryId })}
          className="hover:text-emerald-800"
        >
          {product.categoryName}
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-800 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-2xl border border-stone-200 p-4 sm:p-8 shadow-xs">
        {/* Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedImageIndex ? 'border-emerald-700' : 'border-stone-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="flex items-center gap-1 text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Dispatched from {product.locationCity}, {product.locationProvince}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif leading-snug">
              {product.title}
            </h1>

            {/* Ratings & reviews summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
                <span className="text-sm font-bold text-stone-900 ml-1.5">{product.rating}</span>
              </div>
              <span className="text-xs text-stone-400">|</span>
              <span className="text-xs text-stone-600 font-medium">
                {product.reviewCount} customer ratings
              </span>
              <span className="text-xs text-stone-400">|</span>
              <span className="text-xs text-emerald-800 font-semibold">
                {product.salesCount} sold across Nepal
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-baseline gap-3">
              <span className="text-3xl font-black text-stone-950 font-serif">
                Rs. {displayPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-stone-400 line-through">
                    Rs. {product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-rose-600">
                    Save Rs. {(product.price - product.discountPrice!).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-stone-100 font-bold px-3 py-2 text-stone-700">
                  Product Specifications
                </div>
                <div className="divide-y divide-stone-100">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="grid grid-cols-3 px-3 py-2">
                      <span className="font-semibold text-stone-500">{spec.key}</span>
                      <span className="col-span-2 text-stone-800 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-stone-700">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-stone-500">
                {product.stock > 0 ? `${product.stock} items available in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-md shadow-emerald-900/10 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  onNavigate('checkout');
                }}
                disabled={product.stock === 0}
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-amber-400/20 disabled:opacity-50"
              >
                Buy Now with 1-Click
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Seller info card */}
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    Sold by: {product.sellerStoreName}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold">
                    Verified Nepal Merchant &bull; 98% Positive Feedback
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('search', { query: product.sellerStoreName })}
                className="text-xs text-emerald-800 font-bold hover:underline"
              >
                Visit Store
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Verified Rating Section */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-xl font-black font-serif text-stone-900">
              Customer Reviews ({productReviews.length})
            </h3>
            <p className="text-xs text-stone-500">Authentic opinions from buyers across Nepal</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-stone-900 font-serif">{product.rating}</span>
            <div className="flex flex-col">
              <div className="flex text-amber-500">
                {'★★★★★'}
              </div>
              <span className="text-[10px] text-stone-400">Average of {product.reviewCount} reviews</span>
            </div>
          </div>
        </div>

        {/* Write a review (Verified purchase policy) */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Write a Product Review
            </h4>
            {hasPurchased ? (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Verified Purchaser
              </span>
            ) : (
              <span className="text-[10px] text-stone-500">
                (Reviews are labeled based on verified order status)
              </span>
            )}
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="How was the product quality, packaging, and delivery in your area? Share your honest experience..."
              className="w-full text-xs p-3 bg-white border border-stone-300 rounded-xl outline-hidden focus:border-emerald-700"
            />

            <button
              type="submit"
              disabled={isSubmittingReview || !newComment.trim()}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4 pt-2">
          {productReviews.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              No reviews written for this product yet. Be the first to share your thoughts!
            </div>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-stone-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rev.userAvatar ? (
                      <img
                        src={rev.userAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                        {rev.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-stone-900">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="ml-2 text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(5 - rev.rating)}
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>

                {rev.sellerReply && (
                  <div className="mt-2 p-2.5 bg-emerald-50/60 border-l-2 border-emerald-600 rounded-r-lg text-xs text-stone-700">
                    <span className="font-bold text-emerald-900 block text-[11px]">
                      Store Response:
                    </span>
                    {rev.sellerReply}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-black font-serif text-stone-900">
            Similar Products You Might Like
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
