import { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Check,
  ChevronRight,
  MapPin,
  MessageCircle,
  FileText,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, Product } from "@/data/products";
import MobileContainer from "@/components/MobileContainer";
import { format, addDays } from "date-fns";

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: { name: string; images?: string[] };
  selectedImage?: string;
}

interface OrderStep {
  id: string;
  title: string;
  date: string;
  description?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface OrderState {
  productId?: string;
  orderId: string;
  orderDate: string;
  cartItems?: CartItem[];
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data from navigation state
  const orderState = location.state as OrderState | null;

  const [orderId] = useState(() => {
    if (orderState?.orderId) return orderState.orderId;
    return `OD${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  });

  const [orderDate] = useState(() => {
    if (orderState?.orderDate) return new Date(orderState.orderDate);
    return new Date();
  });

  // Get products - either from cart items or single product
  const orderProducts: CartItem[] = (() => {
    if (orderState?.cartItems && orderState.cartItems.length > 0) {
      return orderState.cartItems;
    }
    const product = products.find((p) => p.id === id);
    if (product) {
      return [{ product, quantity: 1 }];
    }
    return [];
  })();
  
  if (orderProducts.length === 0) {
    return (
      <MobileContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Order not found</h1>
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

  const totalPrice = orderProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = orderProducts.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate dynamic dates based on order date
  const confirmedDate = orderDate;
  const shippedDate = addDays(orderDate, 2);
  const deliveryDate = addDays(orderDate, 4);

  // Order tracking steps
  const orderSteps: OrderStep[] = [
    {
      id: "confirmed",
      title: "Order Confirmed",
      date: format(confirmedDate, "EEE, MMM d"),
      description: `Your order has been placed, ${format(confirmedDate, "EEE do MMM")}`,
      isCompleted: true,
      isCurrent: true,
    },
    {
      id: "shipped",
      title: "Shipped",
      date: `Expected By ${format(shippedDate, "MMM d")}`,
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: "out_for_delivery",
      title: "Out For Delivery",
      date: "",
      isCompleted: false,
      isCurrent: false,
    },
    {
      id: "delivered",
      title: "Delivery",
      date: `${format(deliveryDate, "EEE, MMM d")} By 9 PM`,
      isCompleted: false,
      isCurrent: false,
    },
  ];

  return (
    <MobileContainer>
      <Helmet>
        <title>Order Details | AudioMart</title>
        <meta name="description" content="View your order details and tracking" />
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="h-9 w-9 shrink-0 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-base font-semibold">Order Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Order ID Section */}
        <section className="bg-muted/50 px-4 py-3 border-b border-border">
          <p className="text-xs text-muted-foreground">
            Order ID - <span className="text-foreground">{orderId}</span>
          </p>
        </section>

        {/* Product Details Cards */}
        <section className="bg-card px-4 py-4 border-b border-border">
          {orderProducts.length > 1 && (
            <p className="text-sm font-semibold text-foreground mb-3">{totalItems} Items</p>
          )}
          
          <div className="space-y-4">
            {orderProducts.map((item, index) => (
              <div key={`${item.product.id}-${item.selectedColor?.name || 'default'}`} className={`flex gap-4 ${index > 0 ? 'pt-4 border-t border-border' : ''}`}>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium text-foreground line-clamp-2 leading-5">
                    {item.product.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.selectedColor ? `Color: ${item.selectedColor.name} · ` : ''}Seller: {item.product.seller || item.product.brand}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-base font-bold text-foreground">
                      {formatPrice(item.product.price)}
                    </p>
                    {item.quantity > 1 && (
                      <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                    )}
                  </div>
                </div>
                <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                  <img
                    src={item.selectedImage || item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {orderProducts.length > 1 && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-sm font-semibold text-foreground">
                Total: {formatPrice(totalPrice)}
              </p>
            </div>
          )}
        </section>

        {/* Share Location Card */}
        <section className="bg-blue-50 dark:bg-blue-950/30 px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-foreground">
                Help our delivery agent reach you faster.
              </p>
            </div>
            <button className="text-sm font-medium text-primary">
              Share Location
            </button>
          </div>
        </section>

        {/* Order Tracking Timeline */}
        <section className="bg-card px-4 py-4">
          <div className="relative">
            {orderSteps.map((step, index) => (
              <div key={step.id} className="flex gap-3 relative">
                {/* Timeline connector */}
                {index < orderSteps.length - 1 && (
                  <div 
                    className={`absolute left-[11px] top-6 w-0.5 h-[calc(100%-8px)] ${
                      step.isCompleted ? "bg-success" : "bg-muted-foreground/30"
                    }`}
                    style={{ 
                      background: step.isCompleted 
                        ? "linear-gradient(to bottom, hsl(var(--success)), hsl(var(--success) / 0.3))" 
                        : undefined 
                    }}
                  />
                )}

                {/* Step indicator */}
                <div className="relative z-10 shrink-0">
                  {step.isCompleted ? (
                    <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-success-foreground stroke-[3]" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 bg-background flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div 
                  className={`flex-1 pb-6 ${
                    step.isCurrent 
                      ? "bg-success/10 -ml-3 pl-6 -mr-4 pr-4 py-2 rounded-sm" 
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${
                      step.isCompleted || step.isCurrent 
                        ? "text-foreground" 
                        : "text-muted-foreground"
                    }`}>
                      {step.title}
                      {step.date && (
                        <span className={`${step.isCompleted ? "" : "text-muted-foreground"}`}>
                          , {step.date}
                        </span>
                      )}
                    </p>
                  </div>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* See All Updates */}
          <button className="flex items-center gap-1 text-primary text-sm font-medium mt-2 ml-9">
            See All Updates
            <ChevronRight className="h-4 w-4" />
          </button>
        </section>

        {/* Action Buttons */}
        <section className="bg-card border-t border-b border-border">
          <div className="grid grid-cols-2 divide-x divide-border">
            <button className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
              Cancel
            </button>
            <button className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
              Need help?
            </button>
          </div>
        </section>

        {/* Chat Section */}
        <section className="bg-card px-4 py-4 mt-2 border-t border-b border-border">
          <button className="flex items-center justify-center gap-2 w-full py-2">
            <MessageCircle className="h-5 w-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Chat with us</span>
          </button>
        </section>

        {/* Invoice Section */}
        <section className="bg-card px-4 py-4 mt-2 border-t border-b border-border">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Invoice download</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Invoice can be downloaded after 24 hours of delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Continue Shopping Button */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-md bg-card border-t border-border px-4 py-3 shadow-lg">
            <Button
              onClick={() => navigate("/")}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default OrderDetails;
