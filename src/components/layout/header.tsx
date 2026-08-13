"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Heart, ShoppingBag, GitCompareArrows } from "lucide-react";
import { cn, toPersianDigits } from "@/lib/utils";
import { AccountMenu } from "@/components/layout/account-menu";
import { SearchOverlay } from "@/components/search/search-overlay";
import { useCartStore, cartItemCount } from "@/lib/store/cart-store";
import { useCompareStore } from "@/lib/store/compare-store";
import { useMounted } from "@/hooks/use-mounted";

const NAV_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/shop", label: "محصولات" },
  { href: "/blog", label: "بلاگ" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Zustand's persist middleware reads localStorage only after mount, so the
  // server-rendered count is always 0 — read the real count post-mount to
  // avoid a hydration mismatch.
  const mounted = useMounted();

  const cartCount = useCartStore((s) => cartItemCount(s.lines));
  const compareCount = useCompareStore((s) => s.productIds.length);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-line bg-navy/90 backdrop-blur supports-[backdrop-filter]:bg-navy/75">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-paper">
          کلاه‌لند
          <span className="sr-only">Kolahland.ir — فروشگاه آنلاین کلاه</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-line bg-cream/60 p-1 lg:flex" aria-label="ناوبری اصلی">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-ink text-paper" : "text-charcoal hover:bg-ink/5"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="جستجو در محصولات"
            className="flex h-10 w-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10"
          >
            <Search className="h-5 w-5" strokeWidth={1.6} />
          </button>

          <Link
            href="/compare"
            aria-label={`مقایسه محصولات، ${mounted ? compareCount : 0} کالا`}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10 sm:flex"
          >
            <GitCompareArrows className="h-5 w-5" strokeWidth={1.6} />
            {mounted && compareCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brass text-[9px] font-bold text-paper">
                {toPersianDigits(compareCount)}
              </span>
            )}
          </Link>

          <Link
            href="/wishlist"
            aria-label="علاقه‌مندی‌ها"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10 sm:flex"
          >
            <Heart className="h-5 w-5" strokeWidth={1.6} />
          </Link>

          <AccountMenu />

          <Link
            href="/cart"
            aria-label={`سبد خرید، ${mounted ? cartCount : 0} کالا`}
            className="relative flex h-10 items-center gap-1.5 rounded-full bg-brass px-4 text-paper transition-colors hover:bg-brass/90"
          >
            <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.6} />
            <span className="text-xs font-medium">سبد ({toPersianDigits(mounted ? cartCount : 0)})</span>
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-paper hover:bg-paper/10 lg:hidden"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-navy-line bg-navy-light px-5 pb-6 pt-2 lg:hidden" aria-label="ناوبری موبایل">
          <ul className="flex flex-col divide-y divide-navy-line">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-base font-medium text-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/wishlist" onClick={() => setOpen(false)} className="block py-3.5 text-base font-medium text-paper">
                علاقه‌مندی‌ها
              </Link>
            </li>
            <li>
              <Link href="/compare" onClick={() => setOpen(false)} className="block py-3.5 text-base font-medium text-paper">
                مقایسه محصولات {mounted && compareCount > 0 ? `(${toPersianDigits(compareCount)})` : ""}
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
