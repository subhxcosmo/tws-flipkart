import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";
import SortBar, { SortOption } from "@/components/SortBar";
import ProductCard from "@/components/ProductCard";
import { products, Product } from "@/data/products";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Index = () => {
  const [filters, setFilters] = useState<Filters>({
    brands: [],
    priceRange: null,
    minRating: null,
    batteryLife: null,
    hasANC: null,
    hasWirelessCharging: null,
  });
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    if (filters.priceRange) {
      result = result.filter(
        (p) => p.price >= filters.priceRange!.min && p.price <= filters.priceRange!.max
      );
    }

    if (filters.minRating) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }

    if (filters.batteryLife) {
      result = result.filter((p) => {
        const { min, max } = filters.batteryLife!;
        if (max) {
          return p.batteryLife >= min && p.batteryLife < max;
        }
        return p.batteryLife >= min;
      });
    }

    if (filters.hasANC === true) {
      result = result.filter((p) => p.hasANC);
    }

    if (filters.hasWirelessCharging === true) {
      result = result.filter((p) => p.hasWirelessCharging);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "popularity":
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [filters, sortBy]);

  return (
    <>
      <Helmet>
        <title>TWS Earbuds - Best True Wireless Earbuds | AudioMart</title>
        <meta
          name="description"
          content="Shop the best TWS earbuds with ANC, long battery life, and premium sound. Compare prices, ratings, and features from top brands."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              True Wireless Earbuds
            </h1>
            <p className="mt-1 text-muted-foreground">
              Discover premium TWS earbuds with exceptional sound quality
            </p>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-28 rounded-lg border border-border overflow-hidden">
                <FilterSidebar filters={filters} onFiltersChange={setFilters} />
              </div>
            </aside>

            {/* Mobile Filter Sheet */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetContent side="left" className="w-80 p-0">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClose={() => setIsMobileFilterOpen(false)}
                  isMobile
                />
              </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 space-y-4">
              <SortBar
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalProducts={filteredAndSortedProducts.length}
                onFilterClick={() => setIsMobileFilterOpen(true)}
                showFilterButton
              />

              {/* Product Grid */}
              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 py-16">
                  <p className="text-lg font-medium text-foreground">No products found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters to find what you're looking for
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2024 AudioMart. All rights reserved.</p>
              <p className="mt-1">Your trusted destination for premium audio gear.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
