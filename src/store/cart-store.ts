"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.variantId === newItem.variantId
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.variantId === newItem.variantId
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + newItem.quantity,
                        item.maxQuantity
                      ),
                    }
                  : item
              ),
              isOpen: true,
            };
          }

          return {
            items: [...state.items, newItem],
            isOpen: true,
          };
        });
      },

      removeItem: (variantId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.variantId !== variantId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.variantId === variantId
                ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
                : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      itemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "citrafoam-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
