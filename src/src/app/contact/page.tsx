import type { Metadata } from "next";
import { Phone, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { ContactForm } from "@/components/contact/contact-form";
import { buildMetadata, siteConfig, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تماس با ما",
  description: "راه‌های ارتباط با تیم پشتیبانی کلاه‌لند — تلفن، ایمیل و فرم تماس آنلاین.",
  path: "/contact",
});

const CONTACT_ITEMS = [
  { icon: Phone, label: "تلفن پشتیبانی", value: siteConfig.contact.phone, dir: "ltr" as const },
  { icon: Mail, label: "ایمیل", value: siteConfig.contact.email, dir: "ltr" as const },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "تماس با کلاه‌لند",
          url: `${siteConfig.url}/contact`,
        })}
      />
      <Breadcrumbs items={[{ name: "تماس با ما", path: "/contact" }]} />

      <div className="container py-12">
        <header className="mb-10 max-w-xl">
          <h1 className="text-display-2 font-extrabold text-paper">تماس با ما</h1>
          <p className="mt-3 text-sm leading-8 text-paper/70">
            سوالی درباره محصولات، سفارش یا ارسال دارید؟ فرم زیر را پر کنید یا مستقیم از راه‌های ارتباطی زیر با ما در
            تماس باشید.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value, dir }) => (
              <div key={label} className="flex items-start gap-3 rounded-2xl border border-line bg-cream p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-xs text-stone">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink" dir={dir}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-cream p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
