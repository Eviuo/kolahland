import type { ReactNode } from "react";

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-extrabold text-paper">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-paper/70">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
