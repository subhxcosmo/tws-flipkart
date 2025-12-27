import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Check } from "lucide-react";
import MobileContainer from "@/components/MobileContainer";

// Sparkle component for the animation
const Sparkle = ({ 
  style, 
  delay = 0,
  size = 16,
  color = "text-yellow-400"
}: { 
  style: React.CSSProperties; 
  delay?: number;
  size?: number;
  color?: string;
}) => (
  <div 
    className={`absolute ${color} animate-pulse`}
    style={{ 
      ...style, 
      animationDelay: `${delay}ms`,
      animationDuration: '1s'
    }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </div>
);

// Star component
const Star = ({ 
  style, 
  delay = 0,
  size = 12
}: { 
  style: React.CSSProperties; 
  delay?: number;
  size?: number;
}) => (
  <div 
    className="absolute text-emerald-600 animate-pulse"
    style={{ 
      ...style, 
      animationDelay: `${delay}ms`,
      animationDuration: '1.2s'
    }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  </div>
);

const PaymentSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCheck, setShowCheck] = useState(false);
  const [showText, setShowText] = useState(false);
  
  // Get data from navigation state
  const paymentData = location.state as {
    productId: string;
    orderId: string;
    orderDate: string;
    amount: number;
  } | null;

  useEffect(() => {
    // Animate the checkmark appearing
    const checkTimer = setTimeout(() => setShowCheck(true), 300);
    const textTimer = setTimeout(() => setShowText(true), 800);

    // Navigate to order details after 3.5 seconds
    const redirectTimer = setTimeout(() => {
      navigate(`/order/${id}`, {
        state: paymentData,
        replace: true
      });
    }, 3500);

    return () => {
      clearTimeout(checkTimer);
      clearTimeout(textTimer);
      clearTimeout(redirectTimer);
    };
  }, [id, navigate, paymentData]);

  return (
    <MobileContainer>
      <Helmet>
        <title>Order Placed | AudioMart</title>
        <meta name="description" content="Your order has been placed successfully" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Sparkles and Stars - Positioned around the center */}
        <Sparkle style={{ top: '25%', left: '15%' }} delay={0} size={20} />
        <Sparkle style={{ top: '30%', right: '18%' }} delay={200} size={16} />
        <Sparkle style={{ bottom: '35%', left: '20%' }} delay={400} size={14} />
        <Sparkle style={{ bottom: '30%', right: '15%' }} delay={600} size={18} />
        <Sparkle style={{ top: '35%', left: '25%' }} delay={300} size={12} />
        <Sparkle style={{ top: '40%', right: '25%' }} delay={500} size={14} />
        
        <Star style={{ top: '28%', left: '30%' }} delay={100} size={16} />
        <Star style={{ top: '32%', right: '28%' }} delay={350} size={14} />
        <Star style={{ bottom: '38%', left: '28%' }} delay={250} size={12} />
        <Star style={{ bottom: '32%', right: '30%' }} delay={450} size={16} />
        <Star style={{ top: '45%', left: '12%' }} delay={150} size={10} />
        <Star style={{ bottom: '45%', right: '12%' }} delay={550} size={10} />

        {/* Main Success Animation */}
        <div className="relative flex flex-col items-center">
          {/* Outer glow rings */}
          <div className="relative">
            {/* Outer ring - light pink/purple */}
            <div 
              className={`h-48 w-48 rounded-full bg-pink-100/50 dark:bg-pink-900/20 flex items-center justify-center transition-all duration-700 ${
                showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              {/* Middle ring */}
              <div 
                className={`h-36 w-36 rounded-full bg-pink-100/70 dark:bg-pink-900/30 flex items-center justify-center transition-all duration-500 delay-100 ${
                  showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
              >
                {/* Inner ring */}
                <div 
                  className={`h-28 w-28 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center transition-all duration-300 delay-200 ${
                    showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                >
                  {/* Green checkmark circle */}
                  <div 
                    className={`h-20 w-20 rounded-full bg-success flex items-center justify-center shadow-lg transition-all duration-500 delay-300 ${
                      showCheck ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                  >
                    <Check 
                      className={`h-10 w-10 text-white transition-all duration-300 delay-500 ${
                        showCheck ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`} 
                      strokeWidth={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Placed Text */}
          <h1 
            className={`mt-8 text-2xl font-semibold text-foreground transition-all duration-500 ${
              showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Order Placed
          </h1>
        </div>
      </div>
    </MobileContainer>
  );
};

export default PaymentSuccess;
