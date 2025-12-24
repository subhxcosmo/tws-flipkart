import { useState, useEffect } from "react";

// Banner configuration - DO NOT MODIFY THIS LAYOUT
const banners = [
  { id: 1, image: "/images/banner-1.jpg" },
  { id: 2, image: "/images/banner-2.jpeg" },
  { id: 3, image: "/images/banner-3.jpeg" },
];

const HomeBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    // Full-width edge-to-edge container - NO padding, NO margin - DO NOT MODIFY
    <div className="relative w-full overflow-hidden bg-muted">
      {/* Fixed aspect ratio container 21:9 - DO NOT MODIFY */}
      <div 
        className="relative w-full"
        style={{ aspectRatio: '21/9' }}
      >
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="relative w-full h-full shrink-0 flex-none"
              style={{ minWidth: '100%' }}
            >
              {/* Image covers entire banner area - edge-to-edge, no gaps */}
              <img 
                src={banner.image} 
                alt={`Banner ${banner.id}`}
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={() => handleImageLoad(index)}
                onError={(e) => {
                  console.error(`Failed to load banner ${index + 1}:`, banner.image);
                }}
              />
            </div>
          ))}
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