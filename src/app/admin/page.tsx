import { redirect } from "next/navigation";

// The standalone dashboard was removed — /admin now sends admins straight to
// the products list (the main admin section) instead of a dashboard.
export default function AdminIndexPage() {
  redirect("/admin/products");
}
