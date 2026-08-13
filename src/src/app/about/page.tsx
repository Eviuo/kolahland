import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Scissors, Truck, HeartHandshake } from "lucide-react";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CapIcon, BucketIcon, BeanieIcon, WinterIcon } from "@/components/icons/hat-icons";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "درباره ما",
  description: "داستان کلاه‌لند، ارزش‌های برند و فرآیند کنترل کیفیتی که پشت هر کلاهی که می‌فروشیم قرار دارد.",
  path: "/about",
});

const VALUES = [
  {
    icon: ShieldCheck,
    title: "اصالت کالا",
    desc: "هر مدل پیش از عرضه از نظر جنس پارچه و دوخت بررسی می‌شود؛ چیزی که در عکس می‌بینید همان چیزی است که دریافت می‌کنید.",
  },
  {
    icon: Scissors,
    title: "کیفیت دوخت",
    desc: "از پارچه‌های سنگین‌شور و نخ‌های مقاوم استفاده می‌کنیم تا کلاه‌ها بعد از ماه‌ها استفاده هم فرم خود را حفظ کنند.",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    desc: "سفارش‌ها ظرف ۱ روز کاری آماده و به سراسر ایران ارسال می‌شوند.",
  },
  {
    icon: HeartHandshake,
    title: "پشتیبانی واقعی",
    desc: "تیم پشتیبانی کلاه‌لند پاسخگوی سوالات شما پیش و پس از خرید است، بدون پاسخ‌های ماشینی.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "درباره ما", path: "/about" }]} />

      <section className="border-b border-navy-line bg-navy py-16">
        <div className="container-narrow text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass">درباره کلاه‌لند</p>
          <h1 className="mt-3 text-display-2 font-extrabold text-paper text-balance">
            کلاهی برای هر روزتان، ساخته‌شده تا دوام بیاورد
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-paper/70">
            کلاه‌لند با یک هدف ساده شروع شد: عرضه کلاه‌هایی با کیفیت واقعی و قیمتی منصفانه به بازار
            ایران، بدون واسطه‌های غیرضروری و بدون افت کیفیت.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-cream py-16">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-line bg-paper p-8">
              <CapIcon className="h-full w-full text-ink/80" aria-hidden />
            </div>
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-line bg-paper p-8">
              <BucketIcon className="h-full w-full text-ink/80" aria-hidden />
            </div>
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-line bg-paper p-8">
              <BeanieIcon className="h-full w-full text-ink/80" aria-hidden />
            </div>
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-line bg-paper p-8">
              <WinterIcon className="h-full w-full text-ink/80" aria-hidden />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-ink">داستان ما</h2>
            <p className="mt-4 text-sm leading-8 text-stone">
              همه‌چیز از یک نارضایتی ساده شروع شد: پیدا کردن کلاهی با کیفیت مناسب در بازار ایران سخت بود — یا قیمت
              غیرمنطقی داشت یا جنسش زود خراب می‌شد. تیم کلاه‌لند تصمیم گرفت این مشکل را حل کند: مستقیم از تولیدکننده
              خرید کردن، حذف واسطه‌های اضافه، و صرف زمان روی جزئیاتی که معمولاً دیده نمی‌شوند — از نوع نخ دوخت تا
              تناسب دقیق سایز.
            </p>
            <p className="mt-4 text-sm leading-8 text-stone">
              امروز کلاه‌لند مجموعه‌ای از کلاه بیسبالی، باکت، بافت و زمستانی را برای زنان و مردان عرضه می‌کند و در
              مسیر تبدیل شدن به مرجع اول خرید آنلاین کلاه در ایران است.
            </p>
            <Button asChild className="mt-6">
              <Link href="/shop">مشاهده محصولات</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brass">چرا کلاه‌لند</p>
            <h2 className="mt-2 text-display-2 font-extrabold text-paper">اصولی که هرگز کنارشان نمی‌گذاریم</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-line bg-cream p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-stone">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink py-16 text-center text-paper">
        <div className="container-narrow">
          <h2 className="text-2xl font-extrabold">سوالی درباره محصولات یا سفارش دارید؟</h2>
          <p className="mt-3 text-sm text-paper/65">تیم پشتیبانی کلاه‌لند آماده پاسخگویی است.</p>
          <Button asChild variant="accent" size="lg" className="mt-6">
            <Link href="/contact">تماس با ما</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
