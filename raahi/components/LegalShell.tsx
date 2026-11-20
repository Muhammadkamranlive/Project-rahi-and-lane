import { Brand } from "@/components/ui";
import Link from "next/link";

export function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--cream)]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <Brand />
        <Link href="/" className="text-sm font-semibold">
          Home
        </Link>
      </header>
      <article className="mx-auto max-w-3xl px-5 pb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">Legal · template</p>
        <h1 className="mt-2 font-serif text-4xl">{title}</h1>
        <div className="prose-raahi mt-6 space-y-4 text-sm leading-7 text-[var(--ink)]">{children}</div>
        <p className="mt-10 text-xs text-[var(--muted)]">
          This is a product-ready legal framework, not advice. Get Pakistan and England & Wales counsel before going live.
        </p>
      </article>
    </div>
  );
}
