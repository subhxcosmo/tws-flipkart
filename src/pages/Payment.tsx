import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Check,
  ChevronRight,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import StepIndicator from "@/components/checkout/StepIndicator";
import MobileContainer from "@/components/MobileContainer";

const paymentMethods = [
  {
    id: "phonepe",
    name: "PhonePe",
    icon: "📱",
    description: "Pay using PhonePe UPI"
  },
  {
    id: "paytm",
    name: "Paytm",
    icon: "💳",
    description: "Pay using Paytm UPI"
  },
  {
    id: "gpay",
    name: "Google Pay",
    icon: "🅿️",
    description: "Pay using Google Pay"
  },
  {
    id: "bhim",
    name: "BHIM UPI",
    icon: "🏦",
    description: "Pay using any UPI app"
  }
];

const Payment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>("phonepe");
  
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

  const steps = ["Address", "Order Summary", "Payment"];

  const handlePlaceOrder = () => {
    // Mock order placement
    alert("Order placed successfully!");
    navigate("/");
  };

  return (
    <MobileContainer>
      <Helmet>
        <title>Payment | AudioMart</title>
        <meta name="description" content="Complete your payment" />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
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

        {/* Order Summary Card */}
        <section className="mt-2 bg-card px-4 py-3">
          <div className="flex gap-3">
            <div className="w-14 h-14 shrink-0 rounded-sm border border-border overflow-hidden bg-muted p-1">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium text-foreground line-clamp-1">
                {product.name}
              </h2>
              <p className="mt-0.5 text-base font-bold text-price">
                {formatPrice(total)}
              </p>
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
                <span className="text-2xl">{method.icon}</span>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
                
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* Security Badge */}
        <section className="mt-2 bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-xs">100% Secure Payments. All transactions are encrypted.</span>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-2 bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Total Payable</span>
            <span className="text-base font-bold text-price">{formatPrice(total)}</span>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-md bg-card border-t border-border px-4 py-3 shadow-lg">
            <Button
              onClick={handlePlaceOrder}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm"
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
