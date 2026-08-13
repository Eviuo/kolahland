import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { getAllProductSlugs, getAllCategories } from "@/lib/data/catalog";
import { getPublishedBlogPosts } from "@/lib/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/categories`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteConfig.url}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/shipping-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/return-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categories = await getAllCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteConfig.url}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const products = await getAllProductSlugs();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/product/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const posts = await getPublishedBlogPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
