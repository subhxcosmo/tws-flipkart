import { useState } from "react";
import { ArrowLeft, Search, Heart, Menu, X } from "lucide-react";
import logoImage from "@/assets/logo.png";
import cartIcon from "@/assets/shopping-cart.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  compact?: boolean;
}

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  compact?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Header = ({ 
  showBackButton = false, 
  title, 
  compact = false,
  searchQuery: externalSearchQuery,
  onSearchChange 
}: HeaderProps) => {
  const { getTotalItems } = useCart();
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // Use external or internal search query
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchQuery(value);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm w-full">
      {/* Top Header Bar - Logo and Cart */}
      <div className={`px-4 ${compact ? 'py-2' : 'py-3'} safe-area-inset`}>
        <div className="flex items-center justify-between w-full gap-4">
          {/* Back Button or Logo */}
          {showBackButton ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="h-10 w-10 shrink-0 text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          ) : (
            <Link to="/" className="flex items-center shrink-0">
              <img 
                src={logoImage} 
                alt="Flipkart" 
                className="h-[52px] sm:h-[60px] w-auto object-contain"
              />
            </Link>
          )}

          {/* Cart Icon - with guaranteed minimum tap target */}
          <Link to="/cart" className="relative shrink-0 p-2 -mr-2">
            <img 
              src={cartIcon} 
              alt="Cart" 
              className="h-8 w-8 object-contain"
            />
            {getTotalItems() > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {getTotalItems() > 99 ? '99+' : getTotalItems()}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search Bar - Below header */}
      <div className={`px-4 ${compact ? 'pb-2.5' : 'pb-3'}`}>
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={title || "Search for Products"}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`${compact ? 'h-11' : 'h-12'} w-full rounded-lg border-0 bg-[#F0F0F0] pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0`}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
