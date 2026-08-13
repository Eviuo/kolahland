import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs, getCategoryBySlug } from "@/lib/data/catalog";
import { ProductPurchasePanel } from "@/components/shop/product-purchase";
import { RelatedProducts } from "@/components/shop/related-products";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { buildMetadata, faqJsonLd, jsonLdScript, productJsonLd, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProductSlugs();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title: `${product.name} | خرید آنلاین`,
    description: `${product.shortDescription} — خرید ${product.name} با قیمت ${product.price.toLocaleString(
      "en-US"
    )} تومان، ضمانت اصالت کالا و ارسال سریع از کلاه‌لند.`,
    path: `/product/${product.slug}`,
    type: "product",
    ...(product.images[0] ? { image: product.images[0].url } : {}),
  });
}

// Wishlist status is a nice-to-have, not core to rendering the page — a DB
// hiccup here should never take down the product page for any visitor.
async function getInitialWishlisted(productId: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user) return false;
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
    return Boolean(existing);
  } catch {
    return false;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Independent of each other — all three only depend on `product` above —
  // so run them concurrently instead of one after the other.
  const [related, initialWishlisted, category] = await Promise.all([
    getRelatedProducts(product),
    getInitialWishlisted(product.id),
    getCategoryBySlug(product.category),
  ]);

  const totalInventory = product.variants.reduce((sum, v) => sum + v.inventory, 0);

  const productFaq = [
    {
      question: `اندازه ${product.name} چطور تنظیم می‌شود؟`,
      answer:
        product.variants[0]!.sizes.length > 1
          ? "این مدل در چند سایز موجود است؛ جدول سایز را قبل از خرید بررسی کنید تا بهترین تناسب را انتخاب کنید."
          : "این مدل دارای بند تنظیم است و برای اکثر دورسرهای بزرگسال مناسب است.",
    },
    {
      question: "نحوه نگهداری و شست‌وشو چگونه است؟",
      answer: "توصیه می‌شود با دست و آب سرد شسته شود و از خشک‌کن اجتناب کنید تا فرم کلاه حفظ شود.",
    },
    {
      question: "زمان ارسال این محصول چقدر است؟",
      answer: "سفارش‌ها معمولاً بین ۲۴ تا ۷۲ ساعت کاری از طریق پست پیشتاز ارسال می‌شوند.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          productJsonLd({
            name: product.name,
            description: product.description,
            image:
              product.images.length > 0
                ? product.images.map((img) => `${siteConfig.url}${img.url}`)
                : [`${siteConfig.url}/og/default.jpg`],
            sku: product.sku,
            slug: product.slug,
            price: product.price,
            currency: "IRR",
            availability: totalInventory > 0 ? "InStock" : "OutOfStock",
            ...(product.brand ? { brand: product.brand } : {}),
          })
        )}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(productFaq))} />

      <Breadcrumbs
        items={[
          { name: "فروشگاه", path: "/shop" },
          ...(category ? [{ name: category.title, path: `/category/${category.slug}` }] : []),
          { name: product.name, path: `/product/${product.slug}` },
        ]}
      />

      <div className="container py-10">
        <ProductPurchasePanel product={product} initialWishlisted={initialWishlisted} />

        <section className="border-t border-navy-line py-14" aria-labelledby="description-heading">
          <h2 id="description-heading" className="text-xl font-extrabold text-paper">
            توضیحات محصول
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-[1.8] text-paper/70">{product.description}</p>
        </section>

        <RelatedProducts products={related} title={`سایر مدل‌های ${category?.title ?? "مشابه"}`} />
      </div>
    </>
  );
}
