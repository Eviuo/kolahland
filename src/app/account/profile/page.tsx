import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/shared/section-header";
import { ProfileForm } from "@/components/account/profile-form";
import { ChangePasswordForm } from "@/components/account/change-password-form";

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session!.user.id }, omit: { passwordHash: true } });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="sr-only">پروفایل کاربری</h1>
        <SectionHeader title="پروفایل" description="اطلاعات شخصی خود را ویرایش کنید" />
        <ProfileForm defaultValues={{ name: user.name ?? "", email: user.email, phone: user.phone ?? "" }} />
      </div>

      <div className="border-t border-navy-line pt-8">
        <SectionHeader title="تغییر رمز عبور" description="برای امنیت بیشتر، رمز عبور قوی انتخاب کنید" />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
