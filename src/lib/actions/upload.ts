"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * The browser-supplied `file.type` (MIME type) is just a header the client
 * sends — trivially spoofable, e.g. by uploading a non-image file with a
 * crafted multipart/form-data request. Checking the real file signature
 * (magic bytes) before writing anything to disk means an attacker can't get
 * arbitrary content saved into `public/uploads/` (and then served back from
 * our own origin) just by lying about the Content-Type.
 */
function matchesFileSignature(bytes: Buffer, mimeType: string): boolean {
  switch (mimeType) {
    case "image/jpeg":
      return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png":
      return (
        bytes.length >= 8 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      );
    case "image/webp":
      return (
        bytes.length >= 12 &&
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );
    default:
      return false;
  }
}

export interface UploadResult {
  success: boolean;
  message: string;
  url?: string;
}

/**
 * Saves an uploaded image to the local filesystem under `public/uploads/<folder>`
 * and returns its public URL.
 *
 * Local-disk storage works for `npm run dev` and any server you keep
 * running yourself (a VPS, Docker, etc.) since the file just sits in
 * `public/`. It does NOT survive on serverless hosts with an ephemeral
 * filesystem (e.g. Vercel) — deploying there later means swapping this
 * for a real object-storage provider (Vercel Blob, S3, Cloudinary...),
 * without changing anything else, since callers only care about the
 * URL this function returns.
 */
async function saveUploadedImage(formData: FormData, folder: "products" | "blog"): Promise<UploadResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "دسترسی غیرمجاز." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, message: "فایلی دریافت نشد." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { success: false, message: "فرمت فایل مجاز نیست — فقط JPG، PNG یا WebP." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, message: "حجم فایل نباید بیشتر از ۵ مگابایت باشد." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesFileSignature(buffer, file.type)) {
    return { success: false, message: "محتوای فایل با فرمت اعلام‌شده مطابقت ندارد." };
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(path.join(uploadDir, filename), buffer);
    return { success: true, message: "تصویر بارگذاری شد.", url: `/uploads/${folder}/${filename}` };
  } catch (error) {
    console.error("saveUploadedImage error:", error);
    return { success: false, message: "خطا در ذخیره تصویر. دوباره تلاش کنید." };
  }
}

export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  return saveUploadedImage(formData, "products");
}

export async function uploadBlogCoverImage(formData: FormData): Promise<UploadResult> {
  return saveUploadedImage(formData, "blog");
}
