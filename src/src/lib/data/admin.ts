export type { OrderStatus } from "@/lib/order-status";
export { ORDER_STATUS_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/order-status";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  items: { name: string; color: string; size: string; quantity: number; unitPrice: number }[];
  shippingTotal: number;
  discountTotal: number;
  status: OrderStatus;
  createdAt: string;
}

export const adminOrders: AdminOrder[] = [
  {
    id: "o1",
    orderNumber: "KL-10248",
    customerName: "امیر رضایی",
    phone: "0912XXXXXXX",
    city: "تهران",
    items: [{ name: "کلاه بیسبالی سی‌ینا استرا", color: "زغالی", size: "آزاد", quantity: 1, unitPrice: 615000 }],
    shippingTotal: 45000,
    discountTotal: 0,
    status: "DELIVERED",
    createdAt: "2026-07-02",
  },
  {
    id: "o2",
    orderNumber: "KL-10249",
    customerName: "سارا محمدی",
    phone: "0935XXXXXXX",
    city: "اصفهان",
    items: [
      { name: "کلاه باکت نوا", color: "سبز پسته‌ای", size: "S/M", quantity: 2, unitPrice: 720000 },
      { name: "کلاه بافت اطلس", color: "کرم", size: "آزاد", quantity: 1, unitPrice: 450000 },
    ],
    shippingTotal: 65000,
    discountTotal: 100000,
    status: "SHIPPED",
    createdAt: "2026-07-08",
  },
  {
    id: "o3",
    orderNumber: "KL-10250",
    customerName: "کیان توکلی",
    phone: "0919XXXXXXX",
    city: "شیراز",
    items: [{ name: "کلاه باکت نویر", color: "مشکی", size: "L/XL", quantity: 1, unitPrice: 780000 }],
    shippingTotal: 55000,
    discountTotal: 0,
    status: "PROCESSING",
    createdAt: "2026-07-12",
  },
  {
    id: "o4",
    orderNumber: "KL-10251",
    customerName: "الناز کریمی",
    phone: "0902XXXXXXX",
    city: "تبریز",
    items: [{ name: "کلاه زمستانی بورئال", color: "زغالی", size: "آزاد", quantity: 1, unitPrice: 980000 }],
    shippingTotal: 70000,
    discountTotal: 0,
    status: "PENDING_PAYMENT",
    createdAt: "2026-07-14",
  },
  {
    id: "o5",
    orderNumber: "KL-10252",
    customerName: "پارسا نیک‌نام",
    phone: "0938XXXXXXX",
    city: "مشهد",
    items: [{ name: "کلاه مد روز وسپر", color: "مشکی مات", size: "آزاد", quantity: 1, unitPrice: 860000 }],
    shippingTotal: 60000,
    discountTotal: 0,
    status: "CANCELLED",
    createdAt: "2026-07-10",
  },
  {
    id: "o6",
    orderNumber: "KL-10253",
    customerName: "نگار احمدی",
    phone: "0913XXXXXXX",
    city: "کرج",
    items: [{ name: "کلاه لبه‌دار الارا", color: "قهوه‌ای", size: "آزاد", quantity: 1, unitPrice: 890000 }],
    shippingTotal: 50000,
    discountTotal: 0,
    status: "DELIVERED",
    createdAt: "2026-06-28",
  },
];

export function orderTotal(order: AdminOrder) {
  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return subtotal - order.discountTotal + order.shippingTotal;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
}

export const adminCustomers: AdminCustomer[] = [
  { id: "c1", name: "امیر رضایی", email: "amir.rezaei@example.com", phone: "0912XXXXXXX", city: "تهران", ordersCount: 4, totalSpent: 2450000, joinedAt: "2025-12-01" },
  { id: "c2", name: "سارا محمدی", email: "sara.m@example.com", phone: "0935XXXXXXX", city: "اصفهان", ordersCount: 2, totalSpent: 1610000, joinedAt: "2026-01-15" },
  { id: "c3", name: "کیان توکلی", email: "kian.t@example.com", phone: "0919XXXXXXX", city: "شیراز", ordersCount: 1, totalSpent: 780000, joinedAt: "2026-03-22" },
  { id: "c4", name: "الناز کریمی", email: "elnaz.k@example.com", phone: "0902XXXXXXX", city: "تبریز", ordersCount: 3, totalSpent: 1980000, joinedAt: "2025-11-08" },
  { id: "c5", name: "پارسا نیک‌نام", email: "parsa.n@example.com", phone: "0938XXXXXXX", city: "مشهد", ordersCount: 1, totalSpent: 860000, joinedAt: "2026-05-02" },
  { id: "c6", name: "نگار احمدی", email: "negar.a@example.com", phone: "0913XXXXXXX", city: "کرج", ordersCount: 5, totalSpent: 3120000, joinedAt: "2025-09-19" },
];

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minOrderTotal?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export const adminCoupons: AdminCoupon[] = [
  { id: "cp1", code: "KOLAH20", discountType: "PERCENTAGE", value: 20, minOrderTotal: 500000, usageLimit: 200, usedCount: 87, expiresAt: "2026-08-31", isActive: true },
  { id: "cp2", code: "WELCOME50K", discountType: "FIXED_AMOUNT", value: 50000, minOrderTotal: 400000, usageLimit: 500, usedCount: 312, expiresAt: "2026-12-31", isActive: true },
  { id: "cp3", code: "SUMMER10", discountType: "PERCENTAGE", value: 10, usageLimit: undefined, usedCount: 145, expiresAt: "2026-07-31", isActive: true },
  { id: "cp4", code: "BLACKFRIDAY", discountType: "PERCENTAGE", value: 30, minOrderTotal: 1000000, usageLimit: 1000, usedCount: 1000, expiresAt: "2025-11-30", isActive: false },
];

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  status: "DRAFT" | "PUBLISHED";
  readingMinutes: number;
  publishedAt?: string;
  tag: string;
}

