"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HatIconKey } from "@/components/icons/hat-icons";

export interface CartLine {
  /** `${slug}::${color}::${size}` — a stable client-side identity that
   * doesn't depend on database-generated ids, which differ between the mock
   * catalog and whatever Prisma assigns once real products are seeded.
   * Checkout re-resolves the real Product/ProductVariant by slug+color+size
   * server-side and never trusts client-held prices or ids. */
  lineId: string;
  slug: string;
  color: string;
  size: string;
  name: string;
  price: number;
  icon: HatIconKey;
  quantity: number;
  maxQuantity: number;
}

interface CartState {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "lineId" | "quantity">, quantity?: number) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
}

function makeLineId(slug: string, color: string, size: string) {
  return `${slug}::${color}::${size}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],

      addLine: (line, quantity = 1) =>
        set((state) => {
          const lineId = makeLineId(line.slug, line.color, line.size);
          const existing = state.lines.find((l) => l.lineId === lineId);

          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, existing.maxQuantity);
            return { lines: state.lines.map((l) => (l.lineId === lineId ? { ...l, quantity: nextQty } : l)) };
          }

          return { lines: [...state.lines, { ...line, lineId, quantity: Math.min(quantity, line.maxQuantity) }] };
        }),

      removeLine: (lineId) => set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),

      setQuantity: (lineId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.lineId === lineId ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxQuantity)) } : l))
            .filter((l) => l.quantity > 0),
        })),

      clear: () => set({ lines: [] }),
    }),
    { name: "kolahland-cart" }
  )
);

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}
