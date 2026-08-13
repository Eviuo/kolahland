"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  subject: z.string().min(3, "موضوع پیام را وارد کنید"),
  message: z.string().min(10, "پیام باید حداقل ۱۰ حرف باشد"),
});
type Values = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus-visible:outline-none focus-visible:border-ink";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setSubmitting(true);
    const result = await sendContactMessage(values);
    setSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      setSent(result.message);
      reset();
    } else {
      toast.error(result.message);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <p className="text-sm leading-7 text-charcoal">{sent}</p>
        <button onClick={() => setSent(null)} className="mt-4 text-xs font-semibold text-ink hover:underline">
          ارسال پیام دیگر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink">نام</label>
          <input className={inputClass} {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink">ایمیل</label>
          <input className={inputClass} dir="ltr" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink">موضوع</label>
        <input className={inputClass} {...register("subject")} placeholder="سوال درباره سفارش، محصول و..." />
        {errors.subject && <p className="mt-1 text-xs text-danger">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink">پیام</label>
        <textarea className={`${inputClass} min-h-32 resize-y`} {...register("message")} />
        {errors.message && <p className="mt-1 text-xs text-danger">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "در حال ارسال..." : "ارسال پیام"}
      </Button>
    </form>
  );
}
