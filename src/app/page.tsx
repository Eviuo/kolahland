import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { CategoryGrid } from "@/components/home/category-grid";
import { CategoryProductSections } from "@/components/home/category-product-sections";
import { BrandStory } from "@/components/home/brand-story";
import { buildMetadata, faqJsonLd, jsonLdScript, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

const HOME_FAQ = [
  {
    question: "کلاه‌لند چه نوع کلاه‌هایی می‌فروشد؟",
    answer:
      "کلاه‌لند مجموعه کاملی از کلاه بیسبالی، کلاه باکت، کلاه بافت، کلاه زمستانی و کلاه‌های مد روز را برای آقایان و بانوان عرضه می‌کند.",
  },
  {
    question: "ارسال به شهرستان‌ها چقدر طول می‌کشد؟",
    answer: "سفارش‌ها معمولاً بین ۲۴ تا ۷۲ ساعت کاری پس از ثبت سفارش، از طریق پست پیشتاز ارسال می‌شوند.",
  },
  {
    question: "آیا امکان بازگشت کالا وجود دارد؟",
    answer: "بله، تا ۷ روز پس از دریافت کالا در صورت عدم استفاده و حفظ برچسب‌ها امکان بازگشت وجود دارد.",
  },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(HOME_FAQ))} />
      <Hero />
      <ValueProps />
      <CategoryGrid />
      <CategoryProductSections />
      <BrandStory />
    </>
  );
}
