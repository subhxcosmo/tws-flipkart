import { useState } from "react";
import { ArrowLeft, Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header = ({ showBackButton = false, title }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      {/* Main Header Bar */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-3">
          {/* Back Button / Menu */}
          {showBackButton ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="h-9 w-9 shrink-0 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-lg font-bold text-primary-foreground italic">
                AudioMart
              </span>
            </Link>
          )}

          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Input
                type="search"
                placeholder={title || "Search for TWS earbuds"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-sm border-0 bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-2xs font-bold text-accent-foreground">
                2
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb - Only on home page on larger screens */}
      {isHome && (
        <div className="hidden border-t border-primary-foreground/10 bg-primary sm:block">
          <div className="px-4 py-1.5">
            <nav className="flex items-center gap-1.5 text-xs">
              <span className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">
                Home
              </span>
              <span className="text-primary-foreground/50">&gt;</span>
              <span className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">
                Electronics
              </span>
              <span className="text-primary-foreground/50">&gt;</span>
              <span className="text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">
                Audio
              </span>
              <span className="text-primary-foreground/50">&gt;</span>
              <span className="font-medium text-primary-foreground">
                True Wireless Earbuds
              </span>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
