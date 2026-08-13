"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WinterIcon } from "@/components/icons/hat-icons";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production this should report to an error-tracking service (Sentry, etc.)
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-line bg-paper">
          <WinterIcon className="h-16 w-16 text-ink/70" aria-hidden />
        </div>
        <p className="mt-8 text-sm font-semibold tracking-widest text-brass">خطای ۵۰۰</p>
        <h1 className="mt-2 text-display-2 font-extrabold text-paper">مشکلی پیش آمد</h1>
        <p className="mt-4 text-sm leading-7 text-paper/70">
          متأسفانه در بارگذاری این صفحه خطایی رخ داد. تیم فنی کلاه‌لند از این موضوع مطلع شده است. لطفاً دوباره تلاش
          کنید.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" variant="accent" onClick={() => reset()}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
            تلاش مجدد
          </Button>
          <Button asChild size="lg" variant="outline-on-dark">
            <Link href="/">
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              بازگشت به خانه
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
