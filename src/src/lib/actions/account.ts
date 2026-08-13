"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema, changePasswordSchema, addressSchema } from "@/lib/validation/account";

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

async function requireSession() {
  const session = await auth();
  if (!session?.user) return null;
  return session;
}

export async function updateProfile(formData: unknown): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { success: false, message: "برای این عملیات باید وارد حساب کاربری شوید." };

  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات وارد شده معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, phone } = parsed.data;

  const conflict = await prisma.user.findFirst({
    where: { AND: [{ id: { not: session.user.id } }, { OR: [{ email }, { phone }] }] },
    omit: { passwordHash: true },
  });
  if (conflict) {
    return { success: false, message: "این ایمیل یا شماره موبایل قبلاً برای حساب دیگری ثبت شده است." };
  }

  await prisma.user.update({ where: { id: session.user.id }, data: { name, email, phone } });
  revalidatePath("/account");
  revalidatePath("/account/profile");

  return { success: true, message: "اطلاعات پروفایل به‌روزرسانی شد." };
}

export async function changePassword(formData: unknown): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { success: false, message: "برای این عملیات باید وارد حساب کاربری شوید." };

  const parsed = changePasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات وارد شده معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash) {
    return { success: false, message: "این حساب رمز عبور ندارد." };
  }

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, message: "رمز عبور فعلی اشتباه است.", fieldErrors: { currentPassword: ["رمز عبور فعلی اشتباه است"] } };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash } });

  return { success: true, message: "رمز عبور با موفقیت تغییر کرد." };
}

export async function createAddress(formData: unknown): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { success: false, message: "برای این عملیات باید وارد حساب کاربری شوید." };

  const parsed = addressSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات آدرس معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existingCount = await prisma.address.count({ where: { userId: session.user.id } });

  await prisma.address.create({
    data: { ...parsed.data, userId: session.user.id, isDefault: existingCount === 0 ? true : !!parsed.data.isDefault },
  });

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  revalidatePath("/account/addresses");
  return { success: true, message: "آدرس جدید ذخیره شد." };
}

export async function updateAddress(addressId: string, formData: unknown): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { success: false, message: "برای این عملیات باید وارد حساب کاربری شوید." };

  const parsed = addressSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات آدرس معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id) {
    return { success: false, message: "آدرس یافت نشد." };
  }

  await prisma.address.update({ where: { id: addressId }, data: parsed.data });
  revalidatePath("/account/addresses");
  return { success: true, message: "آدرس به‌روزرسانی شد." };
}

export async function deleteAddress(addressId: string): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { success: false, message: "برای این عملیات باید وارد حساب کاربری شوید." };

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id) {
    return { success: false, message: "آدرس یافت نشد." };
  }

  await prisma.address.delete({ where: { id: addressId } });
  revalidatePath("/account/addresses");
  return { success: true, message: "آدرس حذف شد." };
}

export async function setDefaultAddress(addressId: string): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) return { success: false, message: "برای این عملیات باید وارد حساب کاربری شوید." };

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id) {
    return { success: false, message: "آدرس یافت نشد." };
  }

  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId: session.user.id, isDefault: true }, data: { isDefault: false } }),
    prisma.address.update({ where: { id: addressId }, data: { isDefault: true } }),
  ]);

  revalidatePath("/account/addresses");
  return { success: true, message: "آدرس پیش‌فرض تغییر کرد." };
}
