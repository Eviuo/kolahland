import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper",
        outline: "border border-ink/15 text-ink",
        accent: "bg-brass text-paper",
        muted: "bg-ink/5 text-ink/70",
        sale: "bg-danger text-paper",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
