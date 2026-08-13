import { Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "ارسال به سراسر ایران", desc: "ارسال ۲۴ تا ۷۲ ساعته" },
  { icon: ShieldCheck, title: "ضمانت اصالت کالا", desc: "۱۰۰٪ جنس اورجینال" },
  { icon: RotateCcw, title: "۷ روز ضمانت بازگشت", desc: "بدون پرسش اضافه" },
  { icon: CreditCard, title: "پرداخت امن", desc: "درگاه بانکی معتبر" },
];

export function ValueProps() {
  return (
    <section aria-label="مزایای خرید از کلاه‌لند" className="border-b border-line bg-cream">
      <div className="container grid grid-cols-2 gap-6 py-10 lg:grid-cols-4 lg:gap-8">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-stone">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
