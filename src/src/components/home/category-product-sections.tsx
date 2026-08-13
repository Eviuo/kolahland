import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllCategories, getProductsByCategorySlug } from "@/lib/data/catalog";
import { ProductCard } from "@/components/shop/product-card";

const PRODUCTS_PER_CATEGORY = 5;

export async function CategoryProductSections() {
  const categories = await getAllCategories();

  const sections = await Promise.all(
    categories.map(async (category) => ({
      category,
      products: await getProductsByCategorySlug(category.slug, PRODUCTS_PER_CATEGORY),
    }))
  );

  // Skip categories with nothing published yet — an empty section with just
  // a heading and no products looks broken, not like a deliberate teaser.
  const nonEmptySections = sections.filter((s) => s.products.length > 0);
  if (nonEmptySections.length === 0) return null;

  return (
    <>
      {nonEmptySections.map(({ category, products }, index) => (
        <section
          key={category.slug}
          className={index % 2 === 0 ? "bg-navy py-16" : "bg-navy-light py-16"}
          aria-labelledby={`category-section-${category.slug}`}
        >
          <div className="container">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass">دسته‌بندی</p>
                <h2 id={`category-section-${category.slug}`} className="mt-2 text-display-2 font-extrabold text-paper">
                  {category.title}
                </h2>
              </div>
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-paper hover:text-brass-light hover:underline"
              >
                نمایش همه
                <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {products.map((product, productIndex) => (
                <ProductCard key={product.id} product={product} priority={index === 0 && productIndex < 4} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
