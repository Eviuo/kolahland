"use client";

import { GitCompareArrows } from "lucide-react";
import { toast } from "sonner";
import { useCompareStore, MAX_COMPARE } from "@/lib/store/compare-store";
import { cn } from "@/lib/utils";

interface CompareToggleButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

export function CompareToggleButton({ productId, productName, className }: CompareToggleButtonProps) {
  const productIds = useCompareStore((s) => s.productIds);
  const toggle = useCompareStore((s) => s.toggle);
  const active = productIds.includes(productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!active && productIds.length >= MAX_COMPARE) {
      toast.error(`حداکثر ${MAX_COMPARE} محصول را می‌توانید مقایسه کنید`);
      return;
    }

    toggle(productId);
    toast(active ? "از مقایسه حذف شد" : "به مقایسه اضافه شد", { description: productName });
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? `حذف ${productName} از مقایسه` : `افزودن ${productName} به مقایسه`}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 shadow-sm transition-colors",
        active ? "text-brass" : "text-ink hover:text-brass",
        className
      )}
    >
      <GitCompareArrows className="h-4 w-4" strokeWidth={1.7} />
    </button>
  );
}
