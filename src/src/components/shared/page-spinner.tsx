import { Loader2 } from "lucide-react";

/**
 * Minimal, generic loading fallback shown by route `loading.tsx` files while
 * a Server Component page is fetching data. Deliberately unobtrusive (no
 * per-page skeleton) so it doesn't introduce new UI/design decisions —
 * just prevents a blank screen during navigation.
 */
export function PageSpinner() {
  return (
    <div className="container flex min-h-[50vh] items-center justify-center py-24">
      <Loader2 className="h-6 w-6 animate-spin text-stone" aria-label="در حال بارگذاری" />
    </div>
  );
}
