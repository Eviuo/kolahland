"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveSeoOverride, deleteSeoOverride } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";
import type { SeoOverrideRow } from "@/lib/data/admin";
import { inputClass } from "@/lib/utils";

export function SeoOverrideForm({ row }: { row: SeoOverrideRow }) {
  const [title, setTitle] = useState(row.title ?? "");
  const [description, setDescription] = useState(row.description ?? "");
  const [noIndex, setNoIndex] = useState(row.noIndex);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await saveSeoOverride(row.path, title || undefined, description || undefined, noIndex);
    setSaving(false);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-ink" dir="ltr">
          {row.path}
        </p>
        <DeleteIconButton
          ariaLabel="حذف این مسیر"
          confirmMessage={`تنظیمات سئوی مسیر «${row.path}» حذف می‌شود و قابل بازگشت نیست. مطمئنی؟`}
          action={() => deleteSeoOverride(row.id)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="seo-title" className="mb-1 block text-[11px] text-stone">
            عنوان سئو (Meta Title)
          </label>
          <input
            id="seo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            maxLength={60}
          />
          <p className="mt-1 text-[10px] text-stone">{title.length}/۶۰ کاراکتر</p>
        </div>
        <div>
          <label htmlFor="seo-description" className="mb-1 block text-[11px] text-stone">
            توضیح سئو (Meta Description)
          </label>
          <input
            id="seo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            maxLength={160}
          />
          <p className="mt-1 text-[10px] text-stone">{description.length}/۱۶۰ کاراکتر</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-charcoal">
          <input type="checkbox" checked={noIndex} onChange={(e) => setNoIndex(e.target.checked)} />
          عدم نمایه‌سازی این صفحه در گوگل (noindex)
        </label>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>
    </div>
  );
}
