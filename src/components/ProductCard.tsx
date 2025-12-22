import { Star, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";
import wowBadge from "@/assets/wow-badge.png";
import assuredBadge from "@/assets/assured-badge.png";

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

  // Calculate bank offer price (approximately 5% extra off)
  const bankOfferPrice = Math.round(product.price * 0.95);

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="group relative flex flex-col bg-card border border-border rounded-sm overflow-hidden">
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

        {/* Image Container - Fixed aspect ratio */}
        <div className="relative aspect-square overflow-hidden p-3 bg-card">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-2.5 pt-0">
          {/* Row 1: Discount percentage with arrow + Original price struck */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center text-xs font-semibold text-success">
              {product.discount}% ↓
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>

          {/* Row 2: Bold selling price */}
          <div className="mt-0.5">
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Row 3: WOW badge with bank offer price */}
          <div className="mt-1 flex items-center gap-1">
            <img 
              src={wowBadge} 
              alt="WOW" 
              className="h-3.5 w-auto"
            />
            <span className="text-xs text-muted-foreground">
              {formatPrice(bankOfferPrice)} with Bank offer
            </span>
          </div>

          {/* Row 4: Star rating - individual stars */}
          <div className="mt-1.5 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.floor(product.rating)
                    ? "fill-[#388e3c] text-[#388e3c]"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>

          {/* Row 5: Assured badge */}
          <div className="mt-1.5">
            <img 
              src={assuredBadge} 
              alt="Assured" 
              className="h-4 w-auto"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
