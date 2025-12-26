import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const OrderSummary = lazy(() => import("./pages/OrderSummary"));
const AddressForm = lazy(() => import("./pages/AddressForm"));
const Payment = lazy(() => import("./pages/Payment"));
const OrderProcessing = lazy(() => import("./pages/OrderProcessing"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout/order/:id" element={<OrderSummary />} />
              <Route path="/checkout/address/:id" element={<AddressForm />} />
              <Route path="/checkout/payment/:id" element={<Payment />} />
              <Route path="/order-processing/:id" element={<OrderProcessing />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
