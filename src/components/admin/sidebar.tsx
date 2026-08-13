"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, FolderTree, Tag, ShoppingCart, Users, Ticket, Newspaper, Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
  { href: "/admin/brands", label: "برندها", icon: Tag },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/customers", label: "مشتریان", icon: Users },
  { href: "/admin/coupons", label: "کدهای تخفیف", icon: Ticket },
  { href: "/admin/blog", label: "بلاگ", icon: Newspaper },
  { href: "/admin/seo", label: "سئو", icon: Search },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-l border-line bg-white lg:block">
      <div className="flex h-20 items-center px-6">
        <Link href="/admin/products" className="text-lg font-extrabold text-ink">
          کلاه‌لند <span className="text-xs font-medium text-stone">/ ادمین</span>
        </Link>
      </div>

      <nav className="space-y-1 px-3" aria-label="ناوبری پنل مدیریت">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-ink text-paper" : "text-charcoal hover:bg-ink/5"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-line px-3 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={1.7} />
          بازگشت به فروشگاه
        </Link>
      </div>
    </aside>
  );
}
