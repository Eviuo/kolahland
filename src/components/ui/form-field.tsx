"use client";

import { cloneElement, isValidElement, useId, type ReactElement } from "react";

/**
 * Wraps a single form control (input/textarea/select) with a label that's
 * *programmatically* associated to it (via matching `id`/`htmlFor`), not
 * just visually placed above it. Without this, screen readers never
 * announce the label when the control receives focus — the visual label
 * and the control were previously separate sibling elements with no `id`
 * connecting them.
 *
 * Usage is unchanged from the old plain-`<label>` pattern — just wrap the
 * existing control:
 *   <FormField label="نام محصول" error={errors.name?.message}>
 *     <input className={inputClass} {...register("name")} />
 *   </FormField>
 */
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactElement<{ id?: string }>;
}) {
  const generatedId = useId();
  const id = children.props.id ?? generatedId;
  const control = isValidElement(children) ? cloneElement(children, { id }) : children;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-ink">
        {label}
      </label>
      {control}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
