"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateBlogPostStatus } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export function BlogPostStatusToggle({
  postId,
  initialStatus,
}: {
  postId: string;
  initialStatus: "DRAFT" | "PUBLISHED";
}) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, setPending] = useState(false);
  const isPublished = status === "PUBLISHED";

  async function handleToggle() {
    setPending(true);
    const next = isPublished ? "DRAFT" : "PUBLISHED";
    const result = await updateBlogPostStatus(postId, next);
    setPending(false);
    if (result.success) {
      setStatus(next);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={isPublished}
      title={isPublished ? "برگرداندن به پیش‌نویس" : "انتشار بلاگ"}
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:opacity-60",
        isPublished ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-amber-100 text-amber-800 hover:bg-amber-200"
      )}
    >
      {isPublished ? "منتشرشده" : "پیش‌نویس"}
    </button>
  );
}
