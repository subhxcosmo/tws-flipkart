import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import MobileContainer from "@/components/MobileContainer";

const OrderProcessing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data from navigation state
  const orderData = location.state as {
    productId: string;
    orderId: string;
    orderDate: string;
  } | null;

  useEffect(() => {
    // Redirect to order details after 40 seconds
    const timer = setTimeout(() => {
      navigate(`/order/${id}`, { 
        state: orderData,
        replace: true 
      });
    }, 40000); // 40 seconds

    return () => clearTimeout(timer);
  }, [id, navigate, orderData]);

  return (
    <MobileContainer>
      <Helmet>
        <title>Processing Order | AudioMart</title>
        <meta name="description" content="Processing your order" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        {/* Processing Animation Container */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Animated Loader */}
          <div className="relative">
            {/* Outer ring */}
            <div className="h-20 w-20 rounded-full border-4 border-muted animate-pulse" />
            {/* Spinning inner ring */}
            <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">
              Processing your order...
            </h1>
            <p className="text-sm text-muted-foreground max-w-xs">
              Please wait while we confirm your payment and place your order. Do not close this page.
            </p>
          </div>

          {/* Progress dots animation */}
          <div className="flex gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default OrderProcessing;
