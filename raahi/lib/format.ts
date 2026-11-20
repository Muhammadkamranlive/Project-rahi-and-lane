export function money(gbp: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(gbp);
}

export function prettyDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export function prettyDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function directionLabel(fromCountry: string, toCountry: string) {
  if (toCountry === "Pakistan" && fromCountry !== "Pakistan") return "Into Pakistan";
  if (fromCountry === "Pakistan" && toCountry !== "Pakistan") return "Leaving Pakistan";
  return "Corridor";
}

export function maskId(value: string) {
  if (value.length < 4) return "••••";
  return `${"•".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

export function randomOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
