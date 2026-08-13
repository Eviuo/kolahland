import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  tag: string | null;
  readingMinutes: number;
  publishedAt: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
  authorName: string;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  readingMinutes: number;
  publishedAt: Date | null;
  createdAt: Date;
  tags: { tag: { name: string } }[];
}

function mapSummary(p: BlogPostRow): BlogPostSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    tag: p.tags[0]?.tag.name ?? null,
    readingMinutes: p.readingMinutes,
    publishedAt: (p.publishedAt ?? p.createdAt).toISOString(),
  };
}

export async function getPublishedBlogPosts(): Promise<BlogPostSummary[]> {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    include: { tags: { select: { tag: { select: { name: true } } } } },
    orderBy: { publishedAt: "desc" },
  });
  return posts.map(mapSummary);
}

// Wrapped in `cache()` because `app/blog/[slug]/page.tsx` calls this once
// from `generateMetadata` and again from the page component — without this,
// every single blog-post view ran the identical query twice.
export const getBlogPostBySlug = cache(async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostDetail | null> {
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { tags: { select: { tag: { select: { name: true } } } }, author: { select: { name: true } } },
  });
  if (!post) return null;

  return {
    ...mapSummary(post),
    content: post.content,
    authorName: post.author.name ?? "تیم کلاه‌لند",
    updatedAt: post.updatedAt.toISOString(),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  };
});
