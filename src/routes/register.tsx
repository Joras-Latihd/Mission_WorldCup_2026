import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [{ title: "Create account - KickOff 2026" }],
  }),
});

function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const cleanUsername = username.trim();
      const cleanEmail = email.trim();

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      const result = register(cleanUsername, cleanEmail, password);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(`Welcome to KickOff 2026, ${result.username}`);

      navigate({ to: "/" });
    },
    [username, email, password, register, navigate]
  );

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-surface border border-border-subtle rounded-3xl p-8">
        <h1 className="font-display text-3xl font-black text-white italic uppercase tracking-tight">
          Create Account
        </h1>

        <p className="text-slate-500 mt-1 text-sm">
          Stored locally on this device.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Username">
            <input
              required
              minLength={2}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-pitch-black border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-pitch-black border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-pitch-black border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
            />
          </Field>

          <button
            type="submit"
            className="w-full bg-accent text-pitch-black py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-bold">
            Sign in
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