"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/validation/admin";
import { saveBlogPost } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { CoverImageUploader } from "@/components/admin/cover-image-uploader";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

interface BlogPostFormProps {
  postId?: string;
  defaultValues?: Partial<BlogPostFormValues>;
}

export function BlogPostForm({ postId, defaultValues }: BlogPostFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(postId);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: { status: "DRAFT", coverImage: "", ...defaultValues },
  });
  const coverImage = watch("coverImage");

  async function onSubmit(values: BlogPostFormValues) {
    setSubmitting(true);
    const result = isEdit ? await saveBlogPost(values, postId) : await saveBlogPost(values);
    setSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="عنوان بلاگ" error={errors.title?.message}>
          <input className={inputClass} {...register("title")} />
        </FormField>
        <FormField label="نامک (Slug)" error={errors.slug?.message}>
          <input className={inputClass} dir="ltr" {...register("slug")} />
        </FormField>
      </div>

      <CoverImageUploader
        value={coverImage}
        onChange={(url) => setValue("coverImage", url, { shouldValidate: true })}
        error={errors.coverImage?.message}
      />

      <FormField label="خلاصه (برای متا description)" error={errors.excerpt?.message}>
        <input className={inputClass} {...register("excerpt")} />
      </FormField>

      <FormField label="محتوای بلاگ" error={errors.content?.message}>
        <textarea className={`${inputClass} min-h-56 resize-y`} {...register("content")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="دسته بلاگ" error={errors.tag?.message}>
          <input className={inputClass} placeholder="راهنمای خرید" {...register("tag")} />
        </FormField>
        <FormField label="وضعیت">
          <select className={inputClass} {...register("status")}>
            <option value="DRAFT">پیش‌نویس</option>
            <option value="PUBLISHED">منتشر شود</option>
          </select>
        </FormField>
      </div>

      <div className="flex gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={submitting}>
          {submitting ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "ذخیره بلاگ"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
