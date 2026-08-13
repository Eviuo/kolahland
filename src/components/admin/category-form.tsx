"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validation/admin";
import { createCategory } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";

export function CategoryForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categoryFormSchema) });

  async function onSubmit(values: CategoryFormValues) {
    setSubmitting(true);
    const result = await createCategory(values);
    setSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-4">
      <div className="sm:col-span-1">
        <input className={inputClass} placeholder="نام دسته" aria-label="نام دسته" {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
      </div>
      <div className="sm:col-span-1">
        <input className={inputClass} dir="ltr" placeholder="نامک (slug)" aria-label="نامک" {...register("slug")} />
        {errors.slug && <p className="mt-1 text-xs text-danger">{errors.slug.message}</p>}
      </div>
      <div className="sm:col-span-1">
        <input className={inputClass} placeholder="توضیح کوتاه" aria-label="توضیح کوتاه" {...register("description")} />
        {errors.description && <p className="mt-1 text-xs text-danger">{errors.description.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="sm:col-span-1">
        {submitting ? "در حال ذخیره..." : "افزودن دسته"}
      </Button>
    </form>
  );
}
