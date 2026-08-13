"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` only after the component has mounted on the client.
 *
 * Used to avoid hydration mismatches when a component's first render
 * depends on client-only state (persisted zustand stores, `next-themes`,
 * etc.) that isn't known during server rendering.
 *
 * This exact `useState(false)` + `useEffect(() => setMounted(true), [])`
 * pattern was previously duplicated in 5 separate components.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
