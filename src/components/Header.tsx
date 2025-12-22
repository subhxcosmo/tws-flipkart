import { useState } from "react";
import { Search, ShoppingCart, User, Menu, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Headphones className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:inline">
              AudioMart
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for TWS earbuds, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 border-border bg-muted/30 focus:bg-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                2
              </Badge>
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Home
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Electronics
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">TWS Earbuds</span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
