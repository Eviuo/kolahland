import { z } from "zod";
import { SLUG_REGEX } from "@/lib/validation/patterns";

export const productFormSchema = z.object({
  name: z.string().min(3, "نام محصول باید حداقل ۳ حرف باشد").max(200),
  slug: z
    .string()
    .min(3, "نامک باید حداقل ۳ حرف باشد")
    .max(200)
    .regex(SLUG_REGEX, "نامک فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد"),
  shortDescription: z.string().min(10, "توضیح کوتاه باید حداقل ۱۰ حرف باشد").max(160, "توضیح کوتاه نباید بیش از ۱۶۰ حرف باشد"),
  description: z.string().min(30, "توضیحات کامل باید حداقل ۳۰ حرف باشد").max(20000),
  category: z.string().min(1, "دسته‌بندی را انتخاب کنید").max(200),
  price: z.coerce.number().int().positive("قیمت باید عددی مثبت باشد"),
  compareAtPrice: z.coerce.number().int().nonnegative().optional(),
  sku: z.string().min(3, "کد محصول (SKU) الزامی است").max(100),
  inventory: z.coerce.number().int().nonnegative("موجودی نمی‌تواند منفی باشد"),
  images: z
    .array(
      z.object({
        url: z.string().min(1).max(2000),
        altText: z.string().min(1, "متن جایگزین تصویر را وارد کنید").max(300),
      })
    )
    .default([]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const categoryFormSchema = z.object({
  title: z.string().min(2, "نام دسته باید حداقل ۲ حرف باشد").max(200),
  slug: z.string().max(200).regex(SLUG_REGEX, "نامک فقط انگلیسی کوچک و خط تیره"),
  description: z.string().min(5, "توضیح دسته الزامی است").max(2000),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const brandFormSchema = z.object({
  name: z.string().min(2, "نام برند باید حداقل ۲ حرف باشد").max(200),
  slug: z.string().max(200).regex(SLUG_REGEX, "نامک فقط انگلیسی کوچک و خط تیره"),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export const couponFormSchema = z
  .object({
    code: z.string().min(3, "کد تخفیف باید حداقل ۳ حرف باشد").max(50).toUpperCase(),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    value: z.coerce.number().positive("مقدار تخفیف باید مثبت باشد"),
    minOrderTotal: z.coerce.number().nonnegative().optional(),
    usageLimit: z.coerce.number().int().positive().optional(),
    expiresAt: z.string().optional(),
  })
  .refine((data) => data.discountType !== "PERCENTAGE" || data.value <= 100, {
    message: "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد",
    path: ["value"],
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;

export const blogPostFormSchema = z.object({
  title: z.string().min(5, "عنوان باید حداقل ۵ حرف باشد").max(300),
  slug: z.string().max(200).regex(SLUG_REGEX, "نامک فقط انگلیسی کوچک و خط تیره"),
  excerpt: z.string().min(20, "خلاصه باید حداقل ۲۰ حرف باشد").max(200),
  content: z.string().min(100, "محتوای بلاگ باید حداقل ۱۰۰ حرف باشد").max(100000),
  tag: z.string().min(2, "دسته بلاگ را وارد کنید").max(100),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  coverImage: z.string().min(1, "تصویر کاور را بارگذاری کنید").max(2000),
});

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;
