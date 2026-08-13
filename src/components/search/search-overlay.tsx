"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { quickSearchProducts } from "@/lib/actions/catalog";
import { iconByKey, type HatIconKey } from "@/components/icons/hat-icons";
import { formatToman } from "@/lib/utils";
import type { Product } from "@/lib/data/products";

const DEBOUNCE_MS = 300;

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autofocus on open, and always start from a blank query — a leftover
  // search from last time isn't useful and just delays typing a new one.
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const items = await quickSearchProducts(trimmed);
        setResults(items);
        setActiveIndex(-1);
      });
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function goToFullResults(q: string) {
    onClose();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length > 0) setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = activeIndex >= 0 ? results[activeIndex] : undefined;
      if (picked) {
        onClose();
        router.push(`/product/${picked.slug}`);
      } else {
        goToFullResults(query.trim());
      }
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        aria-label="بستن جستجو"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      <div className="relative mx-auto mt-24 w-[92vw] max-w-xl rounded-2xl border border-line bg-cream shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-stone" strokeWidth={1.8} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="جستجوی کلاه بیسبالی، باکت، بافت..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-stone focus-visible:outline-none"
          />
          {isPending && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-stone" />}
          <button
            onClick={onClose}
            aria-label="بستن"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone hover:bg-ink/5 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <p className="px-3 py-8 text-center text-xs text-stone">برای دیدن نتایج، عبارتی را تایپ کنید.</p>
          ) : results.length === 0 && !isPending ? (
            <p className="px-3 py-8 text-center text-xs text-stone">نتیجه‌ای برای «{query}» پیدا نشد.</p>
          ) : (
            <ul>
              {results.map((product, index) => {
                const Icon = iconByKey[product.icon as HatIconKey];
                const image = product.images[0];
                const active = index === activeIndex;
                return (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                        active ? "bg-ink/5" : "hover:bg-ink/5"
                      }`}
                    >
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-paper">
                        {image ? (
                          <Image src={image.url} alt={image.altText || product.name} fill sizes="48px" className="object-cover" />
                        ) : (
                          <Icon className="h-full w-full p-2 text-ink/85" aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                        <p className="text-xs text-stone">{formatToman(product.price)}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {query.trim() !== "" && (
          <button
            onClick={() => goToFullResults(query.trim())}
            className="block w-full border-t border-line px-5 py-3 text-center text-xs font-medium text-ink hover:bg-ink/5"
          >
            دیدن همه نتایج برای «{query}»
          </button>
        )}
      </div>
    </div>
  );
}
