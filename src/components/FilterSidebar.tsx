import { useState } from "react";
import { ChevronDown, ChevronUp, Star, X } from "lucide-react";
import { brands, priceRanges, ratingFilters, batteryFilters } from "@/data/products";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface Filters {
  brands: string[];
  priceRange: { min: number; max: number } | null;
  minRating: number | null;
  batteryLife: { min: number; max?: number } | null;
  hasANC: boolean | null;
  hasWirelessCharging: boolean | null;
}

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const FilterSidebar = ({ filters, onFiltersChange, onClose, isMobile }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
    rating: true,
    battery: true,
    features: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (range: { min: number; max: number } | null) => {
    onFiltersChange({ ...filters, priceRange: range });
  };

  const handleRatingChange = (rating: number | null) => {
    onFiltersChange({ ...filters, minRating: rating });
  };

  const handleBatteryChange = (battery: { min: number; max?: number } | null) => {
    onFiltersChange({ ...filters, batteryLife: battery });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      brands: [],
      priceRange: null,
      minRating: null,
      batteryLife: null,
      hasANC: null,
      hasWirelessCharging: null,
    });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.priceRange !== null ||
    filters.minRating !== null ||
    filters.batteryLife !== null ||
    filters.hasANC !== null ||
    filters.hasWirelessCharging !== null;

  return (
    <div className="h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1 p-4">
        {/* Price Range */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-3">
            <span className="font-medium text-foreground">Price</span>
            {openSections.price ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-3">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={
                    filters.priceRange?.min === range.min &&
                    filters.priceRange?.max === range.max
                  }
                  onCheckedChange={(checked) =>
                    handlePriceChange(checked ? range : null)
                  }
                />
                <span className="text-sm text-foreground">{range.label}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brand */}
        <Collapsible open={openSections.brand} onOpenChange={() => toggleSection("brand")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-3">
            <span className="font-medium text-foreground">Brand</span>
            {openSections.brand ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-3">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                />
                <span className="text-sm text-foreground">{brand}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Customer Rating */}
        <Collapsible open={openSections.rating} onOpenChange={() => toggleSection("rating")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-3">
            <span className="font-medium text-foreground">Customer Rating</span>
            {openSections.rating ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-3">
            {ratingFilters.map((rating) => (
              <label
                key={rating}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={filters.minRating === rating}
                  onCheckedChange={(checked) => handleRatingChange(checked ? rating : null)}
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm text-foreground">{rating}</span>
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-sm text-muted-foreground">& above</span>
                </div>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Battery Life */}
        <Collapsible open={openSections.battery} onOpenChange={() => toggleSection("battery")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-3">
            <span className="font-medium text-foreground">Battery Life</span>
            {openSections.battery ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-3">
            {batteryFilters.map((battery) => (
              <label
                key={battery.label}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={
                    filters.batteryLife?.min === battery.min &&
                    filters.batteryLife?.max === battery.max
                  }
                  onCheckedChange={(checked) =>
                    handleBatteryChange(checked ? battery : null)
                  }
                />
                <span className="text-sm text-foreground">{battery.label}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Features */}
        <Collapsible open={openSections.features} onOpenChange={() => toggleSection("features")}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-3">
            <span className="font-medium text-foreground">Features</span>
            {openSections.features ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50">
              <Checkbox
                checked={filters.hasANC === true}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, hasANC: checked ? true : null })
                }
              />
              <span className="text-sm text-foreground">Active Noise Cancellation</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50">
              <Checkbox
                checked={filters.hasWirelessCharging === true}
                onCheckedChange={(checked) =>
                  onFiltersChange({
                    ...filters,
                    hasWirelessCharging: checked ? true : null,
                  })
                }
              />
              <span className="text-sm text-foreground">Wireless Charging</span>
            </label>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default FilterSidebar;
