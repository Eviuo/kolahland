import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma 7 removed the built-in Rust query engine — Prisma Client now talks
 * to Postgres through a driver adapter (the `pg` package) instead of managing
 * its own connection internally. This is the only supported way to construct
 * PrismaClient now; `new PrismaClient()` with no arguments is no longer valid.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
