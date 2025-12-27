import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ColorVariant } from '@/data/products';

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ColorVariant; // Store the selected color variant
  selectedImage?: string; // Store the selected color's main image
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: ColorVariant) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalOriginalPrice: () => number;
  getTotalDiscount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: ColorVariant) => {
    setItems((prev) => {
      // Create a unique key based on product id AND color name
      const colorKey = selectedColor?.name || 'default';
      const existingItem = prev.find(
        (item) => item.product.id === product.id && (item.selectedColor?.name || 'default') === colorKey
      );
      
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id && (item.selectedColor?.name || 'default') === colorKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { 
        product, 
        quantity, 
        selectedColor,
        selectedImage: selectedColor?.images?.[0] || product.image
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getTotalOriginalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.originalPrice * item.quantity,
      0
    );
  };

  const getTotalDiscount = () => {
    return getTotalOriginalPrice() - getTotalPrice();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getTotalOriginalPrice,
        getTotalDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
