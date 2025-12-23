import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Check,
  ChevronRight,
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import StepIndicator from "@/components/checkout/StepIndicator";
import MobileContainer from "@/components/MobileContainer";
// Import real logos
import phonepeLogo from "@/assets/phonepe-logo.png";
import paytmLogo from "@/assets/paytm-logo.png";
import gpayLogo from "@/assets/gpay-logo.png";
import upiLogo from "@/assets/upi-logo.png";
import bhimLogo from "@/assets/bhim-logo.png";

// UPI ID for receiving payments
const UPI_ID = "trendaura432220.rzp@icici";
const MERCHANT_NAME = "TrendAura";

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

const Payment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>("phonepe");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const product = products.find((p) => p.id === id);
  
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

  const deliveryCharge = product.price > 500 ? 0 : 40;
  const total = product.price + deliveryCharge;
  const discount = product.originalPrice - product.price;
  const discountPercentage = Math.round((discount / product.originalPrice) * 100);

  const steps = ["Address", "Order Summary", "Payment"];

  // Generate UPI deep link URL
  const generateUPILink = (method: typeof paymentMethods[0], amount: number) => {
    const transactionNote = `Order Payment - ${product.name.substring(0, 30)}`;
    
    // Build UPI params
    const upiParams = new URLSearchParams({
      pa: UPI_ID,
      pn: MERCHANT_NAME,
      am: amount.toString(),
      cu: "INR",
      tn: transactionNote
    });
    
    // For generic UPI, use upi:// scheme directly - this opens app chooser on Android
    if (method.isGenericUPI) {
      return `upi://pay?${upiParams.toString()}`;
    }
    
    // For specific apps, use their dedicated deep links
    return `${method.deepLinkPrefix}?${upiParams.toString()}`;
  };

  const handlePlaceOrder = () => {
    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
    if (!selectedPaymentMethod) return;

    setIsProcessing(true);

    // Generate the UPI deep link with total amount
    const upiLink = generateUPILink(selectedPaymentMethod, total);
    
    // Open the UPI app
    window.location.href = upiLink;

    // Since we can't automatically detect payment completion,
    // we'll keep the processing state and let user manually confirm
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
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            
            {/* Loader content */}
            <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
              {/* Circular loader */}
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
              onClick={() => navigate(-1)}
              className="h-9 w-9 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-semibold text-foreground">Payment</h1>
          </div>
        </header>

        {/* Step Indicator - All steps checked except current */}
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
          <div className="flex gap-3">
            <div className="w-16 h-16 shrink-0 rounded-sm border border-border overflow-hidden bg-muted p-1">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium text-foreground line-clamp-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-xs font-medium text-success">{discountPercentage}% off</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Qty: 1</p>
            </div>
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
                {/* Selection Circle */}
                <div className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedMethod === method.id 
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground/40"
                }`}>
                  {selectedMethod === method.id && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                
                {/* Icon */}
                {method.isImage ? (
                  <img src={method.icon as string} alt={method.name} className="h-7 w-7 object-contain rounded" />
                ) : (
                  <method.icon />
                )}
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
                
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}

            {/* Cash on Delivery - Disabled */}
            <div className="w-full flex items-center gap-3 px-4 py-4 text-left opacity-50 cursor-not-allowed">
              {/* Selection Circle - Disabled */}
              <div className="h-5 w-5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
              
              {/* COD Icon */}
              <div className="h-7 w-7 rounded bg-muted flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">₹</span>
              </div>
              
              {/* Info */}
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
              <span className="text-sm text-muted-foreground">Price (1 item)</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Discount</span>
              <span className="text-sm font-medium text-success">-{formatPrice(discount)} ({discountPercentage}% off)</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Delivery Charges</span>
              <span className="text-sm font-medium text-success">FREE</span>
            </div>
          </div>
          
          <div className="border-t border-border my-3"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Amount Payable</span>
            <span className="text-sm font-bold text-foreground">{formatPrice(total)}</span>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-md bg-card border-t border-border px-4 py-3 shadow-lg">
            <Button
              onClick={handlePlaceOrder}
              className="w-full h-12 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold text-sm"
            >
              PAY {formatPrice(total)}
            </Button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Payment;
