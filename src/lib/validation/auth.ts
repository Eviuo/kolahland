import { z } from "zod";
import { IRAN_PHONE_REGEX } from "@/lib/validation/patterns";

export const registerSchema = z
  .object({
    name: z.string().min(2, "نام باید حداقل ۲ حرف باشد").max(100, "نام خیلی طولانی است"),
    email: z.string().email("ایمیل معتبر وارد کنید").max(254, "ایمیل خیلی طولانی است"),
    phone: z.string().regex(IRAN_PHONE_REGEX, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .max(72, "رمز عبور نباید بیشتر از ۷۲ کاراکتر باشد"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: "پذیرش قوانین الزامی است" }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3, "ایمیل یا شماره موبایل را وارد کنید").max(254),
  // Deliberately no min-length message beyond 1 here (a wrong-length real
  // password should still fail at the bcrypt.compare step, not leak via a
  // client-visible validation message) — but a max is still needed so an
  // attacker can't submit an arbitrarily large string to every login
  // attempt and force expensive hashing work on the server for nothing.
  password: z.string().min(1, "رمز عبور را وارد کنید").max(72),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید").max(254, "ایمیل خیلی طولانی است"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "لینک بازیابی نامعتبر است").max(512, "لینک بازیابی نامعتبر است"),
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .max(72, "رمز عبور نباید بیشتر از ۷۲ کاراکتر باشد"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
