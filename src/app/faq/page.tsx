import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { buildMetadata, faqJsonLd, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "سوالات متداول",
  description: "پاسخ سوالات پرتکرار درباره سفارش، ارسال، بازگشت کالا، سایزبندی و پرداخت در کلاه‌لند.",
  path: "/faq",
});

const GROUPS: { title: string; items: { question: string; answer: string }[] }[] = [
  {
    title: "سفارش و پرداخت",
    items: [
      {
        question: "چگونه می‌توانم سفارش ثبت کنم؟",
        answer:
          "کافی است محصول موردنظر را انتخاب، رنگ و سایز را مشخص و به سبد خرید اضافه کنید. سپس در صفحه تسویه‌حساب آدرس و روش پرداخت را تکمیل کنید.",
      },
      {
        question: "چه روش‌های پرداختی پشتیبانی می‌شود؟",
        answer: "پرداخت از طریق درگاه بانکی معتبر (شبکه شتاب) با تمامی کارت‌های بانکی عضو شتاب امکان‌پذیر است.",
      },
      {
        question: "آیا امکان پرداخت در محل وجود دارد؟",
        answer: "در حال حاضر پرداخت فقط از طریق درگاه آنلاین انجام می‌شود.",
      },
    ],
  },
  {
    title: "ارسال",
    items: [
      {
        question: "ارسال سفارش چقدر طول می‌کشد؟",
        answer: "سفارش‌ها معمولاً ظرف ۱ روز کاری آماده و بسته به مقصد، طی ۱ تا ۵ روز کاری با پست پیشتاز تحویل داده می‌شوند.",
      },
      {
        question: "هزینه ارسال چقدر است؟",
        answer: "هزینه ارسال بر اساس مقصد محاسبه و پیش از پرداخت نهایی نمایش داده می‌شود. جزئیات کامل در صفحه شرایط ارسال موجود است.",
      },
    ],
  },
  {
    title: "بازگشت و تعویض کالا",
    items: [
      {
        question: "آیا امکان بازگشت کالا وجود دارد؟",
        answer: "بله، تا ۷ روز پس از دریافت کالا در صورت عدم استفاده و حفظ برچسب‌ها امکان بازگشت وجود دارد.",
      },
      {
        question: "چطور سایز مناسب خودم را انتخاب کنم؟",
        answer: "اکثر مدل‌های کلاه‌لند دارای بند تنظیم و سایز آزاد هستند. برای مدل‌های سایزبندی‌شده، جدول سایز در صفحه هر محصول درج شده است.",
      },
    ],
  },
  {
    title: "محصولات",
    items: [
      {
        question: "آیا محصولات کلاه‌لند اورجینال هستند؟",
        answer: "بله، تمامی محصولات مستقیم از تولیدکننده تهیه و پیش از عرضه از نظر کیفیت بررسی می‌شوند.",
      },
      {
        question: "چطور از کلاه بافتنی نگهداری کنم؟",
        answer: "توصیه می‌شود با دست و آب سرد شسته شود و از خشک‌کن اجتناب کنید تا فرم کلاه حفظ شود.",
      },
    ],
  },
];

export default function FaqPage() {
  const allItems = GROUPS.flatMap((g) => g.items);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(allItems))} />
      <Breadcrumbs items={[{ name: "سوالات متداول", path: "/faq" }]} />

      <div className="container-narrow py-12">
        <header className="mb-10 text-center">
          <h1 className="text-display-2 font-extrabold text-paper">سوالات متداول</h1>
          <p className="mt-3 text-sm text-paper/70">پاسخ پرتکرارترین سوالات مشتریان کلاه‌لند</p>
        </header>

        <div className="space-y-10">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h2 className="mb-4 text-sm font-bold text-paper">{group.title}</h2>
              <FaqAccordion items={group.items} />
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
