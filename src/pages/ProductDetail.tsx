import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Search, 
  Share2, 
  Heart, 
  ShoppingCart, 
  Star, 
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Package,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find((p) => p.id === id);
  
  // Get similar products (same brand or similar price range)
  const similarProducts = products
    .filter((p) => p.id !== id && (p.brand === product?.brand || Math.abs(p.price - (product?.price || 0)) < 1000))
    .slice(0, 6);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">Product not found</h1>
          <Link to="/" className="mt-4 text-primary underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

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

  // Mock multiple images for carousel
  const images = [product.image, product.image, product.image];

  return (
    <>
      <Helmet>
        <title>{product.name} - Buy at Best Price | AudioMart</title>
        <meta
          name="description"
          content={`Buy ${product.name} at ${formatPrice(product.price)}. ${product.highlights.join(", ")}. Free delivery, warranty included.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-primary shadow-md">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 shrink-0 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products"
                  className="h-9 w-full rounded-sm bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-2xs font-bold text-accent-foreground">
                  2
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Image Carousel */}
        <div className="relative bg-card">
          <div className="aspect-square overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="h-full w-full object-contain p-8"
            />
          </div>
          
          {/* Discount Badge */}
          <Badge className="absolute left-3 top-3 bg-discount text-discount-foreground font-semibold">
            {product.discount}% OFF
          </Badge>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-card px-4 py-3">
          {/* Brand */}
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          
          {/* Name */}
          <h1 className="mt-1 text-base font-medium text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded-sm bg-rating-bg px-1.5 py-0.5 text-xs font-bold text-rating-text">
              {product.rating}
              <Star className="h-2.5 w-2.5 fill-current" />
            </span>
            <span className="text-xs text-muted-foreground">
              {formatReviews(product.reviews)} Ratings & Reviews
            </span>
          </div>

          {/* Price Block */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-price">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-price-original line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-sm font-medium text-discount">
              {product.discount}% off
            </span>
          </div>

          {/* Bank Offer */}
          <div className="mt-3 flex items-start gap-2 rounded-sm bg-success/5 p-2.5">
            <Zap className="h-4 w-4 shrink-0 text-bank-offer mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">Bank Offer</p>
              <p className="text-xs text-muted-foreground">
                10% instant discount on SBI Credit Card, up to ₹500
              </p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-2 bg-card px-4 py-3">
          <h2 className="text-sm font-medium text-foreground">Highlights</h2>
          <ul className="mt-2 space-y-1.5">
            {product.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
                {highlight}
              </li>
            ))}
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
              {product.batteryLife}H Total Battery Life
            </li>
            {product.hasANC && (
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
                Active Noise Cancellation
              </li>
            )}
            {product.hasWirelessCharging && (
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
                Wireless Charging Support
              </li>
            )}
          </ul>
        </div>

        {/* Delivery & Services */}
        <div className="mt-2 bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-foreground">Delivery by Tomorrow</p>
                <p className="text-xs text-muted-foreground">Free ₹40</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Seller & Warranty */}
        <div className="mt-2 bg-card px-4 py-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">7 Days Replacement</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mt-2 bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Seller</p>
              <p className="text-sm font-medium text-primary">AudioMart Official</p>
            </div>
            <div className="flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-0.5">
              <span className="text-xs font-bold text-primary">4.8</span>
              <Star className="h-2.5 w-2.5 fill-primary text-primary" />
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-2 bg-card py-3">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-sm font-medium text-foreground">Similar Products</h2>
              <Link to="/" className="text-xs font-medium text-primary">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 px-4">
                {similarProducts.map((p) => (
                  <div key={p.id} className="w-36 shrink-0">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card shadow-lg">
          <Button
            variant="ghost"
            className="flex-1 h-14 rounded-none border-r border-border text-foreground hover:bg-muted font-semibold"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            ADD TO CART
          </Button>
          <Button
            className="flex-1 h-14 rounded-none bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          >
            <Zap className="mr-2 h-5 w-5" />
            BUY NOW
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
