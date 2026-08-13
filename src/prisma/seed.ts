import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { categories, products } from "../src/lib/data/products";

// Plain relative import (not the "@/" alias) — this script runs standalone
// via tsx, outside Next.js's bundler, so tsconfig path aliases aren't
// guaranteed to resolve here.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Kolahland database...");

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, title: c.title, description: c.description },
    });
  }

  for (const p of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: p.category } });

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id, // keep in sync with the mock catalog's id so wishlist (which
        // references product.id from the UI) keeps resolving correctly
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        categoryId: category.id,
        variants: {
          create: p.variants.flatMap((v) =>
            v.sizes.map((size) => ({
              color: v.color,
              colorHex: v.colorHex,
              size,
              sku: `${p.sku}-${v.color}-${size}`.replace(/\s+/g, ""),
              inventory: v.inventory,
            }))
          ),
        },
      },
    });
  }

  console.log(`✅ Seeded ${categories.length} categories and ${products.length} products.`);

  // Admin account — email and password both come from your own .env file,
  // never hardcoded here, so no real credentials ever sit in source control
  // or get typed into a chat.
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("⚠️  Skipped admin seeding — set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in your .env first.");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN" },
    create: {
      name: "مدیر کلاه‌لند",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`👤 Admin account ready — ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
