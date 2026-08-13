import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "کلاه‌لند",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F6F2",
    theme_color: "#0E0F0D",
    lang: "fa",
    dir: "rtl",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
