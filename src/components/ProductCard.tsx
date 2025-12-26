import { Star, Heart } from "lucide-react";
import { Product, getDisplayRating, getDiscountPercentage } from "@/data/products";
import { Link } from "react-router-dom";
import wowBadge from "@/assets/wow-badge.png";
import assuredBadge from "@/assets/assured-badge.png";

interface ProductCardProps {
  product: Product;
  isSponsored?: boolean;
  index?: number;
}

const ProductCard = ({ product, isSponsored = false, index = 0 }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatReviewCount = (reviews: number) => {
    if (reviews >= 100000) {
      return `${(reviews / 100000).toFixed(1)}L+`;
    } else if (reviews >= 1000) {
      return `${(reviews / 1000).toFixed(1)}K+`;
    }
    return `${reviews}+`;
  };

  const displayRating = getDisplayRating(product);
  const bankOfferPrice = Math.round(product.price * 0.95);

  // Ensure we have a valid image source
  const imageSrc = product.image || "";

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="group relative flex flex-col bg-card overflow-hidden">
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

        {/* Image Container - Simple reliable structure */}
        <div className="relative w-full bg-[#f5f5f5]">
          <div style={{ paddingBottom: '100%', position: 'relative' }}>
            <img
              src={imageSrc}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          {/* Review Bar */}
          <div className="absolute bottom-2 left-2 bg-white/95 rounded px-1.5 py-0.5 shadow-sm flex items-center gap-1 z-10">
            <span className="text-[11px] font-medium text-[#212121]">{displayRating.toFixed(1)}</span>
            <Star className="h-2.5 w-2.5 fill-[#388e3c] text-[#388e3c]" />
            <span className="text-[10px] text-[#878787]">|</span>
            <span className="text-[10px] text-[#878787]">{formatReviewCount(product.reviews)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col px-2 py-2">
          {isSponsored && (
            <span className="text-[11px] text-[#878787] mb-0.5">Sponsored</span>
          )}

          <p className="text-[13px] font-medium text-[#212121] leading-tight">
            {product.brand}
          </p>

          <p className="text-[12px] text-[#878787] leading-tight mt-0.5 truncate">
            {product.name}
          </p>

          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-[13px] font-medium text-[#388e3c]">
              ↓{getDiscountPercentage(product)}%
            </span>
            <span className="text-[13px] text-[#878787] line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-[16px] font-bold text-[#212121]">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* WOW badge + Bank offer */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <img src={wowBadge} alt="WOW" style={{ height: '14px', width: 'auto' }} />
            <span className="text-[12px] text-[#212121]">
              {formatPrice(bankOfferPrice)} with Bank offer
            </span>
          </div>

          {/* Stars + Assured badge */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = getDisplayRating(product);
                const isFull = star <= Math.floor(rating);
                const isPartial = star === Math.ceil(rating) && rating % 1 !== 0;
                
                return (
                  <div key={star} className="relative h-[14px] w-[14px]">
                    <Star className="absolute h-[14px] w-[14px] fill-[#c2c2c2] text-[#c2c2c2]" />
                    {(isFull || isPartial) && (
                      <div 
                        className="absolute overflow-hidden" 
                        style={{ width: isPartial ? `${(rating % 1) * 100}%` : '100%' }}
                      >
                        <Star className="h-[14px] w-[14px] fill-[#388e3c] text-[#388e3c]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <img src={assuredBadge} alt="Assured" style={{ height: '16px', width: 'auto' }} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