export const adminBlogPosts: AdminBlogPost[] = [
  { id: "b1", slug: "how-to-choose-baseball-cap", title: "چطور کلاه بیسبالی مناسب خودتان را انتخاب کنید", excerpt: "راهنمای کامل انتخاب سایز، جنس و رنگ کلاه بیسبالی متناسب با فرم صورت.", author: "تیم کلاه‌لند", status: "PUBLISHED", readingMinutes: 6, publishedAt: "2026-06-10", tag: "راهنمای خرید" },
  { id: "b2", slug: "bucket-hat-styling-guide", title: "۵ روش شیک ست کردن کلاه باکت", excerpt: "از استایل خیابانی تا کژوال روزمره، ترکیب‌های پیشنهادی با کلاه باکت.", author: "تیم کلاه‌لند", status: "PUBLISHED", readingMinutes: 4, publishedAt: "2026-06-24", tag: "استایل" },
  { id: "b3", slug: "winter-hat-care-guide", title: "نگهداری صحیح کلاه‌های بافتنی و زمستانی", excerpt: "چطور کلاه بافت را بشوییم که فرمش خراب نشود.", author: "تیم کلاه‌لند", status: "DRAFT", readingMinutes: 5, tag: "نگهداری" },
];

export interface SeoOverrideRow {
  id: string;
  path: string;
  title?: string;
  description?: string;
  noIndex: boolean;
}

export const seoOverrides: SeoOverrideRow[] = [
  { id: "s1", path: "/product/sienna-straw-cap", title: "کلاه بیسبالی سی‌ینا استرا | خرید کلاه نخی اورجینال", description: "خرید کلاه بیسبالی سی‌ینا استرا با ارسال سریع و ضمانت اصالت کالا از کلاه‌لند.", noIndex: false },
  { id: "s2", path: "/category/fashion-hats", title: "کلاه‌های مد روز ۱۴۰۵ | کلاه‌لند", description: "جدیدترین مدل‌های کلاه مد روز با طراحی خاص و محدود.", noIndex: false },
  { id: "s3", path: "/checkout", noIndex: true },
];

export interface AdminBrand {
  id: string;
  slug: string;
  name: string;
  productCount: number;
}

export const adminBrands: AdminBrand[] = [
  { id: "br1", slug: "kolahland-original", name: "کلاه‌لند اورجینال", productCount: 6 },
  { id: "br2", slug: "kolahland-atelier", name: "کلاه‌لند آتلیه", productCount: 2 },
];

export const analyticsSummary = {
  revenueThisMonth: 48250000,
  revenueLastMonth: 39120000,
  ordersThisMonth: 63,
  ordersLastMonth: 51,
  newCustomersThisMonth: 28,
  avgOrderValue: 765873,
  conversionRate: 2.4,
  revenueByDay: [
    { day: "شنبه", revenue: 4200000 },
    { day: "یکشنبه", revenue: 5100000 },
    { day: "دوشنبه", revenue: 3800000 },
    { day: "سه‌شنبه", revenue: 6200000 },
    { day: "چهارشنبه", revenue: 5600000 },
    { day: "پنجشنبه", revenue: 7400000 },
    { day: "جمعه", revenue: 8900000 },
  ],
  topProducts: [
    { name: "کلاه باکت نویر", unitsSold: 142, revenue: 110760000 },
    { name: "کلاه بیسبالی سی‌ینا استرا", unitsSold: 118, revenue: 72570000 },
    { name: "کلاه باکت نوا", unitsSold: 96, revenue: 69120000 },
    { name: "کلاه بافت اطلس", unitsSold: 84, revenue: 37800000 },
  ],
};
