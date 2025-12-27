import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Check,
  ChevronRight,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import StepIndicator from "@/components/checkout/StepIndicator";
import MobileContainer from "@/components/MobileContainer";
import { useCart } from "@/contexts/CartContext";

// UPI logos from public folder for reliable loading
const phonepeLogo = "/images/phonepe-logo.png";
const paytmLogo = "/images/paytm-logo.png";
const gpayLogo = "/images/gpay-logo.png";
const upiLogo = "/images/upi-logo.png";
const bhimLogo = "/images/bhim-logo.png";

// UPI ID for receiving payments
const UPI_ID = "trendaura432220.rzp@icici";
const MERCHANT_NAME = "TrendAura";

interface CartItem {
  product: Product;
  quantity: number;
}

const paymentMethods = [
  {
    id: "phonepe",
    name: "PhonePe",
    icon: phonepeLogo,
    isImage: true,
    description: "Pay using PhonePe UPI",
    deepLinkPrefix: "phonepe://pay"
  },
  {
    id: "paytm",
    name: "Paytm",
    icon: paytmLogo,
    isImage: true,
    description: "Pay using Paytm UPI",
    deepLinkPrefix: "paytmmp://pay"
  },
  {
    id: "gpay",
    name: "Google Pay",
    icon: gpayLogo,
    isImage: true,
    description: "Pay using Google Pay",
    deepLinkPrefix: "tez://upi/pay"
  },
  {
    id: "bhim",
    name: "BHIM UPI",
    icon: bhimLogo,
    isImage: true,
    description: "Pay using BHIM app",
    deepLinkPrefix: "upi://pay"
  },
  {
    id: "upi",
    name: "Pay With UPI",
    icon: upiLogo,
    isImage: true,
    description: "Open any UPI app on your phone",
    deepLinkPrefix: "intent://pay",
    isGenericUPI: true
  }
];

const CartPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const cartItems: CartItem[] = location.state?.cartItems || [];
  const [selectedMethod, setSelectedMethod] = useState<string>("phonepe");
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  const steps = ["Address", "Order Summary", "Payment"];

  // Generate UPI deep link URL
  const generateUPILink = (method: typeof paymentMethods[0], amount: number) => {
    const transactionNote = `Order Payment - ${totalItems} items`;
    
    const upiParams = `pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    if (method.isGenericUPI || method.id === "bhim") {
      return `upi://pay?${upiParams}`;
    }
    
    return `${method.deepLinkPrefix}?${upiParams}`;
  };

  // Generate unique order ID
  const generateOrderId = () => {
    return `OD${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const handlePlaceOrder = () => {
    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
    if (!selectedPaymentMethod) return;

    setIsProcessing(true);

    const upiLink = generateUPILink(selectedPaymentMethod, totalPrice);
    
    const link = document.createElement('a');
    link.href = upiLink;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      window.location.href = upiLink;
    }, 100);

    // Navigate to UPI waiting page
    setTimeout(() => {
      const orderId = generateOrderId();
      const orderDate = new Date().toISOString();
      
      // Clear cart after successful order
      clearCart();
      
      navigate(`/upi-waiting/cart`, {
        state: {
          cartItems,
          orderId,
          orderDate,
          amount: totalPrice
        },
        replace: true
      });
    }, 1500);
  };

  return (
    <MobileContainer>
      <Helmet>
        <title>Payment | AudioMart</title>
        <meta name="description" content="Complete your payment" />
      </Helmet>

      <div className="min-h-screen bg-background pb-20 relative">
        {/* Payment Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground">Processing your payment...</p>
                <p className="text-sm text-muted-foreground">Please complete the payment in your UPI app.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center gap-3 px-3 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/checkout/cart-order', { state: { cartItems } })}
              className="h-9 w-9 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-semibold text-foreground">Payment</h1>
          </div>
        </header>

        {/* Step Indicator */}
        <StepIndicator currentStep={2} steps={steps} />

        {/* Delivery Address Card */}
        <section className="mt-2 bg-card px-4 py-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Rahul Kumar</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">HOME</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                123 Main Street, Apartment 4B<br />
                Bangalore, Karnataka - 560001
              </p>
              <p className="text-xs text-muted-foreground mt-1">+91 98765 43210</p>
            </div>
            <button className="text-xs text-primary font-medium">CHANGE</button>
          </div>
        </section>

        {/* Order Summary Card */}
        <section className="mt-2 bg-card px-4 py-3">
          <p className="text-sm font-semibold text-foreground mb-3">{totalItems} Item{totalItems > 1 ? 's' : ''}</p>
          
          <div className="space-y-3">
            {cartItems.slice(0, 2).map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="w-12 h-12 shrink-0 rounded-sm overflow-hidden bg-muted">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium text-foreground line-clamp-1">
                    {item.product.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-foreground">{formatPrice(item.product.price)}</span>
                    <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
            {cartItems.length > 2 && (
              <p className="text-xs text-muted-foreground">+{cartItems.length - 2} more item{cartItems.length - 2 > 1 ? 's' : ''}</p>
            )}
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mt-2 bg-card">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Select Payment Method</h2>
          </div>
          
          <div className="divide-y divide-border">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedMethod === method.id 
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground/40"
                }`}>
                  {selectedMethod === method.id && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                
                <div className="relative h-10 w-10 shrink-0 rounded-md bg-white flex items-center justify-center overflow-hidden border border-border">
                  {method.isImage ? (
                    <img 
                      src={method.icon as string} 
                      alt={method.name} 
                      className="absolute inset-0 w-full h-full object-contain p-1"
                    />
                  ) : null}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
                
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}

            {/* Cash on Delivery - Disabled */}
            <div className="w-full flex items-center gap-3 px-4 py-4 text-left opacity-50 cursor-not-allowed">
              <div className="h-5 w-5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
              <div className="h-7 w-7 rounded bg-muted flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">₹</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay when you receive</p>
                <p className="text-xs text-red-400 mt-0.5">Not available for your pincode</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Badge */}
        <section className="mt-2 bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-xs">100% Secure Payments. All transactions are encrypted.</span>
          </div>
        </section>

        {/* Price Details */}
        <section className="mt-2 bg-card px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground mb-3">Price Details</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(totalOriginalPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Discount</span>
              <span className="text-sm font-medium text-success">-{formatPrice(totalDiscount)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Delivery Charges</span>
              <span className="text-sm font-medium text-success">FREE</span>
            </div>
          </div>
          
          <div className="border-t border-border my-3"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Amount Payable</span>
            <span className="text-sm font-bold text-foreground">{formatPrice(totalPrice)}</span>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-md bg-card border-t border-border px-4 py-3 shadow-lg">
            <Button
              onClick={handlePlaceOrder}
              className="w-full h-12 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold text-sm rounded-full"
            >
              PAY {formatPrice(totalPrice)}
            </Button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default CartPayment;
