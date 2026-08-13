import { AdminPageHeader } from "@/components/admin/page-header";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <>
      <AdminPageHeader title="بلاگ جدید" description="محتوای بلاگ کلاه‌لند را اینجا بنویسید" />
      <BlogPostForm />
    </>
  );
}
