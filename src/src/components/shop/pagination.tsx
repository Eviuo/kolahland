import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn, toPersianDigits } from "@/lib/utils";
import type { ShopSearchParams } from "@/lib/data/shop-query-options";

interface PaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  searchParams?: ShopSearchParams;
}

function buildHref(basePath: string, page: number, extra?: ShopSearchParams) {
  const params = new URLSearchParams();
  Object.entries(extra ?? {}).forEach(([k, v]) => {
    if (v && k !== "page") params.set(k, String(v));
  });
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ basePath, currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="صفحه‌بندی" className="mt-12 flex items-center justify-center gap-1.5">
      {currentPage > 1 && (
        <Link
          href={buildHref(basePath, currentPage - 1, searchParams)}
          rel="prev"
          aria-label="صفحه قبل"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-line text-paper hover:bg-paper/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, p, searchParams)}
          aria-current={p === currentPage ? "page" : undefined}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
            p === currentPage ? "bg-brass text-paper" : "border border-navy-line text-paper hover:bg-paper/10"
          )}
        >
          {toPersianDigits(p)}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildHref(basePath, currentPage + 1, searchParams)}
          rel="next"
          aria-label="صفحه بعد"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-line text-paper hover:bg-paper/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
