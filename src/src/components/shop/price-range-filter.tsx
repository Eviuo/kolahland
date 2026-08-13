"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formatToman } from "@/lib/utils";

interface PriceRangeFilterProps {
  /** Absolute bounds — the real lowest/highest price among published products. */
  bounds: { min: number; max: number };
  /** Currently-active filter values from the URL, if any. */
  activeMin?: string;
  activeMax?: string;
}

// Round to a friendly step so dragging doesn't land on odd numbers like 41,730 toman.
const STEP = 10000;

export function PriceRangeFilter({ bounds, activeMin, activeMax }: PriceRangeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const boundsMin = Math.floor(bounds.min / STEP) * STEP;
  const boundsMax = Math.ceil(bounds.max / STEP) * STEP;

  const [range, setRange] = useState<[number, number]>([
    activeMin ? Number(activeMin) : boundsMin,
    activeMax ? Number(activeMax) : boundsMax,
  ]);

  // Keep local slider state in sync if the URL changes from elsewhere (e.g.
  // the person clears filters, or bounds load after first paint).
  useEffect(() => {
    setRange([activeMin ? Number(activeMin) : boundsMin, activeMax ? Number(activeMax) : boundsMax]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMin, activeMax, boundsMin, boundsMax]);

  function commit(next: [number, number]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next[0] > boundsMin) params.set("min", String(next[0]));
    else params.delete("min");
    if (next[1] < boundsMax) params.set("max", String(next[1]));
    else params.delete("max");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  // Bounds not loaded yet or every product has the same price — nothing to filter.
  if (boundsMax <= boundsMin) return null;

  const [low, high] = range;
  const lowPct = ((low - boundsMin) / (boundsMax - boundsMin)) * 100;
  const highPct = ((high - boundsMin) / (boundsMax - boundsMin)) * 100;

  const thumbClass =
    "pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink " +
    "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow " +
    "[&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
    "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-ink " +
    "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-paper/70">
        <span>{formatToman(low)}</span>
        <span>{formatToman(high)}</span>
      </div>

      {/* Sliders read left-to-right by native browser behavior regardless of
          page direction — forcing ltr here keeps "min" reliably on the left
          handle and avoids RTL drag glitches, while the numbers above/below
          stay in normal Persian-digit formatting. */}
      <div dir="ltr" className="relative h-4">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink"
          style={{ right: `${100 - highPct}%`, left: `${lowPct}%` }}
        />
        <input
          type="range"
          min={boundsMin}
          max={boundsMax}
          step={STEP}
          value={low}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), high - STEP);
            setRange([value, high]);
          }}
          onPointerUp={() => commit(range)}
          onKeyUp={() => commit(range)}
          aria-label="حداقل قیمت"
          className={thumbClass}
        />
        <input
          type="range"
          min={boundsMin}
          max={boundsMax}
          step={STEP}
          value={high}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), low + STEP);
            setRange([low, value]);
          }}
          onPointerUp={() => commit(range)}
          onKeyUp={() => commit(range)}
          aria-label="حداکثر قیمت"
          className={thumbClass}
        />
      </div>

      {(activeMin || activeMax) && (
        <button
          onClick={() => commit([boundsMin, boundsMax])}
          className="mt-3 text-xs font-medium text-stone underline-offset-2 hover:text-ink hover:underline"
        >
          پاک‌کردن بازه قیمت
        </button>
      )}
    </div>
  );
}
