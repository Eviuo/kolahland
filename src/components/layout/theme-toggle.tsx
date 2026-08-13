"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Avoid a hydration mismatch — theme is only known client-side after mount.
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-10 w-10 shrink-0 sm:flex" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "فعال‌سازی حالت روشن" : "فعال‌سازی حالت تاریک"}
      className="hidden h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 sm:flex"
    >
      {isDark ? <Sun className="h-5 w-5" strokeWidth={1.6} /> : <Moon className="h-5 w-5" strokeWidth={1.6} />}
    </button>
  );
}
