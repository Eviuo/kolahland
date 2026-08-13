import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CapIcon } from "@/components/icons/hat-icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-navy-line bg-navy">
      <div className="container grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="order-2 lg:order-1">
          <h1 className="text-balance text-display-1 font-extrabold text-paper">
            کلاهی که <span className="brim-underline text-brass">سبک شما</span> را کامل می‌کند
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-paper/70">
            از خیابان‌های شهر تا سفرهای تابستانی، مجموعه کلاه‌لند راحتی را با شیکی بی‌زحمت ترکیب می‌کند. طراحی
            مینیمال، جنس اصل، دوخت دقیق.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" variant="accent">
              <Link href="/shop">مشاهده محصولات</Link>
            </Button>
            <Button asChild size="lg" variant="outline-on-dark">
              <Link href="/about">داستان برند</Link>
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center rounded-[2.5rem] border border-line bg-cream">
            <CapIcon className="h-2/3 w-2/3 text-ink" aria-hidden />
            <div className="absolute -top-4 start-6 rounded-full border border-line bg-paper px-4 py-2 text-xs font-medium text-charcoal shadow-card">
              طراحی مینیمال
            </div>
            <div className="absolute -bottom-4 end-6 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper shadow-lift">
              ارسال به سراسر ایران
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
