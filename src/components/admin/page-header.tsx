import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-stone">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
