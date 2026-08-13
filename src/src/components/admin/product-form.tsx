"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { productFormSchema, type ProductFormValues } from "@/lib/validation/admin";
import { createProduct, updateProduct } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { ProductImageUploader, type ProductImageValue } from "@/components/admin/product-image-uploader";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

interface ProductFormProps {
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
  categories: { slug: string; title: string }[];
}

export function ProductForm({ productId, defaultValues, categories }: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<ProductImageValue[]>(defaultValues?.images ?? []);
  const isEdit = Boolean(productId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: categories[0]?.slug ?? "",
      price: 0,
      sku: "",
      inventory: 0,
      images: [],
      ...defaultValues,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setSubmitting(true);
    const payload = { ...values, images };
    const result = isEdit ? await updateProduct(productId!, payload) : await createProduct(payload);
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/products");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="نام محصول" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} placeholder="کلاه بیسبالی سی‌ینا استرا" />
        </FormField>
        <FormField label="نامک (Slug)" error={errors.slug?.message}>
          <input className={inputClass} dir="ltr" {...register("slug")} placeholder="sienna-straw-cap" />
        </FormField>
      </div>

      <FormField label="توضیح کوتاه (برای کارت محصول و متا description)" error={errors.shortDescription?.message}>
        <input className={inputClass} {...register("shortDescription")} placeholder="کلاه نخی سبک با نمای شنی" />
      </FormField>

      <FormField label="توضیحات کامل" error={errors.description?.message}>
        <textarea className={`${inputClass} min-h-32 resize-y`} {...register("description")} />
      </FormField>

      <ProductImageUploader images={images} onChange={setImages} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="دسته‌بندی" error={errors.category?.message}>
          <select className={inputClass} {...register("category")}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="کد محصول (SKU)" error={errors.sku?.message}>
          <input className={inputClass} dir="ltr" {...register("sku")} placeholder="KL-BC-001" />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="قیمت (تومان)" error={errors.price?.message}>
          <input type="number" className={inputClass} {...register("price")} />
        </FormField>
        <FormField label="قیمت قبل از تخفیف (اختیاری)" error={errors.compareAtPrice?.message}>
          <input type="number" className={inputClass} {...register("compareAtPrice")} />
        </FormField>
        <FormField label="موجودی کل" error={errors.inventory?.message}>
          <input type="number" className={inputClass} {...register("inventory")} />
        </FormField>
      </div>

      <div className="flex gap-3 border-t border-line pt-6">
        <Button type="submit" disabled={submitting}>
          {submitting ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "ایجاد محصول"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
