"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { brandFormSchema, type BrandFormValues } from "@/lib/validation/admin";
import { createBrand } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";

export function BrandForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandFormValues>({ resolver: zodResolver(brandFormSchema) });

  async function onSubmit(values: BrandFormValues) {
    setSubmitting(true);
    const result = await createBrand(values);
    setSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3">
      <div className="sm:col-span-1">
        <input className={inputClass} placeholder="نام برند" aria-label="نام برند" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
      </div>
      <div className="sm:col-span-1">
        <input className={inputClass} dir="ltr" placeholder="نامک (slug)" aria-label="نامک" {...register("slug")} />
        {errors.slug && <p className="mt-1 text-xs text-danger">{errors.slug.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="sm:col-span-1">
        {submitting ? "در حال ذخیره..." : "افزودن برند"}
      </Button>
    </form>
  );
}
