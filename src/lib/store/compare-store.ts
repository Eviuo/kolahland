"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MAX_COMPARE = 4;

interface CompareState {
  productIds: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      productIds: [],

      toggle: (productId) =>
        set((state) => {
          const exists = state.productIds.includes(productId);
          if (exists) return { productIds: state.productIds.filter((id) => id !== productId) };
          if (state.productIds.length >= MAX_COMPARE) return state;
          return { productIds: [...state.productIds, productId] };
        }),

      remove: (productId) => set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) })),

      clear: () => set({ productIds: [] }),
    }),
    { name: "kolahland-compare" }
  )
);
