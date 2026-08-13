"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { profileSchema, type ProfileValues } from "@/lib/validation/account";
import { updateProfile } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

export function ProfileForm({ defaultValues }: { defaultValues: ProfileValues }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues });

  async function onSubmit(values: ProfileValues) {
    setSubmitting(true);
    const result = await updateProfile(values);
    setSubmitting(false);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4 rounded-2xl border border-line bg-cream p-6">
      <FormField label="نام و نام خانوادگی" error={errors.name?.message}>
        <input className={inputClass} {...register("name")} />
      </FormField>
      <FormField label="ایمیل" error={errors.email?.message}>
        <input className={inputClass} dir="ltr" {...register("email")} />
      </FormField>
      <FormField label="شماره موبایل" error={errors.phone?.message}>
        <input className={inputClass} dir="ltr" {...register("phone")} />
      </FormField>
      <Button type="submit" disabled={submitting}>
        {submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}
