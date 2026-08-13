import { prisma } from "@/lib/prisma";
import { iconForCategory } from "@/lib/data/category-icons";
import type { HatIconKey } from "@/components/icons/hat-icons";

export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  categorySlug: string;
  categoryTitle: string;
  icon: HatIconKey;
  thumbnailUrl: string | null;
  totalInventory: number;
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { slug: true, title: true } },
      variants: { select: { inventory: true } },
      images: { select: { url: true }, orderBy: { position: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    price: p.price,
    categorySlug: p.category.slug,
    categoryTitle: p.category.title,
    icon: iconForCategory(p.category.slug),
    thumbnailUrl: p.images[0]?.url ?? null,
    totalInventory: p.variants.reduce((sum, v) => sum + v.inventory, 0),
  }));
}

export async function getAdminProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { variants: true, category: true, images: { orderBy: { position: "asc" } } },
  });
}

export async function getAdminCategories() {
  return prisma.category.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getAdminCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "asc" },
  });
  return categories.map((c) => ({ ...c, productCount: c._count.products }));
}

export async function getAdminCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdminBlogPosts() {
  return prisma.blogPost.findMany({
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminBlogPostById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });
}

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  items: { name: string; color: string; size: string; quantity: number; unitPrice: number }[];
  shippingTotal: number;
  discountTotal: number;
  status: "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  createdAt: string;
}

function mapOrder(o: {
  id: string;
  orderNumber: string;
  status: AdminOrderRow["status"];
  shippingTotal: number;
  discountTotal: number;
  createdAt: Date;
  user: { name: string | null; email: string };
  address: { phone: string; city: string };
  items: { quantity: number; unitPrice: number; product: { name: string }; variant: { color: string; size: string } }[];
}): AdminOrderRow {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.user.name ?? o.user.email,
    phone: o.address.phone,
    city: o.address.city,
    items: o.items.map((i) => ({
      name: i.product.name,
      color: i.variant.color,
      size: i.variant.size,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
    shippingTotal: o.shippingTotal,
    discountTotal: o.discountTotal,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  };
}

const ADMIN_ORDER_INCLUDE = {
  user: { omit: { passwordHash: true } },
  address: true,
  items: {
    include: {
      product: { select: { name: true } },
      variant: { select: { color: true, size: true } },
    },
  },
} as const;

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  const orders = await prisma.order.findMany({
    include: ADMIN_ORDER_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return orders.map(mapOrder);
}

export async function getAdminOrderById(id: string): Promise<AdminOrderRow | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: ADMIN_ORDER_INCLUDE,
  });
  return order ? mapOrder(order) : null;
}

export interface AdminCustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
}

export async function getAdminCustomers(): Promise<AdminCustomerRow[]> {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    omit: { passwordHash: true },
    include: {
      orders: { select: { total: true } },
      addresses: { orderBy: { isDefault: "desc" }, take: 1, select: { city: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name ?? "بدون نام",
    email: u.email,
    phone: u.phone ?? u.addresses[0]?.phone ?? "—",
    city: u.addresses[0]?.city ?? "—",
    ordersCount: u.orders.length,
    totalSpent: u.orders.reduce((sum, o) => sum + o.total, 0),
    joinedAt: u.createdAt.toISOString(),
  }));
}

export async function getAdminBrands() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return brands.map((b) => ({ id: b.id, slug: b.slug, name: b.name, productCount: b._count.products }));
}

export async function getAdminSeoOverrides() {
  return prisma.seoOverride.findMany({ orderBy: { path: "asc" } });
}
