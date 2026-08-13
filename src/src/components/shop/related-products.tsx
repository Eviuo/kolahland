import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/data/products";

export function RelatedProducts({ products, title = "محصولات مرتبط" }: { products: Product[]; title?: string }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-navy-line py-14" aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-6 text-xl font-extrabold text-paper">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
