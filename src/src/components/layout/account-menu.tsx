"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Package, MapPin, LayoutDashboard, ShieldCheck } from "lucide-react";

export function AccountMenu() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return (
      <Link
        href="/login"
        aria-label="ورود به حساب کاربری"
        className="hidden h-10 w-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10 sm:flex"
      >
        <User className="h-5 w-5" strokeWidth={1.6} />
      </Link>
    );
  }

  const user = session.user;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="منوی حساب کاربری"
          className="hidden h-10 w-10 items-center justify-center rounded-full bg-brass text-paper text-xs font-bold transition-colors hover:bg-brass/90 sm:flex"
        >
          {user.name?.charAt(0) ?? "ک"}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-2xl border border-line bg-cream p-1.5 shadow-lift"
        >
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-stone" dir="ltr">
              {user.email}
            </p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />

          <DropdownMenu.Item asChild>
            <Link href="/account" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-charcoal outline-none hover:bg-paper">
              <LayoutDashboard className="h-4 w-4" strokeWidth={1.7} />
              نمای کلی حساب
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/account/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-charcoal outline-none hover:bg-paper">
              <User className="h-4 w-4" strokeWidth={1.7} />
              پروفایل من
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/account/orders" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-charcoal outline-none hover:bg-paper">
              <Package className="h-4 w-4" strokeWidth={1.7} />
              سفارش‌های من
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/account/addresses" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-charcoal outline-none hover:bg-paper">
              <MapPin className="h-4 w-4" strokeWidth={1.7} />
              آدرس‌های من
            </Link>
          </DropdownMenu.Item>

          {user.role === "ADMIN" && (
            <DropdownMenu.Item asChild>
              <Link href="/admin/products" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-charcoal outline-none hover:bg-paper">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.7} />
                پنل مدیریت
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Separator className="my-1 h-px bg-line" />

          <DropdownMenu.Item asChild>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-danger outline-none hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.7} />
              خروج از حساب
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
