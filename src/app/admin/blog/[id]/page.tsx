import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { BlogPostDeleteButton } from "@/components/admin/blog-post-delete-button";
import { getAdminBlogPostById } from "@/lib/data/admin-catalog";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAdminBlogPostById(id);
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader title={`ویرایش: ${post.title}`} description="محتوای این بلاگ را ویرایش کنید" />
      <BlogPostForm
        postId={post.id}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          status: post.status,
          tag: post.tags[0]?.tag.name ?? "",
        }}
      />

      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/40 p-4">
        <p className="mb-3 text-sm font-medium text-red-800">حذف این بلاگ برای همیشه است و قابل بازگشت نیست.</p>
        <BlogPostDeleteButton postId={post.id} postTitle={post.title} redirectTo="/admin/blog" />
      </div>
    </>
  );
}
