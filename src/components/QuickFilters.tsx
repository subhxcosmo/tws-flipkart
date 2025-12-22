import { brands } from "@/data/products";

interface QuickFiltersProps {
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  hasANC: boolean | null;
  onANCToggle: () => void;
}

const QuickFilters = ({ selectedBrands, onBrandToggle, hasANC, onANCToggle }: QuickFiltersProps) => {
  const quickFilters = [
    { label: "All", value: "all" },
    { label: "ANC", value: "anc" },
    ...brands.map(b => ({ label: b, value: b }))
  ];

  return (
    <div className="overflow-x-auto scrollbar-hide bg-card border-b border-border">
      <div className="flex gap-2 px-3 py-2.5">
        {quickFilters.map((filter) => {
          const isSelected = 
            filter.value === "all" 
              ? selectedBrands.length === 0 && hasANC === null
              : filter.value === "anc"
                ? hasANC === true
                : selectedBrands.includes(filter.value);
          
          return (
            <button
              key={filter.value}
              onClick={() => {
                if (filter.value === "anc") {
                  onANCToggle();
                } else if (filter.value !== "all") {
                  onBrandToggle(filter.value);
                }
              }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-muted-foreground/50"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickFilters;
