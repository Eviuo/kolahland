"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { AddressForm } from "@/components/account/address-form";
import { deleteAddress, setDefaultAddress } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/utils";

export interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  addressLine: string;
  isDefault: boolean;
}

export function AddressesManager({ addresses }: { addresses: AddressItem[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "adding" | { editing: string }>("idle");
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleDone() {
    setMode("idle");
    router.refresh();
  }

  async function handleDelete(id: string) {
    setPendingId(id);
    const result = await deleteAddress(id);
    setPendingId(null);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function handleSetDefault(id: string) {
    setPendingId(id);
    const result = await setDefaultAddress(id);
    setPendingId(null);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-paper">آدرس‌های من</h1>
          <p className="mt-1.5 text-sm text-paper/70">{toPersianDigits(addresses.length)} آدرس ثبت‌شده</p>
        </div>
        {mode === "idle" && (
          <Button size="sm" onClick={() => setMode("adding")}>
            <Plus className="h-4 w-4" />
            افزودن آدرس
          </Button>
        )}
      </div>

      {mode === "adding" && (
        <div className="mb-6">
          <AddressForm onDone={handleDone} />
        </div>
      )}

      {addresses.length === 0 && mode === "idle" && (
        <div className="rounded-2xl border border-dashed border-line bg-cream py-16 text-center">
          <p className="text-sm text-stone">هنوز آدرسی ثبت نکرده‌اید.</p>
        </div>
      )}

      <div className="space-y-3">
        {addresses.map((address) => {
          const isEditing = typeof mode === "object" && mode.editing === address.id;
          if (isEditing) {
            return (
              <AddressForm
                key={address.id}
                addressId={address.id}
                defaultValues={address}
                onDone={handleDone}
              />
            );
          }

          return (
            <div key={address.id} className="rounded-2xl border border-line bg-cream p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{address.fullName}</p>
                    {address.isDefault && (
                      <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold text-brass">
                        پیش‌فرض
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-stone" dir="ltr">
                    {address.phone}
                  </p>
                  <p className="mt-1 text-sm text-charcoal">
                    {address.province}، {address.city}، {address.addressLine}
                  </p>
                  <p className="mt-1 text-xs text-stone">کد پستی: {toPersianDigits(address.postalCode)}</p>
                </div>

                <div className="flex items-center gap-1">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={pendingId === address.id}
                      aria-label="تنظیم به‌عنوان پیش‌فرض"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone hover:bg-ink/5 hover:text-ink disabled:opacity-50"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setMode({ editing: address.id })}
                    aria-label="ویرایش آدرس"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-stone hover:bg-ink/5 hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={pendingId === address.id}
                    aria-label="حذف آدرس"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-stone hover:bg-red-50 hover:text-danger disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
