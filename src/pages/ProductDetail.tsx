import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Search, 
  Share2, 
  Heart, 
  Star, 
  ChevronRight,
  ChevronUp,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Package,
  CheckCircle2,
  BatteryCharging,
  AudioLines,
  SlidersHorizontal,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products, Product, getProductColorVariants, ColorVariant } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import MobileContainer from "@/components/MobileContainer";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import cartIcon from "@/assets/shopping-cart.png";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(true);
  const [isLongDescExpanded, setIsLongDescExpanded] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  
  // Touch handling for swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = products.find((p) => p.id === id);
  
  // Get color variants for this product
  const colorVariants = product ? getProductColorVariants(product) : [];
  const selectedColor = colorVariants[selectedColorIndex] || colorVariants[0];
  
  // Get similar products (same brand or similar price range)
  const similarProducts = products
    .filter((p) => p.id !== id && (p.brand === product?.brand || Math.abs(p.price - (product?.price || 0)) < 1000))
    .slice(0, 6);

  // Get images: use product's custom images, or color variant images, or fallback to product image
  const images = product?.images && product.images.length > 0
    ? product.images
    : selectedColor?.images || (product ? [product.image, product.image, product.image] : []);

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
      return `${(reviews / 1000).toFixed(1)}K+`;
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
        {/* Sticky Header - Compact single row */}
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="flex items-center gap-2 px-2 py-2">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 shrink-0 text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Search Bar - Inline */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for Products"
                className="h-9 w-full rounded-lg bg-[#F0F0F0] pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => navigate("/cart")}
              className="relative shrink-0"
            >
              <img 
                src={cartIcon} 
                alt="Cart" 
                className="h-6 w-6 object-contain"
              />
              {getTotalItems() > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-2xs font-bold text-primary-foreground">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Image Carousel - 65% screen height */}
        <div 
          ref={containerRef}
          className="relative bg-[#f5f5f5] overflow-hidden h-[65vh]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full">
            <div 
              className="absolute inset-0 flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="w-full h-full shrink-0 flex items-center justify-center bg-[#f5f5f5]"
                >
                  <img
                    src={img}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="max-h-[90%] max-w-[90%] object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Floating Rating Badge - stays fixed while swiping */}
          <div className="absolute left-3 top-3 bg-white/95 rounded-md px-2 py-1 shadow-sm">
            <span className="text-sm font-medium text-[#212121] flex items-center gap-1">
              {product.rating}
              <Star className="h-3.5 w-3.5 fill-[#388e3c] text-[#388e3c]" />
              <span className="text-[#878787] mx-0.5">|</span>
              <span className="text-[#878787]">{formatReviews(product.reviews)}</span>
            </span>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-primary"
                    : "bg-[#c2c2c2]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Color Options Section - Only show if color variants exist */}
        {colorVariants.length > 0 && (
          <div className="bg-white px-4 py-3 border-b border-[#f0f0f0]">
            <p className="text-sm text-[#212121]">
              <span className="font-medium">Selected Color:</span> {selectedColor?.name}
            </p>
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {colorVariants.map((colorOption, index) => (
                <button
                  key={colorOption.name}
                  onClick={() => {
                    setSelectedColorIndex(index);
                    setCurrentImageIndex(0); // Reset image carousel when color changes
                  }}
                  className={`shrink-0 w-20 h-24 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedColorIndex === index 
                      ? "border-[#212121]" 
                      : "border-[#e0e0e0]"
                  }`}
                >
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: '#f5f5f5' }}
                  >
                    <img
                      src={colorOption.images[0]}
                      alt={colorOption.name}
                      className="max-h-[80%] max-w-[80%] object-contain"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="bg-white px-4 py-3">
          {/* Brand Name */}
          <h2 className="text-base font-semibold text-[#212121]">{product.brand}</h2>
          
          {/* Product Description - Collapsible with "more" */}
          <div className="mt-1">
            <p className="text-sm text-[#878787] leading-snug">
              {isDescriptionExpanded 
                ? (product.description || `${product.name} with Dual Pairing, ENC, Fast Charge, ${product.batteryLife}H Battery, ${product.highlights.join(', ')}. Premium audio quality with crystal clear sound and deep bass.`)
                : (product.description 
                    ? (product.description.length > 90 ? product.description.substring(0, 90) + '...' : product.description)
                    : `${product.name} with Dual Pairing, ENC, Fast Charge, ${product.batteryLife}H Battery, Rubbe...`
                  )
              }
              <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-primary font-medium"
              >
                {isDescriptionExpanded ? 'less' : 'more'}
              </button>
            </p>
          </div>

          {/* SUPER DEALS Label */}
          <div className="mt-3">
            <span className="text-xs font-bold text-[#388e3c] tracking-wide">
              SUPER DEALS
            </span>
          </div>

          {/* Price Block - Matching reference exactly */}
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#388e3c] flex items-center">
              ↓{product.discount}%
            </span>
            <span className="text-xl text-[#878787] line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-3xl font-bold text-[#212121]">
              {formatPrice(product.price)}
            </span>
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

        {/* Product Highlights - Matching reference image style */}
        <div className="mt-2 bg-card px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#212121]">Product highlights</h2>
            <button 
              onClick={() => setIsHighlightsExpanded(!isHighlightsExpanded)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f5f5f5]"
            >
              <ChevronUp className={`h-5 w-5 text-[#212121] transition-transform ${isHighlightsExpanded ? '' : 'rotate-180'}`} />
            </button>
          </div>
          
          {isHighlightsExpanded && (
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e8f4fd] flex items-center justify-center shrink-0">
                  <BatteryCharging className="h-6 w-6 text-[#212121]" />
                </div>
                <span className="text-sm font-medium text-[#212121]">Fast Charging Support</span>
              </div>
              
              {product.hasANC && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f4fd] flex items-center justify-center shrink-0">
                    <AudioLines className="h-6 w-6 text-[#212121]" />
                  </div>
                  <span className="text-sm font-medium text-[#212121]">With Noise Cancellation</span>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e8f4fd] flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="h-6 w-6 text-[#212121]" />
                </div>
                <span className="text-sm font-medium text-[#212121]">With Deep Bass</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e8f4fd] flex items-center justify-center shrink-0">
                  <Radio className="h-6 w-6 text-[#212121]" />
                </div>
                <span className="text-sm font-medium text-[#212121]">Bluetooth Connectivity</span>
              </div>
            </div>
          )}
        </div>

        {/* Long Product Description - Expandable */}
        <div className="mt-2 bg-card px-4 py-4">
          <h2 className="text-base font-bold text-[#212121]">Product Description</h2>
          <div className="mt-3">
            <p className="text-sm text-[#666] leading-relaxed">
              {isLongDescExpanded ? (
                <>
                  Experience premium audio quality with the {product.name} from {product.brand}. These wireless earbuds are engineered to deliver exceptional sound performance with rich bass, crystal-clear mids, and crisp highs.

                  <span className="block mt-3 font-semibold text-[#212121]">Sound Quality:</span>
                  Featuring advanced audio drivers, these earbuds produce immersive sound with deep bass response and balanced audio profiles. Perfect for music lovers, gamers, and professionals alike.

                  <span className="block mt-3 font-semibold text-[#212121]">Battery Life:</span>
                  With up to {product.batteryLife} hours of total playback time, you can enjoy uninterrupted listening throughout your day. The charging case provides multiple recharges on the go, and fast charging gives you hours of playback in just minutes.

                  <span className="block mt-3 font-semibold text-[#212121]">Comfort & Fit:</span>
                  Ergonomically designed with multiple ear tip sizes included for a secure and comfortable fit. Lightweight construction ensures all-day comfort without ear fatigue.

                  <span className="block mt-3 font-semibold text-[#212121]">Connectivity:</span>
                  Bluetooth 5.0 technology ensures stable connection up to 10 meters with minimal latency. Seamless pairing with smartphones, tablets, laptops, and other Bluetooth-enabled devices.

                  {product.hasANC && (
                    <>
                      <span className="block mt-3 font-semibold text-[#212121]">Active Noise Cancellation:</span>
                      Advanced ANC technology blocks out ambient noise, allowing you to focus on your music, calls, or podcasts without distractions.
                    </>
                  )}

                  <span className="block mt-3 font-semibold text-[#212121]">Additional Features:</span>
                  {product.highlights.join(', ')}. Touch controls for easy operation, voice assistant support, and IPX water resistance for workout sessions.
                </>
              ) : (
                <>
                  Experience premium audio quality with the {product.name} from {product.brand}. These wireless earbuds are engineered to deliver exceptional sound performance with rich bass, crystal-clear mids, and crisp highs...
                </>
              )}
              <button 
                onClick={() => setIsLongDescExpanded(!isLongDescExpanded)}
                className="text-primary font-medium ml-1"
              >
                {isLongDescExpanded ? 'less' : 'more'}
              </button>
            </p>
          </div>
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
          <div className="mx-auto max-w-md flex gap-3 bg-card border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-4 py-3">
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-full border-muted-foreground/30 bg-card text-foreground hover:bg-muted font-bold text-sm"
            >
              Add to cart
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 h-12 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold text-sm"
            >
              Buy at ₹{product.price.toLocaleString()}
            </Button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default ProductDetail;
