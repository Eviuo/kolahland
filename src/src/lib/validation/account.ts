import { z } from "zod";
import { IRAN_PHONE_REGEX } from "@/lib/validation/patterns";

export const profileSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد").max(100, "نام خیلی طولانی است"),
  email: z.string().email("ایمیل معتبر وارد کنید").max(254, "ایمیل خیلی طولانی است"),
  phone: z.string().regex(IRAN_PHONE_REGEX, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی را وارد کنید").max(72),
    newPassword: z
      .string()
      .min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد")
      .max(72, "رمز عبور نباید بیشتر از ۷۲ کاراکتر باشد"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const addressSchema = z.object({
  fullName: z.string().min(2, "نام گیرنده الزامی است").max(100),
  phone: z.string().regex(IRAN_PHONE_REGEX, "شماره موبایل معتبر نیست"),
  province: z.string().min(2, "استان را وارد کنید").max(100),
  city: z.string().min(2, "شهر را وارد کنید").max(100),
  postalCode: z
    .string()
    .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  addressLine: z.string().min(10, "آدرس کامل را وارد کنید").max(500),
  isDefault: z.boolean().optional(),
});

export type AddressValues = z.infer<typeof addressSchema>;
