import Link from "next/link";

export function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-[var(--green)] text-[var(--cream)] shadow-[inset_0_-2px_0_rgba(0,0,0,.15)]">
        <span className="font-serif text-lg leading-none">ر</span>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className={`block font-serif text-xl tracking-tight ${light ? "text-white" : "text-[var(--ink)]"}`}>Raahi</span>
          <span className={`block text-[10px] uppercase tracking-[0.22em] ${light ? "text-white/70" : "text-[var(--muted)]"}`}>
            راہی · trusted carry
          </span>
        </span>
      )}
    </Link>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return (
    <span className={`grid ${dim} shrink-0 place-items-center rounded-full bg-[var(--green)] font-semibold text-[var(--cream)]`}>
      {initials}
    </span>
  );
}

export function Badge({
  children,
  tone = "sage",
}: {
  children: React.ReactNode;
  tone?: "sage" | "gold" | "ink" | "danger" | "ok";
}) {
  const tones = {
    sage: "bg-[var(--sage)] text-[var(--green)]",
    gold: "bg-[var(--gold-soft)] text-[var(--gold)]",
    ink: "bg-[var(--ink)] text-[var(--cream)]",
    danger: "bg-[#fde8e4] text-[#9b2c1f]",
    ok: "bg-[#e4f3ea] text-[#146c43]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(26,36,28,.06)] ${className}`}>{children}</div>;
}

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-[var(--green)] text-[var(--cream)] hover:bg-[var(--green-2)]",
    secondary: "bg-[var(--ink)] text-[var(--cream)] hover:opacity-90",
    ghost: "bg-white text-[var(--ink)] ring-1 ring-[var(--line)] hover:bg-[var(--cream-2)]",
    danger: "bg-[#9b2c1f] text-white hover:opacity-90",
  }[variant];
  const cls = `inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-4 text-sm font-semibold transition disabled:opacity-40 ${styles} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-[var(--line)] bg-white px-3.5 py-3 text-sm text-[var(--ink)] outline-none ring-[var(--green)] placeholder:text-[var(--muted)] focus:ring-2";

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <Card className="text-center">
      <p className="font-serif text-xl">{title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
    </Card>
  );
}
