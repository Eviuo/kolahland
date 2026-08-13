import type { Metadata } from "next";

export const siteConfig = {
  name: "کلاه‌لند",
  domain: "kolahland.ir",
  url: "https://kolahland.ir",
  legalName: "کلاه‌لند",
  title: "کلاه‌لند | فروشگاه آنلاین کلاه ایران",
  description:
    "کلاه‌لند، مرجع خرید آنلاین کلاه در ایران. کلاه بیسبال، کلاه باکت، کلاه بافت، کلاه زمستانی و کلاه‌های مد روز با کیفیت پرمیوم و ارسال به سراسر کشور.",
  locale: "fa_IR",
  themeColor: "#0E0F0D",
  contact: {
    phone: "+989228621632",
    email: "kamrad776@gmail.com",
  },
} as const;

interface BuildMetadataArgs {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "product";
}

/** Central metadata factory — every page should build its Metadata through this
 * so title templates, canonical URLs, and OG/Twitter tags stay consistent. */
export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/og/default.jpg",
  noIndex = false,
  type = "website",
}: BuildMetadataArgs): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: type === "product" ? "website" : type,
      images: [{ url: `${siteConfig.url}${image}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${siteConfig.url}${image}`],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      areaServed: "IR",
      availableLanguage: ["fa"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

interface ProductJsonLdArgs {
  name: string;
  description: string;
  image: string[];
  sku: string;
  slug: string;
  price: number;
  currency?: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  brand?: string;
}

export function productJsonLd({
  name,
  description,
  image,
  sku,
  slug,
  price,
  currency = "IRR",
  availability,
  brand = siteConfig.name,
}: ProductJsonLdArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku,
    image,
    brand: { "@type": "Brand", name: brand },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${slug}`,
      priceCurrency: currency,
      price,
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  image: string;
  slug: string;
  authorName: string;
  publishedAt: string;
  modifiedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    image: [args.image],
    author: { "@type": "Person", name: args.authorName },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.png` },
    },
    datePublished: args.publishedAt,
    dateModified: args.modifiedAt,
    mainEntityOfPage: `${siteConfig.url}/blog/${args.slug}`,
  };
}

/** Renders a JSON-LD object as a safe inline <script> tag payload. */
export function jsonLdScript(data: unknown) {
  // `JSON.stringify` does not escape "<", so a value containing the literal
  // string "</script>" would close this script tag early and let whatever
  // follows run as markup/script. Escaping it as the equivalent unicode
  // sequence keeps the JSON value identical after parsing, just safe to
  // embed inline.
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
