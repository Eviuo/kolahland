import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const full: BreadcrumbItem[] = [{ name: "خانه", path: "/" }, ...items];

  return (
    <nav aria-label="مسیر صفحه" className="border-b border-navy-line bg-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(full))} />
      <ol className="container flex flex-wrap items-center gap-1.5 py-3.5 text-xs text-paper/60">
        {full.map((item, i) => {
          const isLast = i === full.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronLeft className="h-3.5 w-3.5 rotate-180 opacity-60" aria-hidden />}
              {isLast ? (
                <span className="font-medium text-paper" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-brass-light hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
