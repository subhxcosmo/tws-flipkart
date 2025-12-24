import { Star, Heart } from "lucide-react";
import { Product, getDisplayRating } from "@/data/products";
import { Link } from "react-router-dom";
import wowBadge from "@/assets/wow-badge.png";
import assuredBadge from "@/assets/assured-badge.png";

interface ProductCardProps {
  product: Product;
  isSponsored?: boolean;
  index?: number; // For controlling lazy loading
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

  // Calculate bank offer price (approximately 5% extra off)
  const bankOfferPrice = Math.round(product.price * 0.95);

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

        {/* Image Container - Fixed height with edge-to-edge image */}
        <div className="relative h-[180px] w-full overflow-hidden bg-muted flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Content - All left-aligned, tight spacing */}
        <div className="flex flex-col px-2 py-2">
          
          {/* Row 1: Sponsored tag (if applicable) */}
          {isSponsored && (
            <span className="text-[11px] text-[#878787] mb-0.5">
              Sponsored
            </span>
          )}

          {/* Row 2: Brand Name */}
          <p className="text-[13px] font-medium text-[#212121] leading-tight">
            {product.brand}
          </p>

          {/* Row 3: Product Title - truncated */}
          <p className="text-[12px] text-[#878787] leading-tight mt-0.5 truncate">
            {product.name}
          </p>

          {/* Row 4: Discount + Original Price + Final Price */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-[13px] font-medium text-[#388e3c]">
              ↓{product.discount}%
            </span>
            <span className="text-[13px] text-[#878787] line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-[16px] font-bold text-[#212121]">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Row 5: WOW badge + Bank offer */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <img 
              src={wowBadge} 
              alt="WOW" 
              className="h-[14px] w-auto"
            />
            <span className="text-[12px] text-[#212121]">
              {formatPrice(bankOfferPrice)} with Bank offer
            </span>
          </div>

          {/* Row 6: Stars + Assured badge */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = getDisplayRating(product);
                const isFull = star <= Math.floor(rating);
                const isPartial = star === Math.ceil(rating) && rating % 1 !== 0;
                
                return (
                  <div key={star} className="relative h-[14px] w-[14px]">
                    {/* Empty star background */}
                    <Star className="absolute h-[14px] w-[14px] fill-[#c2c2c2] text-[#c2c2c2]" />
                    {/* Filled star with clip for partial */}
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
            <img 
              src={assuredBadge} 
              alt="Assured" 
              className="h-[16px] w-auto"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
