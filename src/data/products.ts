import airpods1 from "@/assets/airpods-4-main.png";
import airpods2 from "@/assets/airpods-4-case.png";
import airpods3 from "@/assets/airpods-4-detail.jpeg";
import airpods4 from "@/assets/airpods-4-earbuds.png";

// Color variant interface
export interface ColorVariant {
  name: string;
  color: string; // hex color for the dot/preview
  images: string[]; // array of images for this color variant
}

// Default color variants that can be applied to products
export const defaultColorVariants: ColorVariant[] = [
  {
    name: "Navy Blue",
    color: "#1E3A5F",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
    ],
  },
  {
    name: "Jet Black",
    color: "#1A1A1A",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
    ],
  },
  {
    name: "Olive Green",
    color: "#4A5D23",
    images: [
      "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=300&h=300&fit=crop",
    ],
  },
  {
    name: "Wine Red",
    color: "#8B2346",
    images: [
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=300&h=300&fit=crop",
    ],
  },
  {
    name: "Silver",
    color: "#C0C0C0",
    images: [
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
    ],
  },
];

export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: number;
  highlights: string[];
  batteryLife: number;
  hasANC: boolean;
  hasWirelessCharging: boolean;
  colorVariants?: ColorVariant[]; // optional - uses defaultColorVariants if not specified
  description?: string; // optional detailed description for product page
  images?: string[]; // optional array of images for product slider
}

export const products: Product[] = [
  {
    id: "1",
    name: "AirPods 4 Wireless Earbuds, Personalised Spatial Audio, Sweat and Water Resistant Bluetooth Headset (White, True Wireless)",
    brand: "Apple",
    image: airpods4, // Earbuds image for homepage thumbnail
    rating: 4.8,
    reviews: 24567,
    price: 149,
    originalPrice: 12000,
    discount: 98,
    highlights: ["30H Battery", "Seamless Pairing", "Spatial Audio"],
    batteryLife: 30,
    hasANC: true,
    hasWirelessCharging: true,
    colorVariants: [],
    description: "Experience next-level audio with Apple AirPods 4th Generation. Featuring the powerful H2 chip, these earbuds deliver exceptional sound quality with richer bass and crisp highs. Personalized Spatial Audio with dynamic head tracking creates an immersive listening experience that surrounds you in sound. With up to 30 hours of total listening time using the charging case, seamless switching between Apple devices, and one-touch setup, AirPods 4 redefine wireless convenience. The redesigned contoured fit ensures all-day comfort, while the force sensor stem lets you control music and calls effortlessly.",
    images: [airpods1, airpods2, airpods3], // Detail page uses all images
  },
  {
    id: "2",
    name: "SoundPods Pro Max",
    brand: "AudioTech",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 12543,
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    highlights: ["40H Battery", "ANC", "HD Calls"],
    batteryLife: 40,
    hasANC: true,
    hasWirelessCharging: true,
    colorVariants: [
      {
        name: "Midnight Black",
        color: "#1A1A1A",
        images: [
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
        ],
      },
      {
        name: "Pearl White",
        color: "#F5F5F5",
        images: [
          "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
        ],
      },
      {
        name: "Ocean Blue",
        color: "#1E3A5F",
        images: [
          "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=300&h=300&fit=crop",
          "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=300&h=300&fit=crop",
        ],
      },
    ],
  },
  {
    id: "3",
    name: "BassBuds Elite",
    brand: "SoundWave",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 8921,
    price: 1799,
    originalPrice: 2999,
    discount: 40,
    highlights: ["30H Battery", "Deep Bass", "IPX5"],
    batteryLife: 30,
    hasANC: false,
    hasWirelessCharging: false,
  },
  {
    id: "4",
    name: "ClearSound X1",
    brand: "AudioTech",
    image: "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 5632,
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    highlights: ["50H Battery", "Premium ANC", "Spatial Audio"],
    batteryLife: 50,
    hasANC: true,
    hasWirelessCharging: true,
  },
  {
    id: "5",
    name: "BudZ Lite",
    brand: "EchoSound",
    image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 15234,
    price: 699,
    originalPrice: 1499,
    discount: 53,
    highlights: ["20H Battery", "Lightweight", "Quick Pair"],
    batteryLife: 20,
    hasANC: false,
    hasWirelessCharging: false,
  },
  {
    id: "6",
    name: "NoisePods Ultra",
    brand: "QuietZone",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 7845,
    price: 4499,
    originalPrice: 6999,
    discount: 36,
    highlights: ["45H Battery", "Adaptive ANC", "Wireless Charge"],
    batteryLife: 45,
    hasANC: true,
    hasWirelessCharging: true,
  },
  {
    id: "7",
    name: "FitBuds Sport",
    brand: "ActiveGear",
    image: "https://images.unsplash.com/photo-1608156639585-b3a776ea2049?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 9123,
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    highlights: ["25H Battery", "IPX7", "Secure Fit"],
    batteryLife: 25,
    hasANC: false,
    hasWirelessCharging: false,
  },
  {
    id: "8",
    name: "StudioPods Pro",
    brand: "SoundWave",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 3421,
    price: 5999,
    originalPrice: 8999,
    discount: 33,
    highlights: ["60H Battery", "Studio ANC", "Hi-Res Audio"],
    batteryLife: 60,
    hasANC: true,
    hasWirelessCharging: true,
  },
  {
    id: "9",
    name: "EcoBuds Green",
    brand: "EchoSound",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
    rating: 4.1,
    reviews: 6543,
    price: 999,
    originalPrice: 1999,
    discount: 50,
    highlights: ["28H Battery", "Eco-Friendly", "Clear Calls"],
    batteryLife: 28,
    hasANC: false,
    hasWirelessCharging: false,
  },
  {
    id: "10",
    name: "AirPods Clone X",
    brand: "QuietZone",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop",
    rating: 4.0,
    reviews: 18234,
    price: 549,
    originalPrice: 999,
    discount: 45,
    highlights: ["18H Battery", "Touch Control", "Compact"],
    batteryLife: 18,
    hasANC: false,
    hasWirelessCharging: false,
  },
  {
    id: "11",
    name: "GamePods Zero",
    brand: "ActiveGear",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
    rating: 4.9,
    reviews: 4521,
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    highlights: ["35H Battery", "Low Latency", "RGB Lights"],
    batteryLife: 35,
    hasANC: true,
    hasWirelessCharging: false,
  },
  {
    id: "12",
    name: "TravelPods Comfort",
    brand: "AudioTech",
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 2987,
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    highlights: ["42H Battery", "Flight Mode", "Comfort Fit"],
    batteryLife: 42,
    hasANC: true,
    hasWirelessCharging: true,
  },
  {
    id: "13",
    name: "BudZ Mini",
    brand: "EchoSound",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 21345,
    price: 399,
    originalPrice: 799,
    discount: 50,
    highlights: ["15H Battery", "Ultra Light", "Basic Audio"],
    batteryLife: 15,
    hasANC: false,
    hasWirelessCharging: false,
  },
  {
    id: "14",
    name: "SonicWave Pro",
    brand: "SoundWave",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 5678,
    price: 1999,
    originalPrice: 3499,
    discount: 43,
    highlights: ["32H Battery", "Bass Boost", "IPX4"],
    batteryLife: 32,
    hasANC: false,
    hasWirelessCharging: false,
  },
  {
    id: "15",
    name: "QuietMax ANC",
    brand: "QuietZone",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 4321,
    price: 4299,
    originalPrice: 6499,
    discount: 34,
    highlights: ["48H Battery", "Premium ANC", "Multi-Device"],
    batteryLife: 48,
    hasANC: true,
    hasWirelessCharging: true,
  },
  {
    id: "16",
    name: "ActiveFit X2",
    brand: "ActiveGear",
    image: "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 7890,
    price: 1599,
    originalPrice: 2799,
    discount: 43,
    highlights: ["26H Battery", "Sweat Proof", "Ear Hooks"],
    batteryLife: 26,
    hasANC: false,
    hasWirelessCharging: false,
  },
  {
    id: "17",
    name: "AudioMax Elite",
    brand: "AudioTech",
    image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 2345,
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    highlights: ["55H Battery", "Studio ANC", "Lossless Audio"],
    batteryLife: 55,
    hasANC: true,
    hasWirelessCharging: true,
  },
  {
    id: "18",
    name: "BassKing Pro",
    brand: "SoundWave",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 6234,
    price: 2299,
    originalPrice: 3999,
    discount: 43,
    highlights: ["38H Battery", "Extra Bass", "Touch Control"],
    batteryLife: 38,
    hasANC: true,
    hasWirelessCharging: false,
  },
];

