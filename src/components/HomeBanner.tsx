import { useState, useEffect } from "react";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpeg";
import banner3 from "@/assets/banner-3.jpeg";

const banners = [
  { id: 1, image: banner1 },
  { id: 2, image: banner2 },
  { id: 3, image: banner3 },
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
    <div className="relative w-full bg-muted">
      {/* Aspect ratio wrapper */}
      <div className="relative w-full" style={{ paddingTop: '42.86%' }}>
        {/* Slides container */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ 
              width: `${banners.length * 100}%`,
              transform: `translateX(-${currentIndex * (100 / banners.length)}%)`
            }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="h-full"
                style={{ width: `${100 / banners.length}%` }}
              >
                <img 
                  src={banner.image} 
                  alt={`Banner ${banner.id}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "w-4 bg-white"
                : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;