"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutGrid, User, Package, MapPin, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "نمای کلی", icon: LayoutGrid, exact: true },
  { href: "/account/profile", label: "پروفایل", icon: User },
  { href: "/account/orders", label: "سفارش‌های من", icon: Package },
  { href: "/account/addresses", label: "آدرس‌های من", icon: MapPin },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-60">
      <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="ناوبری حساب کاربری">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brass text-paper" : "text-paper/70 hover:bg-paper/10"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-paper/10 lg:mt-4"
        >
          <LogOut className="h-4.5 w-4.5" strokeWidth={1.7} />
          خروج از حساب
        </button>
      </nav>
    </aside>
  );
}
