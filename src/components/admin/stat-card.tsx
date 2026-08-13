import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: number; // percentage, positive or negative
}

export function StatCard({ label, value, icon: Icon, change }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
          <Icon className="h-5 w-5" strokeWidth={1.7} />
        </div>
        {typeof change === "number" && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              isPositive ? "text-success" : "text-danger"
            }`}
          >
            {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {toPersianDigits(Math.abs(change))}٪
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 text-xs text-stone">{label}</p>
    </div>
  );
}
