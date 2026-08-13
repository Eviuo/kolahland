"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, type SortValue } from "@/lib/data/shop-query-options";

export function SortSelect({ current }: { current: SortValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-xs text-paper/70">
        مرتب‌سازی:
      </label>
      <select
        id="sort"
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-line bg-cream px-3 py-2 text-xs font-medium text-ink focus-visible:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
