import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import MobileContainer from "@/components/MobileContainer";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/data/products";

interface CartItem {
  product: Product;
  quantity: number;
}

interface PaymentData {
  productId?: string;
  orderId: string;
  orderDate: string;
  amount: number;
  cartItems?: CartItem[];
}

const UPIWaiting = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const paymentData = location.state as PaymentData | null;

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 seconds
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress for the bar (based on 2 minute display)
  const progressValue = ((120 - timeLeft) / 120) * 100;

  useEffect(() => {
    // Timer that counts down every second
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Auto-confirm at 30 seconds and navigate to success screen
    const confirmTimer = setTimeout(() => {
      navigate(`/payment-success/${id}`, {
        state: paymentData,
        replace: true
      });
    }, 30000); // 30 seconds

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(confirmTimer);
    };
  }, [id, navigate, paymentData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <MobileContainer>
      <Helmet>
        <title>Complete Payment | AudioMart</title>
        <meta name="description" content="Complete your UPI payment" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Pay Amount */}
          <h1 className="text-2xl font-bold text-foreground mb-8">
            Pay {formatPrice(paymentData?.amount || 0)}
          </h1>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mb-6">
            <Progress value={progressValue} className="h-2 bg-muted" />
          </div>

          {/* Expiry Text */}
          <p className="text-sm text-muted-foreground mb-1">
            This page will automatically expire in
          </p>
          <p className="text-lg font-semibold text-success mb-10">
            {formatTime(timeLeft)} minutes
          </p>

          {/* Steps */}
          <div className="w-full max-w-sm space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <p className="text-sm text-foreground">Go to your UPI App.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <p className="text-sm text-foreground">Select the payment request from AudioMart</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <p className="text-sm text-foreground">Enter UPI PIN and complete the payment</p>
            </div>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default UPIWaiting;
