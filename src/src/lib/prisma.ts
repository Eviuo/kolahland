import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Cloudflare Workers (via OpenNext) forbids reusing a pooled DB connection
 * across requests — each isolate/request needs its own client. `cache()`
 * still de-dupes repeated calls *within* a single request/render pass (so
 * Server Components don't each open a fresh connection), but never leaks a
 * client across requests the way a plain module-level singleton would.
 * `maxUses: 1` on the adapter mirrors OpenNext's own Prisma+Postgres example
 * — the underlying `pg` connection is used once, then discarded, instead of
 * being pooled for reuse.
 */
const getClient = cache(() => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, maxUses: 1 });
  return new PrismaClient({ adapter });
});

/**
 * A thin proxy so every existing call site (`prisma.product.findMany(...)`,
 * `prisma.$transaction(...)`, etc.) keeps working unchanged, while under the
 * hood each property access resolves to the current request's client via
 * `getClient()` above. Methods are explicitly bound to the real client —
 * without that, calling a method retrieved through a Proxy runs with `this`
 * pointing at the proxy instead of the real PrismaClient instance, which
 * breaks Prisma's internals.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = client[prop as keyof PrismaClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
