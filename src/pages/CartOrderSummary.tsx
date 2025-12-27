import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck,
  Tag,
  ChevronRight,
  MapPin,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import StepIndicator from "@/components/checkout/StepIndicator";
import MobileContainer from "@/components/MobileContainer";

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: { name: string; images?: string[] };
  selectedImage?: string;
}

const CartOrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems: CartItem[] = location.state?.cartItems || [];
  
  // Mock saved address
  const [savedAddress, setSavedAddress] = useState<{
    name: string;
    phone: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
  } | null>(null);

  useEffect(() => {
    // Check for saved address in localStorage
    const addr = localStorage.getItem('savedAddress');
    if (addr) {
      setSavedAddress(JSON.parse(addr));
    }
  }, []);

  if (cartItems.length === 0) {
    return (
      <MobileContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">No items in cart</h1>
            <Link to="/cart" className="mt-4 text-primary underline">
              Back to cart
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

  const totalOriginalPrice = cartItems.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalDiscount = totalOriginalPrice - totalPrice;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryCharge = 0;

  const steps = ["Address", "Order Summary", "Payment"];

  return (
    <MobileContainer>
      <Helmet>
        <title>Order Summary | AudioMart</title>
        <meta name="description" content="Review your order before checkout" />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center gap-3 px-3 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="h-9 w-9 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-semibold text-foreground">Order Summary</h1>
          </div>
        </header>

        {/* Step Indicator */}
        <StepIndicator currentStep={1} steps={steps} />

        {/* Delivery Address Section */}
        <section className="mt-2 bg-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Deliver to</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/checkout/address/cart', { state: { cartItems } })}
              className="h-8 text-primary text-xs font-medium"
            >
              {savedAddress ? "Change" : "Add"}
            </Button>
          </div>
          
          {savedAddress ? (
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-foreground">{savedAddress.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {savedAddress.address}, {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Phone: {savedAddress.phone}</p>
            </div>
          ) : (
            <button
              onClick={() => navigate('/checkout/address/cart', { state: { cartItems } })}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 text-primary"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Add Delivery Address</span>
            </button>
          )}
        </section>

        {/* Product Cards */}
        <section className="mt-2 bg-card px-4 py-3">
          <p className="text-sm font-semibold text-foreground mb-3">{totalItems} Item{totalItems > 1 ? 's' : ''}</p>
          
          <div className="space-y-4">
            {cartItems.map((item) => {
              const discountPercentage = item.product.originalPrice > item.product.price 
                ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100) 
                : 0;
              
              return (
                <div key={`${item.product.id}-${item.selectedColor?.name || 'default'}`} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  {/* Image */}
                  <div className="w-20 h-20 shrink-0 rounded-sm overflow-hidden bg-muted">
                    <img
                      src={item.selectedImage || item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-medium text-foreground line-clamp-2">
                      {item.product.name}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.product.brand}{item.selectedColor ? `, ${item.selectedColor.name}` : ''}
                    </p>
                    
                    {/* Price */}
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="text-base font-bold text-price">
                        {formatPrice(item.product.price)}
                      </span>
                      <span className="text-xs text-price-original line-through">
                        {formatPrice(item.product.originalPrice)}
                      </span>
                      <span className="text-xs font-medium text-discount">
                        {discountPercentage}% off
                      </span>
                    </div>
                    
                    {/* Quantity */}
                    <p className="mt-1 text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Assurance Badge */}
          <div className="mt-3 flex items-center gap-2 rounded-sm bg-success/5 p-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="text-xs text-success font-medium">AudioMart Assured</span>
          </div>
          
          {/* Delivery Info */}
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span>Delivery by Tomorrow</span>
            <span className="text-success font-medium">FREE</span>
          </div>
        </section>

        {/* Apply Coupon */}
        <section className="mt-2 bg-card">
          <button className="w-full flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Apply Coupon</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </section>

        {/* Price Details */}
        <section className="mt-2 bg-card px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 mb-3">
            PRICE DETAILS
          </h3>
          
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">Price ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
              <span className="text-foreground">{formatPrice(totalOriginalPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">Discount</span>
              <span className="text-discount">− {formatPrice(totalDiscount)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">Delivery Charges</span>
              <span className="text-success">FREE</span>
            </div>
            
            <div className="border-t border-dashed border-border pt-2.5 mt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Total Amount</span>
                <span className="text-base font-bold text-foreground">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            
            <p className="text-xs text-success font-medium pt-1">
              You will save {formatPrice(totalDiscount)} on this order
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-md bg-card border-t border-border px-4 py-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-price">{formatPrice(totalPrice)}</span>
              <button className="text-xs text-primary font-medium">View Details</button>
            </div>
            <Button
              onClick={() => {
                if (!savedAddress) {
                  navigate('/checkout/address/cart', { state: { cartItems } });
                } else {
                  navigate('/checkout/cart-payment', { state: { cartItems } });
                }
              }}
              className="w-full h-12 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold text-sm rounded-full"
            >
              {savedAddress ? "CONTINUE TO PAYMENT" : "ADD ADDRESS TO CONTINUE"}
            </Button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default CartOrderSummary;
