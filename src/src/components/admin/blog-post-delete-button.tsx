"use client";

import { deleteBlogPost } from "@/lib/actions/admin";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";

interface BlogPostDeleteButtonProps {
  postId: string;
  postTitle: string;
  /** If set, navigate here after a successful delete instead of just refreshing
   * (needed on the edit page itself, since that route stops existing). */
  redirectTo?: string;
}

export function BlogPostDeleteButton({ postId, postTitle, redirectTo }: BlogPostDeleteButtonProps) {
  return (
    <DeleteIconButton
      ariaLabel="حذف بلاگ"
      confirmMessage={`بلاگ «${postTitle}» برای همیشه حذف می‌شود و قابل بازگشت نیست. مطمئنی؟`}
      action={() => deleteBlogPost(postId)}
      redirectTo={redirectTo}
    />
  );
}
