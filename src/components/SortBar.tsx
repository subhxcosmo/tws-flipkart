import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "popularity" | "price-low" | "price-high" | "newest" | "rating";

interface SortBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalProducts: number;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
}

const SortBar = ({
  sortBy,
  onSortChange,
  totalProducts,
  onFilterClick,
  showFilterButton,
}: SortBarProps) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "popularity", label: "Popularity" },
    { value: "price-low", label: "Price -- Low to High" },
    { value: "price-high", label: "Price -- High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Rating" },
  ];

  return (
    <div className="sticky top-[52px] z-40 flex items-center justify-between bg-card border-b border-border px-3 py-2 sm:top-[76px]">
      {/* Mobile: Sort & Filter Buttons */}
      <div className="flex items-center gap-2 sm:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs font-medium"
          onClick={onFilterClick}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </Button>
        <div className="h-4 w-px bg-border" />
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="h-8 w-auto gap-1.5 border-0 bg-transparent px-2.5 text-xs font-medium shadow-none focus:ring-0">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Sort</span>
          </SelectTrigger>
          <SelectContent align="start" className="bg-card">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-sm">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Full Sort Bar */}
      <div className="hidden items-center gap-4 sm:flex">
        {showFilterButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFilterClick}
            className="h-8 gap-1.5 px-3 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        )}
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalProducts}</span> products
        </p>
      </div>

      {/* Desktop: Sort Options as Tabs */}
      <div className="hidden items-center gap-1 sm:flex">
        <span className="mr-2 text-xs font-medium text-muted-foreground">Sort By</span>
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
              sortBy === option.value
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Mobile: Product Count */}
      <p className="text-xs text-muted-foreground sm:hidden">
        {totalProducts} items
      </p>
    </div>
  );
};

export default SortBar;
