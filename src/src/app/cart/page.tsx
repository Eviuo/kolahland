import { CartLines } from "@/components/shop/cart-lines";

export default function CartPage() {
  return (
    <div className="container py-12">
      <header className="mb-8">
        <h1 className="text-display-2 font-extrabold text-paper">سبد خرید</h1>
      </header>

      <CartLines />
    </div>
  );
}
