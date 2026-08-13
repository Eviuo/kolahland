/** Shared regex patterns used by more than one Zod schema in `lib/validation/*`. */

/** Iranian mobile numbers: 09 followed by 9 digits. */
export const IRAN_PHONE_REGEX = /^09\d{9}$/;

/** URL-safe slug: lowercase English letters, digits, and hyphens only. */
export const SLUG_REGEX = /^[a-z0-9-]+$/;
