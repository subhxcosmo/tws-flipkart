import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import QuickFilters from "@/components/QuickFilters";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";
import SortBar, { SortOption } from "@/components/SortBar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
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

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: newBrands });
  };

  const handleANCToggle = () => {
    setFilters({ ...filters, hasANC: filters.hasANC === true ? null : true });
  };

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

        {/* Quick Filters */}
        <QuickFilters
          selectedBrands={filters.brands}
          onBrandToggle={handleBrandToggle}
          hasANC={filters.hasANC}
          onANCToggle={handleANCToggle}
        />

        {/* Sort Bar */}
        <SortBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalProducts={filteredAndSortedProducts.length}
          onFilterClick={() => setIsMobileFilterOpen(true)}
          showFilterButton
        />

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

        {/* Main Content Area */}
        <div className="flex">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
            <div className="sticky top-[76px] h-[calc(100vh-76px)] overflow-y-auto">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isSponsored={index === 0 || index === 5}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-base font-medium text-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card">
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 AudioMart. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
