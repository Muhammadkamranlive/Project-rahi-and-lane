"use client";

import { useLane } from "@/lib/store";
import { SiteFrame } from "@/components/site";
import { Button, FieldLabel, Panel, TextInput } from "@/components/ui";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginForm() {
  const lane = useLane();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nextHref, setNextHref] = useState("");
  useEffect(() => {
    if (!nextHref || !lane.session) return;
    if (lane.account?.mfa && !lane.session.mfaOk) router.push("/mfa");
    else router.push(nextHref);
  }, [nextHref, lane.session, lane.account, router]);
  return (
    <SiteFrame>
      <Panel className="mx-auto mt-10 max-w-md">
        <h1 className="font-serif text-4xl">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Use the workspace account you were issued. Passwords are not listed on this page.</p>
        <form className="mt-4 grid gap-3" onSubmit={(event) => {
          event.preventDefault();
          const result = lane.login(email, password);
          if (!result.ok) { setError(result.error); return; }
          setNextHref(result.mfa ? "/mfa" : params.get("next") || result.href);
        }}>
          <label><FieldLabel>Email</FieldLabel><TextInput type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><FieldLabel>Password</FieldLabel><TextInput type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <Button type="submit">Continue</Button>
        </form>
        <p className="mt-4 text-sm"><Link href="/forgot" className="font-semibold text-sea">Forgot password</Link> · <Link href="/signup" className="font-semibold text-sea">Create a company</Link> · <Link href="/invite" className="font-semibold text-sea">I have an invite</Link></p>
      </Panel>
    </SiteFrame>
  );
}

export function SignupForm() {
  const lane = useLane();
  const router = useRouter();
  const [form, setForm] = useState({ company: "", city: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (pending && lane.session) router.push("/apps");
  }, [pending, lane.session, router]);
  function set(key: keyof typeof form, value: string) { setForm({ ...form, [key]: value }); }
  return (
    <SiteFrame>
      <Panel className="mx-auto mt-10 max-w-md">
        <h1 className="font-serif text-4xl">Open a company</h1>
        <form className="mt-4 grid gap-3" onSubmit={(event) => {
          event.preventDefault();
          const message = lane.signup(form);
          if (message) { setError(message); return; }
          setPending(true);
        }}>
          <label><FieldLabel>Company</FieldLabel><TextInput required value={form.company} onChange={(event) => set("company", event.target.value)} /></label>
          <label><FieldLabel>City</FieldLabel><TextInput required value={form.city} onChange={(event) => set("city", event.target.value)} /></label>
          <label><FieldLabel>Your name</FieldLabel><TextInput required value={form.name} onChange={(event) => set("name", event.target.value)} /></label>
          <label><FieldLabel>Email</FieldLabel><TextInput type="email" required value={form.email} onChange={(event) => set("email", event.target.value)} /></label>
          <label><FieldLabel>Password</FieldLabel><TextInput type="password" required minLength={8} value={form.password} onChange={(event) => set("password", event.target.value)} /></label>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <Button type="submit">Create company</Button>
        </form>
      </Panel>
    </SiteFrame>
  );
}

export function ForgotForm() {
  const lane = useLane();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  return (
    <SiteFrame>
      <Panel className="mx-auto mt-10 max-w-md">
        <h1 className="font-serif text-4xl">Reset password</h1>
        <p className="mt-2 text-sm text-muted">This demo accepts the reset on this browser. No email is sent.</p>
        <form className="mt-4 grid gap-3" onSubmit={(event) => {
          event.preventDefault();
          setMessage(lane.setPassword(email, password) ? "Password updated. You can sign in." : "No account uses that email.");
        }}>
          <label><FieldLabel>Email</FieldLabel><TextInput type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><FieldLabel>New password</FieldLabel><TextInput type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {message && <p className="text-sm">{message}</p>}
          <Button type="submit">Update password</Button>
        </form>
      </Panel>
    </SiteFrame>
  );
}

export function MfaForm() {
  const lane = useLane();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (pending && lane.session?.mfaOk) router.push("/apps");
  }, [pending, lane.session, router]);
  return (
    <SiteFrame>
      <Panel className="mx-auto mt-10 max-w-md">
        <h1 className="font-serif text-4xl">Check the second step</h1>
        <p className="mt-2 text-sm text-muted">Enter the one-time code issued with your account.</p>
        <form className="mt-4 grid gap-3" onSubmit={(event) => {
          event.preventDefault();
          if (!lane.confirmMfa(code)) { setError("That code was not accepted."); return; }
          setPending(true);
        }}>
          <label><FieldLabel>Code</FieldLabel><TextInput inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} /></label>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <Button type="submit">Verify</Button>
        </form>
      </Panel>
    </SiteFrame>
  );
}

export function InviteForm() {
  const lane = useLane();
  const router = useRouter();
  const [form, setForm] = useState({ token: "", name: "", email: "", password: "", role: "viewer" });
  const [error, setError] = useState("");
  return (
    <SiteFrame>
      <Panel className="mx-auto mt-10 max-w-md">
        <h1 className="font-serif text-4xl">Accept an invite</h1>
        <form className="mt-4 grid gap-3" onSubmit={(event) => {
          event.preventDefault();
          const message = lane.invite(form);
          if (message) { setError(message); return; }
          router.push("/login");
        }}>
          <label><FieldLabel>Invite code</FieldLabel><TextInput required value={form.token} onChange={(event) => setForm({ ...form, token: event.target.value })} /></label>
          <label><FieldLabel>Name</FieldLabel><TextInput required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label><FieldLabel>Email</FieldLabel><TextInput type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label><FieldLabel>Password</FieldLabel><TextInput type="password" required minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          <label><FieldLabel>Role key</FieldLabel><TextInput value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} /></label>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <Button type="submit">Join</Button>
        </form>
      </Panel>
    </SiteFrame>
  );
}
