"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation/auth";
import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

async function clientIp(): Promise<string> {
  const h = await headers();
  return clientIpFromHeaders((name) => h.get(name));
}

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function registerUser(formData: unknown): Promise<ActionResult> {
  const ip = await clientIp();
  const { allowed } = checkRateLimit(`register:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return { success: false, message: "تعداد تلاش‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات فرم معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] }, omit: { passwordHash: true } });
  if (existing) {
    return {
      success: false,
      message: "کاربری با این ایمیل یا شماره موبایل قبلاً ثبت‌نام کرده است.",
      fieldErrors: { email: ["این ایمیل قبلاً استفاده شده است"] },
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, phone, passwordHash, role: "CUSTOMER" },
  });

  await sendWelcomeEmail(email, name);

  return { success: true, message: "ثبت‌نام با موفقیت انجام شد." };
}

export async function requestPasswordReset(formData: unknown): Promise<ActionResult> {
  const ip = await clientIp();
  const { allowed } = checkRateLimit(`forgot-password:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return { success: false, message: "تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const parsed = forgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "ایمیل معتبر وارد کنید.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email }, omit: { passwordHash: true } });

  // Always return a generic success message — confirming/denying that an
  // email exists in the system is an account-enumeration risk.
  const genericResult: ActionResult = {
    success: true,
    message: "اگر این ایمیل در سیستم ثبت شده باشد، لینک بازیابی رمز عبور برای آن ارسال می‌شود.",
  };

  if (!user) return genericResult;

  const token = randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(token, 10);

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedToken,
      expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendPasswordResetEmail(email, resetUrl);

  return genericResult;
}

export async function resetPassword(formData: unknown, email: string): Promise<ActionResult> {
  const ip = await clientIp();
  const { allowed } = checkRateLimit(`reset-password:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return { success: false, message: "تعداد تلاش‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const parsed = resetPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات فرم معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { token, password } = parsed.data;

  const storedTokens = await prisma.verificationToken.findMany({ where: { identifier: email } });
  const validEntry = await Promise.any(
    storedTokens
      .filter((t) => t.expires > new Date())
      .map(async (t) => ((await bcrypt.compare(token, t.token)) ? t : Promise.reject()))
  ).catch(() => null);

  if (!validEntry) {
    return { success: false, message: "لینک بازیابی نامعتبر یا منقضی شده است." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { email }, data: { passwordHash } });
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: validEntry.token } },
  });

  return { success: true, message: "رمز عبور با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید." };
}
