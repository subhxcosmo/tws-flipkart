import { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    title: "Best TWS Deals",
    subtitle: "Up to 70% Off",
    bgColor: "from-primary to-primary/80",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Premium Sound Quality",
    bgColor: "from-accent to-accent/80",
  },
  {
    id: 3,
    title: "Bank Offers",
    subtitle: "Extra 10% Off on SBI Cards",
    bgColor: "from-success to-success/80",
  },
];

const HomeBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`w-full shrink-0 bg-gradient-to-r ${banner.bgColor} px-4 py-6`}
          >
            <div className="text-center text-primary-foreground">
              <p className="text-xs font-medium opacity-90">{banner.subtitle}</p>
              <h2 className="mt-1 text-xl font-bold">{banner.title}</h2>
            </div>
          </div>
        ))}
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "w-4 bg-primary-foreground"
                : "w-1.5 bg-primary-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
