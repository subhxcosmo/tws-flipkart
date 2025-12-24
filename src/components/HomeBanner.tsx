import { useState, useEffect } from "react";
// Import banner images locally for instant loading
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpeg";
import banner3 from "@/assets/banner-3.jpeg";

// Banner images array - DO NOT MODIFY THIS LAYOUT
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
    // Full-width edge-to-edge container - NO padding, NO margin - DO NOT MODIFY
    <div className="relative overflow-hidden w-full">
      {/* Fixed aspect ratio container 21:9 - DO NOT MODIFY */}
      <div 
        className="relative w-full"
        style={{ aspectRatio: '21/9' }}
      >
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="w-full h-full shrink-0"
            >
              {/* Image covers entire banner area - edge-to-edge, no gaps */}
              <img 
                src={banner.image} 
                alt={`Banner ${banner.id}`}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
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