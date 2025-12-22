import { ArrowDownUp, Filter } from "lucide-react";
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
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-3 sm:p-4">
      <div className="flex items-center gap-4">
        {showFilterButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterClick}
            className="flex items-center gap-2 lg:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        )}
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{totalProducts}</span> products
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
        <span className="hidden text-sm text-muted-foreground sm:inline">Sort by:</span>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[160px] border-border bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Customer Rating</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortBar;
