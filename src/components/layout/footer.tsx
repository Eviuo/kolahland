import Link from "next/link";
import { getAllCategories } from "@/lib/data/catalog";
import { siteConfig } from "@/lib/seo";

const POLICY_LINKS = [
  { href: "/blog", label: "بلاگ" },
  { href: "/shipping-policy", label: "شرایط ارسال" },
  { href: "/return-policy", label: "شرایط بازگشت کالا" },
  { href: "/privacy-policy", label: "حریم خصوصی" },
  { href: "/terms", label: "قوانین و مقررات" },
  { href: "/faq", label: "سوالات متداول" },
];

export async function Footer() {
  const categories = await getAllCategories();

  return (
    <footer className="border-t border-line bg-ink text-paper/80">
      <div className="container grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
        <div>
          <p className="text-xl font-extrabold text-paper">کلاه‌لند</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-paper/60">
            مرجع خرید آنلاین کلاه در ایران. طراحی مینیمال، کیفیت پرمیوم و ارسال به سراسر کشور.
          </p>
        </div>

        <nav aria-label="دسته‌بندی محصولات">
          <Link href="/categories" className="text-sm font-semibold text-paper hover:underline">
            دسته‌بندی‌ها
          </Link>
          <ul className="mt-4 space-y-2.5 text-sm text-paper/60">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="transition-colors hover:text-paper">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="قوانین و راهنما">
          <p className="text-sm font-semibold text-paper">راهنما</p>
          <ul className="mt-4 space-y-2.5 text-sm text-paper/60">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-paper">تماس با ما</p>
          <ul className="mt-4 space-y-2.5 text-sm text-paper/60">
            <li dir="ltr" className="text-right">
              {siteConfig.contact.phone}
            </li>
            <li dir="ltr" className="text-right">
              {siteConfig.contact.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-paper/50 sm:flex-row">
          <p>© {new Date().getFullYear()} کلاه‌لند — تمامی حقوق محفوظ است.</p>
          <p>نماد اعتماد الکترونیکی · درگاه پرداخت امن</p>
        </div>
      </div>
    </footer>
  );
}
