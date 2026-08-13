import type { SVGProps } from "react";

/**
 * Kolahland's product imagery signature: a single-stroke, minimal line-art
 * silhouette for each hat category. Rendered in `currentColor` so it inherits
 * the surrounding surface tone (paper-on-ink cards, ink-on-paper cards, etc).
 * This stands in for photography with a deliberate, consistent illustrated
 * identity rather than stock imagery or placeholders.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CapIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 120 120" {...base} stroke="currentColor" {...props}>
      <path d="M22 66c0-21 17-38 38-38s38 17 38 38" />
      <path d="M14 70c8 6 20 9 46 9 20 0 33-2 44-7-3 9-11 13-20 13H34c-9 0-17-6-20-15z" />
      <path d="M60 28v-8" />
      <circle cx="60" cy="16" r="3" />
    </svg>
  );
}

export function BucketIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 120 120" {...base} stroke="currentColor" {...props}>
      <path d="M38 30h44l12 22H26z" />
      <path d="M30 52h60l-8 34a10 10 0 0 1-10 8H48a10 10 0 0 1-10-8z" />
      <path d="M46 30V18h28v12" />
    </svg>
  );
}

export function BeanieIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 120 120" {...base} stroke="currentColor" {...props}>
      <path d="M24 74c0-24 16-44 36-44s36 20 36 44" />
      <rect x="20" y="74" width="80" height="16" rx="6" />
      <path d="M32 74V60M48 74V54M64 74V52M80 74V60" opacity="0.55" />
      <circle cx="60" cy="24" r="4" />
    </svg>
  );
}

export function FedoraIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 120 120" {...base} stroke="currentColor" {...props}>
      <ellipse cx="60" cy="76" rx="46" ry="10" />
      <path d="M34 76c-2-20 8-40 26-40s28 20 26 40" />
      <path d="M38 50h44" />
    </svg>
  );
}

export function VisorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 120 120" {...base} stroke="currentColor" {...props}>
      <path d="M20 58a40 40 0 0 1 80 0" />
      <path d="M14 60c8 6 24 9 46 9s38-3 46-9" />
      <path d="M40 58a20 20 0 0 1 40 0" opacity="0.5" />
    </svg>
  );
}

export function WinterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 120 120" {...base} stroke="currentColor" {...props}>
      <path d="M26 70c0-22 15-42 34-42s34 20 34 42" />
      <rect x="22" y="70" width="76" height="14" rx="6" />
      <path d="M30 84c4 10 4 18 0 26M90 84c-4 10-4 18 0 26" />
      <path d="M60 28v-9M54 21l6 7 6-7" />
    </svg>
  );
}

export const iconByKey = {
  cap: CapIcon,
  bucket: BucketIcon,
  beanie: BeanieIcon,
  fedora: FedoraIcon,
  visor: VisorIcon,
  winter: WinterIcon,
} as const;

export type HatIconKey = keyof typeof iconByKey;
