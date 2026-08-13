/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required by OpenNext's Cloudflare build for Prisma: both the classic
  // `@prisma/client` package and its generated `.prisma/client` output must
  // stay external (unbundled) so OpenNext can patch them for the Workers
  // (workerd) runtime. `pg` stays external too, for the same reason as before.
  serverExternalPackages: ["@prisma/client", ".prisma/client", "pg"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "kolahland.ir" },
      { protocol: "https", hostname: "cdn.kolahland.ir" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
