"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute right-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="جستجوی کلاه بیسبالی، باکت، بافت..."
        className="w-full rounded-full border border-line bg-cream py-3.5 pe-12 ps-5 text-sm text-ink focus-visible:outline-none focus-visible:border-ink"
        autoFocus
      />
    </form>
  );
}
