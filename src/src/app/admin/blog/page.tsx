import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { BlogPostDeleteButton } from "@/components/admin/blog-post-delete-button";
import { BlogPostStatusToggle } from "@/components/admin/blog-post-status-toggle";
import { getAdminBlogPosts } from "@/lib/data/admin-catalog";
import { toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <>
      <AdminPageHeader
        title="بلاگ"
        description="مدیریت بلاگ کلاه‌لند"
        action={
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4" />
              بلاگ جدید
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="px-4 py-3 font-medium">عنوان</th>
              <th className="px-4 py-3 font-medium">دسته</th>
              <th className="px-4 py-3 font-medium">زمان مطالعه</th>
              <th className="px-4 py-3 font-medium">تاریخ انتشار</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-line last:border-none">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{post.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-stone">{post.excerpt}</p>
                </td>
                <td className="px-4 py-3 text-charcoal">{post.tags[0]?.tag.name ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal">{toPersianDigits(post.readingMinutes)} دقیقه</td>
                <td className="px-4 py-3 text-stone">
                  {post.publishedAt ? new Intl.DateTimeFormat("fa-IR").format(new Date(post.publishedAt)) : "—"}
                </td>
                <td className="px-4 py-3">
                  <BlogPostStatusToggle postId={post.id} initialStatus={post.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone hover:bg-ink/5 hover:text-ink"
                      aria-label="ویرایش بلاگ"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <BlogPostDeleteButton postId={post.id} postTitle={post.title} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-sm text-stone">
                  هنوز بلاگی ثبت نشده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
