import { z } from "zod";

export const checkoutItemSchema = z.object({
  slug: z.string().min(1),
  color: z.string().min(1),
  size: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

export const placeOrderSchema = z.object({
  addressId: z.string().min(1, "آدرس ارسال را انتخاب کنید"),
  items: z.array(checkoutItemSchema).min(1, "سبد خرید خالی است"),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["ONLINE", "COD"]),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
