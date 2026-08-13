"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

const schema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  subject: z.string().min(3, "موضوع پیام را وارد کنید"),
  message: z.string().min(10, "پیام باید حداقل ۱۰ حرف باشد"),
});
type Values = z.infer<typeof schema>;

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
      <div className="rounded-2xl border border-line bg-cream p-8 text-center">
        <p className="text-sm leading-7 text-charcoal">{sent}</p>
        <button onClick={() => setSent(null)} className="mt-4 text-xs font-semibold text-ink hover:underline">
          ارسال پیام دیگر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-line bg-cream p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="نام" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </FormField>
        <FormField label="ایمیل" error={errors.email?.message}>
          <input className={inputClass} dir="ltr" {...register("email")} />
        </FormField>
      </div>
      <FormField label="موضوع" error={errors.subject?.message}>
        <input className={inputClass} {...register("subject")} placeholder="سوال درباره سفارش، محصول و..." />
      </FormField>
      <FormField label="پیام" error={errors.message?.message}>
        <textarea className={`${inputClass} min-h-32 resize-y`} {...register("message")} />
      </FormField>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "در حال ارسال..." : "ارسال پیام"}
      </Button>
    </form>
  );
}
