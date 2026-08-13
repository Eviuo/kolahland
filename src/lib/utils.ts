import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Converts any string/number containing 0-9 into Persian numerals. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => persianDigits[Number(d)]!);
}

/** Formats an integer Toman amount with thousands separators and Persian numerals. */
export function formatToman(amount: number): string {
  const grouped = new Intl.NumberFormat("en-US").format(Math.round(amount));
  return `${toPersianDigits(grouped)} تومان`;
}

/** Formats a percentage discount, e.g. 20 -> "٪۲۰" */
export function formatPercent(value: number): string {
  return `٪${toPersianDigits(value)}`;
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "");
}

/**
 * Shared text-input styling used by every plain `<input>`/`<textarea>` across
 * the admin, auth, account, and contact forms. Previously this exact string
 * was copy-pasted as a local `inputClass` constant in 13 separate files.
 */
export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus-visible:outline-none focus-visible:border-ink";
