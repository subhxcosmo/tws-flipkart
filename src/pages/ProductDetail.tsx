import { useState, useRef, useEffect } from "react";
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
import MobileContainer from "@/components/MobileContainer";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Touch handling for swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const product = products.find((p) => p.id === id);
  
  // Get similar products (same brand or similar price range)
  const similarProducts = products
    .filter((p) => p.id !== id && (p.brand === product?.brand || Math.abs(p.price - (product?.price || 0)) < 1000))
    .slice(0, 6);

  // Mock multiple images for carousel
  const images = product ? [product.image, product.image, product.image, product.image] : [];

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!product) {
    return (
      <MobileContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Product not found</h1>
            <Link to="/" className="mt-4 text-primary underline">
              Back to home
            </Link>
          </div>
        </div>
      </MobileContainer>
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

  const handleBuyNow = () => {
    navigate(`/checkout/order/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart", {
      description: product.name,
    });
  };

  return (
    <MobileContainer>
      <Helmet>
        <title>{product.name} - Buy at Best Price | AudioMart</title>
        <meta
          name="description"
          content={`Buy ${product.name} at ${formatPrice(product.price)}. ${product.highlights.join(", ")}. Free delivery, warranty included.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background pb-16">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-primary">
          <div className="flex items-center gap-2 px-2 py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10 shrink-0 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            {/* Search Bar - Full width */}
            <div className="flex-1">
              <div className="relative h-10 w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for products"
                  className="h-full w-full rounded-lg bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Cart Icon Only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative h-10 w-10 shrink-0 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-2xs font-bold text-accent-foreground">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </header>

        {/* Image Carousel - 1080x1425 aspect ratio */}
        <div 
          ref={containerRef}
          className="relative bg-card overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Aspect ratio 1080:1425 = 0.757 */}
          <div className="relative w-full" style={{ aspectRatio: '1080/1425' }}>
            <div 
              className="absolute inset-0 flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="w-full shrink-0 flex items-center justify-center p-6 bg-card"
                  style={{ aspectRatio: '1080/1425' }}
                >
                  <img
                    src={img}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Discount Badge */}
          <Badge className="absolute left-3 top-3 bg-discount text-discount-foreground font-semibold text-xs px-2 py-1">
            {product.discount}% OFF
          </Badge>

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "w-5 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-card px-4 py-3">
          {/* Brand + Visit Store Row */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{product.brand}</span>
            <button className="text-xs text-primary font-medium">Visit store</button>
          </div>
          

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

          {/* Product Description - Collapsible */}
          <div className="mt-2.5">
            <p className={`text-xs text-muted-foreground leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
              Experience premium audio quality with the {product.name}. Featuring {product.batteryLife}H of battery life{product.hasANC ? ', Active Noise Cancellation,' : ''} and exceptional sound clarity. Perfect for music lovers and professionals alike. Designed with comfort in mind for extended listening sessions. Comes with {product.highlights.join(', ')}.
            </p>
            <button 
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-xs text-primary"
            >
              {isDescriptionExpanded ? 'less' : 'more'}
            </button>
          </div>

          {/* Hot Deal Badge */}
          <div className="mt-3">
            <span className="inline-block text-2xs font-medium text-white bg-success px-2 py-0.5 rounded">
              Hot Deal
            </span>
          </div>

          {/* Price Block */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-success flex items-center gap-0.5">
              <span>↓</span>{product.discount}%
            </span>
            <span className="text-lg text-muted-foreground/60 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-2xl font-extrabold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Protect Promise Fee */}
          <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span>+₹9 Protect Promise Fee</span>
            <ChevronRight className="h-3 w-3" />
          </button>

          {/* Bank Offer */}
          <div className="mt-3 flex items-start gap-2 rounded-sm bg-success/5 p-2.5 border border-success/20">
            <Zap className="h-4 w-4 shrink-0 text-bank-offer mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">Bank Offer</p>
              <p className="text-xs text-muted-foreground">
                10% instant discount on SBI Credit Card, up to ₹500
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Section */}
        <div className="mt-2 bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Delivery by Tomorrow</p>
              <p className="text-xs text-muted-foreground">
                <span className="line-through">₹40</span>
                <span className="ml-1 text-success font-medium">FREE</span>
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-2 bg-card px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Highlights</h2>
          <ul className="mt-2 space-y-2">
            {product.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                {highlight}
              </li>
            ))}
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
              {product.batteryLife}H Total Battery Life
            </li>
            {product.hasANC && (
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                Active Noise Cancellation
              </li>
            )}
            {product.hasWirelessCharging && (
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                Wireless Charging Support
              </li>
            )}
          </ul>
        </div>

        {/* Seller & Warranty Icons */}
        <div className="mt-2 bg-card px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-2xs text-muted-foreground leading-tight">7 Days<br/>Replacement</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-2xs text-muted-foreground leading-tight">1 Year<br/>Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-2xs text-muted-foreground leading-tight">Easy<br/>Returns</span>
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
            <div className="flex items-center gap-1 rounded-sm bg-rating-bg px-2 py-0.5">
              <span className="text-xs font-bold text-rating-text">4.8</span>
              <Star className="h-2.5 w-2.5 fill-current text-rating-text" />
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-2 bg-card py-3">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-sm font-semibold text-foreground">Similar Products</h2>
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

        {/* Ratings & Reviews Section */}
        <div className="mt-2 bg-card px-4 py-4">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Ratings & Reviews</h2>
            <span className="text-xs text-muted-foreground/50">Rate Product</span>
          </div>

          {/* Total Reviews Count */}
          <p className="mt-3 text-xs text-muted-foreground">350+ Reviews</p>

          {/* Star Distribution */}
          <div className="mt-3 space-y-2">
            {[
              { stars: 5, count: '1,43,027', percentage: 70 },
              { stars: 4, count: '39,003', percentage: 45 },
              { stars: 3, count: '10,411', percentage: 20 },
              { stars: 2, count: '4,844', percentage: 10 },
              { stars: 1, count: '10,847', percentage: 15 },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-5 flex items-center gap-0.5">
                  {item.stars}<Star className="h-2.5 w-2.5 fill-current text-muted-foreground" />
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-14 text-right">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Circular Rating Rings */}
          <div className="mt-5 flex justify-around">
            {[
              { rating: 4.7, label: 'Product Quality' },
              { rating: 4.8, label: 'Packaging Quality' },
              { rating: 4.5, label: 'Delivery Time' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <div className="relative w-14 h-14">
                  {/* Background circle */}
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-muted"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(item.rating / 5) * 150.8} 150.8`}
                      className="text-success"
                    />
                  </svg>
                  {/* Rating number in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">{item.rating}</span>
                  </div>
                </div>
                <span className="text-2xs text-muted-foreground text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Review Cards */}
          <div className="mt-5 space-y-4">
            {/* Review 1 */}
            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center gap-0.5 rounded-sm bg-success px-1.5 py-0.5 text-xs font-bold text-white">
                  5.0
                  <Star className="h-2.5 w-2.5 fill-current" />
                </span>
                <p className="text-xs font-semibold text-foreground">Excellent Sound & Battery Life</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                I bought this during an offer and I'm very satisfied. Sound quality is clear, bass is balanced, and battery backup easily lasts a full day. Works smoothly for calls and music. Totally worth the price.
              </p>
              <div className="mt-2 flex items-center gap-2 text-2xs text-muted-foreground">
                <span className="font-medium text-foreground">Rahul Sharma</span>
                <span>·</span>
                <span>Delhi</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-2xs">
                <span className="text-success flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Purchase
                </span>
                <span className="text-muted-foreground">· 2 hours ago</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center gap-0.5 rounded-sm bg-success px-1.5 py-0.5 text-xs font-bold text-white">
                  4.0
                  <Star className="h-2.5 w-2.5 fill-current" />
                </span>
                <p className="text-xs font-semibold text-foreground">Very Good Product</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                The product quality is solid and feels premium. Connectivity is fast and stable. Charging case is compact and easy to carry. Overall, a very good experience.
              </p>
              <div className="mt-2 flex items-center gap-2 text-2xs text-muted-foreground">
                <span className="font-medium text-foreground">Priya Mehta</span>
                <span>·</span>
                <span>Mumbai</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-2xs">
                <span className="text-success flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Purchase
                </span>
                <span className="text-muted-foreground">· 10 hours ago</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center gap-0.5 rounded-sm bg-success px-1.5 py-0.5 text-xs font-bold text-white">
                  5.0
                  <Star className="h-2.5 w-2.5 fill-current" />
                </span>
                <p className="text-xs font-semibold text-foreground">Must Buy</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Amazing earbuds for daily use. Sound clarity is impressive and mic quality is better than expected. Delivery was quick and packaging was neat. Highly recommended.
              </p>
              <div className="mt-2 flex items-center gap-2 text-2xs text-muted-foreground">
                <span className="font-medium text-foreground">Anjali Verma</span>
                <span>·</span>
                <span>Bengaluru</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-2xs">
                <span className="text-success flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Purchase
                </span>
                <span className="text-muted-foreground">· 1 day ago</span>
              </div>
            </div>

            {/* Review 4 */}
            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center gap-0.5 rounded-sm bg-success px-1.5 py-0.5 text-xs font-bold text-white">
                  4.0
                  <Star className="h-2.5 w-2.5 fill-current" />
                </span>
                <p className="text-xs font-semibold text-foreground">Value for Money</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Comfortable fit and good noise isolation. Battery performance is reliable and pairs instantly. For this price range, it's a great deal.
              </p>
              <div className="mt-2 flex items-center gap-2 text-2xs text-muted-foreground">
                <span className="font-medium text-foreground">Amit Singh</span>
                <span>·</span>
                <span>Noida</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-2xs">
                <span className="text-success flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Purchase
                </span>
                <span className="text-muted-foreground">· 1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar - Fixed positioning, consistent sizing */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-md flex bg-card border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <Button
              variant="ghost"
              onClick={handleAddToCart}
              className="flex-1 h-14 rounded-none border-r border-border text-foreground hover:bg-muted font-semibold text-sm gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              ADD TO CART
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 h-14 rounded-none bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm gap-2"
            >
              <Zap className="h-5 w-5" />
              BUY NOW
            </Button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default ProductDetail;
