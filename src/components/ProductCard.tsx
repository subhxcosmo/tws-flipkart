import { Star } from "lucide-react";
import { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatReviews = (reviews: number) => {
    if (reviews >= 1000) {
      return `${(reviews / 1000).toFixed(1)}k`;
    }
    return reviews.toString();
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.discount > 0 && (
            <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground font-semibold">
              {product.discount}% OFF
            </Badge>
          )}
          {product.hasANC && (
            <Badge variant="secondary" className="absolute right-2 top-2">
              ANC
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Brand */}
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5">
              <span className="text-sm font-bold text-primary">{product.rating}</span>
              <Star className="h-3 w-3 fill-primary text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">
              ({formatReviews(product.reviews)} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5">
            {product.highlights.map((highlight, index) => (
              <span
                key={index}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
