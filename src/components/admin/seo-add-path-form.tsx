"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createSeoOverridePath } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function SeoAddPathForm() {
  const [path, setPath] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    if (!path.trim()) return;
    setSubmitting(true);
    const result = await createSeoOverridePath(path.trim());
    setSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      setPath("");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-5">
      <input
        value={path}
        onChange={(e) => setPath(e.target.value)}
        dir="ltr"
        placeholder="/product/my-product"
        className="min-w-[220px] flex-1 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus-visible:outline-none focus-visible:border-ink"
      />
      <Button onClick={handleAdd} disabled={submitting}>
        {submitting ? "در حال افزودن..." : "افزودن مسیر"}
      </Button>
    </div>
  );
}
