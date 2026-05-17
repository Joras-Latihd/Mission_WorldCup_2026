import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — KickOff 2026" }] }),
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const u = login(email, password);

    if (u) {
      toast.success(`Welcome back, ${u.username}`);
      navigate({ to: "/" });
    } else {
      toast.error("Invalid credentials");
    }
  };

  const fillDemo = (e: string) => {
    setEmail(e);
    setPassword(e === "admin@kickoff2026.app" ? "admin123" : "demo123");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-surface border border-border-subtle rounded-3xl p-8">
        <h1 className="font-display text-3xl font-black text-white italic uppercase tracking-tight">
          Sign In
        </h1>

        <p className="text-slate-500 mt-1 text-sm">
          Welcome back to the league.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-pitch-black border border-border-subtle rounded-lg px-4 py-3 text-white outline-none focus:border-accent"
              autoComplete="email"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-pitch-black border border-border-subtle rounded-lg px-4 py-3 text-white outline-none focus:border-accent"
              autoComplete="current-password"
            />
          </Field>

          <button
            type="submit"
            className="w-full bg-accent text-pitch-black py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
          >
            Sign in
          </button>
        </form>

      

        <p className="mt-6 text-sm text-slate-500 text-center">
          New here?{" "}
          <Link to="/register" className="text-accent font-bold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}