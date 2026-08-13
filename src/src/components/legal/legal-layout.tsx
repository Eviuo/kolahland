import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";

interface LegalLayoutProps {
  title: string;
  breadcrumbLabel: string;
  breadcrumbPath: string;
  effectiveDate: string;
  intro: string;
  children: ReactNode;
}

export function LegalLayout({ title, breadcrumbLabel, breadcrumbPath, effectiveDate, intro, children }: LegalLayoutProps) {
  return (
    <>
      <Breadcrumbs items={[{ name: breadcrumbLabel, path: breadcrumbPath }]} />
      <div className="container-narrow py-12">
        <div className="rounded-3xl bg-cream p-6 sm:p-10">
          <header className="mb-10 border-b border-line pb-8">
            <h1 className="text-display-2 font-extrabold text-ink">{title}</h1>
            <p className="mt-3 text-xs text-stone">آخرین به‌روزرسانی: {effectiveDate}</p>
            <p className="mt-4 text-sm leading-8 text-stone">{intro}</p>
          </header>

          <div className="space-y-10 [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-ink [&_h2]:mb-3 [&_p]:text-sm [&_p]:leading-8 [&_p]:text-charcoal [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:text-sm [&_ul]:leading-7 [&_ul]:text-charcoal [&_li]:list-disc [&_li]:mr-5">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
