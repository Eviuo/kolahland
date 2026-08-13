import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { buildMetadata, articleJsonLd, jsonLdScript, siteConfig } from "@/lib/seo";
import { toPersianDigits } from "@/lib/utils";

// Public, non-personalized content with generateStaticParams below — the
// previous force-dynamic silently defeated that pre-rendering entirely,
// re-running the DB query on every single request regardless.
export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content.split(/\n{2,}/).filter((p) => p.trim().length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleJsonLd({
            title: post.title,
            description: post.excerpt,
            image: `${siteConfig.url}${post.coverImage}`,
            slug: post.slug,
            authorName: post.authorName,
            publishedAt: post.publishedAt,
            modifiedAt: post.updatedAt,
          })
        )}
      />

      <Breadcrumbs items={[{ name: "بلاگ", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />

      <article className="container max-w-3xl py-12">
        <div className="rounded-3xl bg-cream p-6 sm:p-10">
          <header className="mb-8">
            {post.tag && (
              <span className="mb-3 inline-block w-fit rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-stone">
                {post.tag}
              </span>
            )}
            <h1 className="text-2xl font-extrabold text-ink lg:text-3xl">{post.title}</h1>
            <div className="mt-4 flex items-center gap-3 text-xs text-stone">
              <span>{post.authorName}</span>
              <span>·</span>
              <span>{new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(post.publishedAt))}</span>
              <span>·</span>
              <span>{toPersianDigits(post.readingMinutes)} دقیقه مطالعه</span>
            </div>
          </header>

          <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl bg-paper">
            <Image src={post.coverImage} alt={post.title} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>

          <div className="space-y-5 text-sm leading-8 text-charcoal">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
