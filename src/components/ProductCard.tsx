import { Star, Heart, Zap, ShieldCheck, Truck } from "lucide-react";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  isSponsored?: boolean;
}

const ProductCard = ({ product, isSponsored = false }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatReviews = (reviews: number) => {
    if (reviews >= 1000) {
      return `${(reviews / 1000).toFixed(0)}k`;
    }
    return reviews.toString();
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="group relative flex flex-col bg-card border-r border-b border-border transition-shadow hover:shadow-lg">
        {/* Wishlist Button */}
        <button 
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Sponsored Tag */}
        {isSponsored && (
          <span className="absolute left-2 top-2 z-10 rounded-sm bg-muted px-1.5 py-0.5 text-2xs text-sponsored">
            Ad
          </span>
        )}

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden p-4">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3 pt-0">
          {/* Brand */}
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="mt-0.5 text-sm font-medium text-foreground line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Rating Badge */}
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded-sm bg-rating-bg px-1.5 py-0.5 text-xs font-bold text-rating-text">
              {product.rating}
              <Star className="h-2.5 w-2.5 fill-current" />
            </span>
            <span className="text-xs text-muted-foreground">
              ({formatReviews(product.reviews)})
            </span>
          </div>

          {/* Price Section */}
          <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
            <span className="text-base font-bold text-price">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-price-original line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-xs font-medium text-discount">
              {product.discount}% off
            </span>
          </div>

          {/* Bank Offer */}
          <div className="mt-2 flex items-center gap-1">
            <Zap className="h-3 w-3 text-bank-offer" />
            <span className="text-2xs text-bank-offer font-medium">
              Bank Offer
            </span>
          </div>

          {/* Trust Badges */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.hasANC && (
              <span className="inline-flex items-center gap-0.5 rounded-sm border border-border px-1.5 py-0.5 text-2xs text-muted-foreground">
                <ShieldCheck className="h-2.5 w-2.5" />
                ANC
              </span>
            )}
            <span className="inline-flex items-center gap-0.5 text-2xs text-express">
              <Truck className="h-2.5 w-2.5" />
              Express
            </span>
          </div>

          {/* Highlights - Hidden on mobile, shown on larger screens */}
          <div className="mt-2 hidden gap-1 sm:flex sm:flex-wrap">
            {product.highlights.slice(0, 2).map((highlight, index) => (
              <span
                key={index}
                className="rounded-sm bg-muted px-1.5 py-0.5 text-2xs text-muted-foreground"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
