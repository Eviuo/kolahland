import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-navy px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-extrabold text-paper">
            کلاه‌لند
          </Link>
          <h1 className="mt-4 text-xl font-extrabold text-paper">{title}</h1>
          <p className="mt-1.5 text-sm text-paper/70">{subtitle}</p>
        </div>
        <div className="flex justify-center">{children}</div>
      </div>
    </div>
  );
}
