import type { ButtonHTMLAttributes, ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function statusTone(status: string) {
  const value = status.toLowerCase();
  if (/(delivered|active|accepted|paid|approved|clear|signed|simulated|won|current|passed|released|available|put away)/.test(value)) {
    return "bg-emerald-50 text-emerald-900 ring-emerald-200";
  }
  if (/(late|hold|exception|blocked|rejected|failed|short|damage|overdue|hit|refuse|missing|denied)/.test(value)) {
    return "bg-rose-50 text-rose-900 ring-rose-200";
  }
  if (/(pending|transit|offered|invited|requested|driving|draft|issued|watch|open|building|expected)/.test(value)) {
    return "bg-amber-50 text-amber-950 ring-amber-200";
  }
  return "bg-stone-100 text-stone-700 ring-stone-200";
}

export function Badge({ value }: { value: string }) {
  if (!value) return null;
  return <span className={cx("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset", statusTone(value))}>{value}</span>;
}

export function Button({
  children,
  variant = "solid",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" | "danger" }) {
  const look =
    variant === "solid"
      ? "bg-ink text-paper hover:bg-sea"
      : variant === "danger"
        ? "bg-rose-700 text-white hover:bg-rose-800"
        : "bg-white text-ink ring-1 ring-line hover:bg-sand/40";
  return (
    <button type="button" className={cx("inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition disabled:opacity-40", look, className)} {...props}>
      {children}
    </button>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">{children}</span>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx("h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none", props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx("min-h-28 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none", props.className)} />;
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx("rounded-3xl border border-line bg-white p-5 shadow-[0_16px_40px_rgba(20,32,51,0.05)]", className)}>{children}</section>;
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <p className="font-serif text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}
