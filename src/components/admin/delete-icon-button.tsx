"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/actions/admin";

interface DeleteIconButtonProps {
  /** Text shown in the native confirm dialog before deleting. */
  confirmMessage: string;
  /** The bound server action call, e.g. () => deleteBrand(brand.id). */
  action: () => Promise<ActionResult>;
  ariaLabel: string;
  /** Called after a successful delete — lets the table drop the row locally. */
  onDeleted?: () => void;
  /** Navigate here after a successful delete instead of just refreshing. */
  redirectTo?: string;
}

export function DeleteIconButton({ confirmMessage, action, ariaLabel, onDeleted, redirectTo }: DeleteIconButtonProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    setPending(true);
    const result = await action();
    setPending(false);

    if (result.success) {
      toast.success(result.message);
      onDeleted?.();
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    } else {
      // Guarded cases (used in an order, has products, etc.) come back here
      // with an explanatory message from the action itself.
      toast.error(result.message);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
