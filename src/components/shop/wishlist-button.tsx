"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  initialWishlisted?: boolean;
  className?: string;
}

export function WishlistButton({ productId, productName, initialWishlisted = false, className }: WishlistButtonProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleWishlist(productId);

      if (result.requiresLogin) {
        toast("برای افزودن به علاقه‌مندی‌ها وارد شوید");
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (result.success) {
        setWishlisted(result.wishlisted ?? !wishlisted);
        toast.success(result.message, { description: productName });
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label={wishlisted ? `حذف ${productName} از علاقه‌مندی‌ها` : `افزودن ${productName} به علاقه‌مندی‌ها`}
      aria-pressed={wishlisted}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 shadow-sm transition-colors disabled:opacity-60",
        wishlisted ? "text-danger" : "text-ink hover:text-danger",
        className
      )}
    >
      <Heart className="h-4 w-4" strokeWidth={1.7} fill={wishlisted ? "currentColor" : "none"} />
    </button>
  );
}