export const brands = ["AudioTech", "SoundWave", "EchoSound", "QuietZone", "ActiveGear", "Apple"];

export const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹3,000", min: 2000, max: 3000 },
  { label: "₹3,000 - ₹5,000", min: 3000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: Infinity },
];

export const ratingFilters = [4, 3, 2, 1];

export const batteryFilters = [
  { label: "50+ Hours", min: 50 },
  { label: "30-50 Hours", min: 30, max: 50 },
  { label: "20-30 Hours", min: 20, max: 30 },
  { label: "Under 20 Hours", min: 0, max: 20 },
];

// Helper function to get random color variants (2-3 per product)
export const getProductColorVariants = (product: Product): ColorVariant[] => {
  // If colorVariants is explicitly set (even empty array), use it
  if (product.colorVariants !== undefined) return product.colorVariants;
  
  // Use product id as seed for consistent random selection
  const seed = parseInt(product.id, 10) || 1;
  const count = (seed % 2) + 2; // Returns 2 or 3
  
  // Shuffle based on seed and pick first 2-3
  const shuffled = [...defaultColorVariants].sort((a, b) => {
    const hashA = (seed * a.name.charCodeAt(0)) % 100;
    const hashB = (seed * b.name.charCodeAt(0)) % 100;
    return hashA - hashB;
  });
  
  return shuffled.slice(0, count);
};

// Helper function to get randomized rating for display (4.0 - 5.0)
export const getDisplayRating = (product: Product): number => {
  // Use product id as seed for consistent random rating
  const seed = parseInt(product.id, 10) || 1;
  const ratings = [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  const index = seed % ratings.length;
  return ratings[index];
};
