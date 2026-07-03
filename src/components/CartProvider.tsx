"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/products";

export type CartLine = {
  product: Product;
  quantity: number;
};

type StoredCart = Record<string, number>;

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  hasRestrictedItem: boolean;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "paanx-cart-v01";

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedCart, setStoredCart] = useState<StoredCart>(() => {
    if (typeof window === "undefined") return {};
    const rawCart = window.localStorage.getItem(storageKey);
    if (!rawCart) return {};

    try {
      return JSON.parse(rawCart) as StoredCart;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(storedCart));
  }, [storedCart]);

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(storedCart)
        .map(([productId, quantity]) => {
          const product = products.find((item) => item.id === productId);
          return product ? { product, quantity } : null;
        })
        .filter((line): line is CartLine => Boolean(line)),
    [storedCart],
  );

  const addItem = useCallback((product: Product) => {
    setStoredCart((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setStoredCart((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setStoredCart((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce(
      (total, line) => total + line.product.price * line.quantity,
      0,
    );

    return {
      lines,
      itemCount,
      subtotal,
      hasRestrictedItem: lines.some((line) => line.product.isRestricted),
      addItem,
      updateQuantity,
      removeItem,
      clearCart: () => setStoredCart({}),
    };
  }, [addItem, lines, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
