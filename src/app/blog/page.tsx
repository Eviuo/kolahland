import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { toPersianDigits } from "@/lib/utils";

// Public, non-personalized content — no cookies/session read here. A short
// ISR window means every visitor doesn't re-query Postgres from scratch.
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "بلاگ کلاه‌لند",
  description: "راهنمای خرید، استایل و نگهداری کلاه — بلاگ کلاه‌لند.",
  path: "/blog",
});

export default async function BlogListPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <Breadcrumbs items={[{ name: "بلاگ", path: "/blog" }]} />

      <div className="container py-12">
        <header className="mb-10 max-w-xl">
          <h1 className="text-display-2 font-extrabold text-paper">بلاگ کلاه‌لند</h1>
          <p className="mt-3 text-sm leading-8 text-paper/70">راهنمای خرید، ایده‌های استایل و نکات نگهداری از کلاه.</p>
        </header>

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-navy-line p-10 text-center text-sm text-paper/70">
            هنوز بلاگی منتشر نشده — به‌زودی برمی‌گردیم.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-cream transition-shadow hover:shadow-card"
              >
                <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] bg-paper">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority={index < 3}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  {post.tag && (
                    <span className="w-fit rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-stone">
                      {post.tag}
                    </span>
                  )}
                  <Link href={`/blog/${post.slug}`} className="text-base font-bold text-ink hover:underline">
                    {post.title}
                  </Link>
                  <p className="line-clamp-2 text-sm leading-6 text-stone">{post.excerpt}</p>
                  <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-stone">
                    <span>{new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(post.publishedAt))}</span>
                    <span>·</span>
                    <span>{toPersianDigits(post.readingMinutes)} دقیقه مطالعه</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
