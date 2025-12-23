import { useState } from "react";
import { ArrowLeft, Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header = ({ showBackButton = false, title }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Header Bar - Logo and Cart */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Back Button or Logo */}
          {showBackButton ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="h-9 w-9 shrink-0 text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/" className="flex items-center shrink-0">
              <img 
                src={logoImage} 
                alt="Flipkart" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 text-foreground hover:bg-muted"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-2xs font-bold text-primary-foreground">
                  {getTotalItems() > 99 ? '99+' : getTotalItems()}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar - Below header */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={title || "Search for Products"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-md border-0 bg-[#F0F0F0] pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
