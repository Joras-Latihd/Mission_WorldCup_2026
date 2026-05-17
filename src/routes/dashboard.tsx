import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { badgeForPoints } from "@/lib/scoring";
import {
  Trophy,
  Target,
  Flame,
  Award,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard - KickOff 2026" }] }),
});

function DashboardPage() {
  const { currentUser, leaderboard, predictions, comments, logout } =
    useApp();

  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!currentUser) navigate({ to: "/login" });
    }, 100);

    return () => clearTimeout(t);
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  const me = leaderboard.find((l) => l.user.id === currentUser.id);

  const myRank =
    leaderboard.findIndex((l) => l.user.id === currentUser.id) + 1;

  const myPredictions = predictions.filter(
    (p) => p.userId === currentUser.id,
  ).length;

  const myComments = comments.filter(
    (c) => c.userId === currentUser.id,
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 overflow-x-hidden">
      {/* HEADER */}
      <header className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#11131a]">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent" />

        <div className="relative flex flex-wrap items-end justify-between gap-5 p-6 sm:p-7">
          <div className="flex items-center gap-5 min-w-0">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 p-[1px] shadow-lg shadow-amber-500/10">
              <div className="size-full rounded-[15px] bg-[#161922] flex items-center justify-center">
                <span className="text-xl font-black text-white">
                  {currentUser.avatar}
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-bold mb-2">
                KickOff 2026 Profile
              </p>

              <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight truncate">
                {currentUser.username}
              </h1>

              <p className="text-sm text-slate-400 mt-1 truncate">
                {currentUser.email}
                <span className="mx-2 text-slate-600">•</span>
                <span className="text-amber-300 font-semibold">
                  {badgeForPoints(me?.points ?? 0)}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          icon={<Trophy />}
          label="Total Points"
          value={(me?.points ?? 0).toLocaleString()}
        />

        <Stat
          icon={<Award />}
          label="Global Rank"
          value={myRank > 0 ? `#${myRank}` : "—"}
        />

        <Stat
          icon={<Target />}
          label="Accuracy"
          value={`${me?.accuracy ?? 0}%`}
        />

        <Stat
          icon={<Flame />}
          label="Predictions"
          value={myPredictions.toString()}
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QUICK ACTIONS */}
        <div className="rounded-[26px] border border-white/8 bg-[#13161d] p-6">
          <h3 className="font-display font-black text-lg text-white uppercase tracking-tight mb-4">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <Link
              to="/matches"
              className="block rounded-2xl border border-white/8 bg-[#181c24] hover:bg-[#1d222c] p-4 transition-colors"
            >
              <p className="font-bold text-white">
                Predict upcoming matches
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Lock picks before kickoff
              </p>
            </Link>

            <Link
              to="/leaderboard"
              className="block rounded-2xl border border-white/8 bg-[#181c24] hover:bg-[#1d222c] p-4 transition-colors"
            >
              <p className="font-bold text-white">
                View leaderboard
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Where do you rank?
              </p>
            </Link>

            <Link
              to="/my-predictions"
              className="block rounded-2xl border border-white/8 bg-[#181c24] hover:bg-[#1d222c] p-4 transition-colors"
            >
              <p className="font-bold text-white">
                My predictions history
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Review your past picks
              </p>
            </Link>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="rounded-[26px] border border-white/8 bg-[#13161d] p-6">
          <h3 className="font-display font-black text-lg text-white uppercase tracking-tight mb-4">
            Activity
          </h3>

          <div className="space-y-4">
            <Row
              label="Predictions made"
              value={myPredictions}
            />

            <Row
              label="Correct picks"
              value={`${me?.correct ?? 0}/${me?.total ?? 0}`}
            />

            <Row
              label="Comments posted"
              value={myComments}
              icon={<MessageCircle className="size-3.5" />}
            />

            <Row
              label="Member since"
              value={
                new Date(currentUser.createdAt).getFullYear() || "—"
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#13161d] p-5">
      <div className="flex items-center gap-2 text-slate-500 mb-3">
        <span className="text-amber-300 [&>svg]:size-4">
          {icon}
        </span>

        <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>

      <p className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/6 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-400 flex items-center gap-2">
        {icon}
        {label}
      </span>

      <span className="font-display font-bold text-white tabular-nums tracking-tight">
        {value}
      </span>
    </div>
  );
}