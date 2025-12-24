import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Star,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Trash2,
  Zap,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileContainer from "@/components/MobileContainer";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalOriginalPrice,
    getTotalDiscount,
    getTotalItems,
  } = useCart();

  const [isPriceDetailsOpen, setIsPriceDetailsOpen] = useState(true);
  const [openQuantityDropdown, setOpenQuantityDropdown] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const totalAmount = getTotalPrice();
  const totalSavings = getTotalDiscount();

  if (items.length === 0) {
    return (
      <MobileContainer>
        <Helmet>
          <title>My Cart - AudioMart</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-card border-b border-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-9 w-9 shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-base font-semibold text-foreground">My Cart</h1>
            </div>
          </header>

          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Add items to your cart to see them here
            </p>
            <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground">
              Continue Shopping
            </Button>
          </div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <Helmet>
        <title>{`My Cart (${getTotalItems()}) - AudioMart`}</title>
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-semibold text-foreground">My Cart</h1>
          </div>
        </header>

        {/* Address Section */}
        <div className="bg-card px-4 py-3 flex items-center justify-between border-b border-border">
          <span className="text-sm text-foreground">From Saved Addresses</span>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary text-xs h-8 px-3"
          >
            Enter Delivery Pincode
          </Button>
        </div>

        {/* Cart Items */}
        <div className="mt-2">
          {items.map((item) => (
            <div key={item.product.id} className="bg-card mb-2">
              {/* Product Info Row */}
              <div className="p-4 flex gap-3">
                {/* Product Image - Fixed container with edge-to-edge image */}
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.product.brand}, True Wireless
                  </p>

                  {/* Rating Row */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(item.product.rating)
                              ? "fill-success text-success"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-success font-medium">
                      {item.product.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · ({formatNumber(item.product.reviews)})
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="relative mt-2">
                    <button
                      onClick={() =>
                        setOpenQuantityDropdown(
                          openQuantityDropdown === item.product.id
                            ? null
                            : item.product.id
                        )
                      }
                      className="flex items-center gap-1 border border-border rounded px-2.5 py-1.5 text-sm"
                    >
                      Qty: {item.quantity}
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    {openQuantityDropdown === item.product.id && (
                      <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10 min-w-[80px]">
                        {[1, 2, 3, 4, 5].map((qty) => (
                          <button
                            key={qty}
                            onClick={() => {
                              updateQuantity(item.product.id, qty);
                              setOpenQuantityDropdown(null);
                            }}
                            className={`w-full px-3 py-2 text-sm text-left hover:bg-muted ${
                              item.quantity === qty ? "bg-muted font-medium" : ""
                            }`}
                          >
                            {qty}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm font-bold text-success flex items-center gap-0.5">
                      <span>↓</span>{item.product.discount}%
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.product.originalPrice)}
                    </span>
                    <span className="text-base font-bold text-foreground">
                      {formatPrice(item.product.price)}
                    </span>
                  </div>

                  {/* WOW Offer */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="bg-yellow-400 text-black text-2xs font-bold px-1.5 py-0.5 rounded">
                      WOW!
                    </span>
                    <span className="text-xs text-primary font-medium">
                      Buy at {formatPrice(item.product.price - 70)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="px-4 py-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Delivery by <span className="font-medium text-foreground">Fri Dec 26</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-border">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs text-muted-foreground hover:bg-muted transition-colors">
                  <Bookmark className="h-4 w-4" />
                  Save for later
                </button>
                <div className="w-px bg-border" />
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
                <div className="w-px bg-border" />
                <button
                  onClick={() => navigate(`/checkout/order/${item.product.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Buy this now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Price Details Card */}
        <div className="mt-2 mx-3 bg-card rounded-lg border border-border overflow-hidden">
          {/* Header */}
          <button
            onClick={() => setIsPriceDetailsOpen(!isPriceDetailsOpen)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm font-semibold text-foreground">Price Details</span>
            {isPriceDetailsOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {isPriceDetailsOpen && (
            <div className="px-4 pb-4">
              {/* Dashed line */}
              <div className="border-t border-dashed border-border mb-3" />

              {/* Price breakdown */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>Price ({getTotalItems()} item{getTotalItems() > 1 ? 's' : ''})</span>
                    <Info className="h-3 w-3" />
                  </div>
                  <span className="text-sm text-foreground">
                    {formatPrice(getTotalOriginalPrice())}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Discount</span>
                  <span className="text-sm text-success font-medium">
                    - {formatPrice(getTotalDiscount())}
                  </span>
                </div>
              </div>

              {/* Dashed line */}
              <div className="border-t border-dashed border-border my-3" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total Amount</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {/* Savings banner */}
              <div className="mt-3 bg-success/10 rounded-md py-2.5 px-3 flex items-center justify-center gap-1.5">
                <span className="text-success text-lg">💰</span>
                <span className="text-sm text-success font-medium">
                  You'll save {formatPrice(totalSavings)} on this order!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Trust Banner */}
        <div className="mt-4 px-4 py-4 flex items-center gap-3 bg-card">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Safe and secure payments. Easy returns. 100% Authentic products.
          </p>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-md flex items-center bg-card border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-4 py-3">
            {/* Price Info */}
            <div className="flex-1">
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(getTotalOriginalPrice())}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(totalAmount)}
                </span>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              onClick={() => navigate(`/checkout/order/${items[0]?.product.id}`)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm h-12 px-8 rounded-lg"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Cart;
