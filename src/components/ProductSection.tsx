import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  bgColor?: string;
}

const ProductSection = ({ title, products, viewAllLink = "/", bgColor }: ProductSectionProps) => {
  return (
    <section className={`py-3 ${bgColor || 'bg-card'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <Link 
          to={viewAllLink}
          className="flex items-center gap-0.5 text-xs font-medium text-primary"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-3">
          {products.map((product) => (
            <div key={product.id} className="w-36 shrink-0">
              <CompactProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Compact version of ProductCard for horizontal sections
const CompactProductCard = ({ product }: { product: Product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="flex flex-col bg-card border border-border rounded-sm overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-card p-2">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
          {/* Discount Badge */}
          <span className="absolute left-1 top-1 bg-discount text-discount-foreground text-2xs font-bold px-1 py-0.5 rounded-sm">
            {product.discount}% OFF
          </span>
        </div>
        
        {/* Content */}
        <div className="p-2 border-t border-border">
          {/* Name */}
          <p className="text-xs font-medium text-foreground line-clamp-1">
            {product.name}
          </p>
          
          {/* Price */}
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm font-bold text-price">
              {formatPrice(product.price)}
            </span>
          </div>
          
          {/* Original Price & Discount */}
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-2xs text-price-original line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-2xs font-medium text-discount">
              {product.discount}% off
            </span>
          </div>
          
          {/* Rating */}
          <div className="mt-1 flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 bg-rating-bg text-rating-text text-2xs font-bold px-1 py-0.5 rounded-sm">
              {product.rating}★
            </span>
            <span className="text-2xs text-muted-foreground">
              ({product.reviews > 1000 ? `${Math.floor(product.reviews / 1000)}k` : product.reviews})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductSection;
