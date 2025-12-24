import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import QuickFilters from "@/components/QuickFilters";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";
import SortBar, { SortOption } from "@/components/SortBar";
import ProductCard from "@/components/ProductCard";
import HomeBanner from "@/components/HomeBanner";
import MobileContainer from "@/components/MobileContainer";
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
  const [showFullListing, setShowFullListing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.highlights.some(h => h.toLowerCase().includes(query))
      );
    }

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
  }, [filters, sortBy, searchQuery]);

  // Curated product sections
  const bestDeals = useMemo(() => 
    [...products].sort((a, b) => b.discount - a.discount).slice(0, 8), 
    []
  );
  
  const topRated = useMemo(() => 
    [...products].sort((a, b) => b.rating - a.rating).slice(0, 8), 
    []
  );
  
  const newArrivals = useMemo(() => 
    [...products].sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 8), 
    []
  );
  
  const under999 = useMemo(() => 
    products.filter(p => p.price < 1000).slice(0, 8), 
    []
  );
  
  const recommended = useMemo(() => 
    [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8), 
    []
  );
  
  const sponsored = useMemo(() => 
    [...products].sort(() => Math.random() - 0.5).slice(0, 8), 
    []
  );

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: newBrands });
    setShowFullListing(true);
  };

  const handleANCToggle = () => {
    setFilters({ ...filters, hasANC: filters.hasANC === true ? null : true });
    setShowFullListing(true);
  };

  const hasActiveFilters = filters.brands.length > 0 || 
    filters.priceRange !== null || 
    filters.minRating !== null || 
    filters.batteryLife !== null || 
    filters.hasANC !== null || 
    filters.hasWirelessCharging !== null ||
    searchQuery.trim().length > 0;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowFullListing(true);
    }
  };

  return (
    <MobileContainer>
      <Helmet>
        <title>TWS Earbuds - Best True Wireless Earbuds | AudioMart</title>
        <meta
          name="description"
          content="Shop the best TWS earbuds with ANC, long battery life, and premium sound. Compare prices, ratings, and features from top brands."
        />
      </Helmet>

      <div className="min-h-screen min-h-[100dvh] bg-background">
        <Header compact searchQuery={searchQuery} onSearchChange={handleSearchChange} />

        {/* Quick Filters */}
        <QuickFilters
          selectedBrands={filters.brands}
          onBrandToggle={handleBrandToggle}
          hasANC={filters.hasANC}
          onANCToggle={handleANCToggle}
        />

        {/* Show Homepage sections or Full Listing */}
        {!showFullListing && !hasActiveFilters ? (
          <>
            {/* Banner Carousel - full width edge-to-edge */}
            <HomeBanner />

            {/* Static 2-column Product Grid - All 18 products */}
            <div className="bg-card p-2">
              <h2 className="text-sm font-bold text-foreground mb-2 px-1">All Products</h2>
              <div className="grid grid-cols-2 gap-2">
                {products.slice(0, 18).map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isSponsored={index === 0 || index === 5}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* View All Products Button */}
            <div className="px-4 py-4 bg-card border-t border-border">
              <button
                onClick={() => setShowFullListing(true)}
                className="w-full py-3 border border-primary text-primary font-medium text-sm rounded-sm hover:bg-primary/5 transition-colors"
              >
                View All Products
              </button>
            </div>
          </>
        ) : (
          <>
            
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

            {/* Product Grid - Strict 2 columns */}
            <main className="p-2">
              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      isSponsored={index === 0 || index === 5}
                      index={index}
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
          </>
        )}

        {/* Footer */}
        <footer className="border-t border-border bg-card">
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 AudioMart. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </MobileContainer>
  );
};

export default Index;
