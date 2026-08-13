"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد").max(100),
  email: z.string().email("ایمیل معتبر وارد کنید").max(254),
  subject: z.string().min(3, "موضوع پیام را وارد کنید").max(200),
  message: z.string().min(10, "پیام باید حداقل ۱۰ حرف باشد").max(5000),
});

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export async function sendContactMessage(formData: unknown): Promise<ActionResult> {
  const h = await headers();
  const ip = clientIpFromHeaders((name) => h.get(name));
  const { allowed } = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return { success: false, message: "تعداد پیام‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." };
  }

  const parsed = contactSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات فرم معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Same pattern as src/lib/email.ts: logs in dev, wire a real provider/inbox
  // (e.g. forward to support@kolahland.ir) before going live.
  console.log("[contact:dev]", parsed.data);

  return { success: true, message: "پیام شما ارسال شد. تیم پشتیبانی کلاه‌لند ظرف ۲۴ ساعت پاسخ می‌دهد." };
}
