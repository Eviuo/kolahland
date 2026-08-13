import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { CompareView } from "@/components/shop/compare-view";
import { getAllCategories } from "@/lib/data/catalog";

export default async function ComparePage() {
  const categories = await getAllCategories();

  return (
    <>
      <Breadcrumbs items={[{ name: "مقایسه محصولات", path: "/compare" }]} />

      <div className="container py-12">
        <CompareView categories={categories} />
      </div>
    </>
  );
}
