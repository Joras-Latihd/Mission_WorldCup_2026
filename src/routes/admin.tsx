import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Save,
  ShieldCheck,
  Radio,
  Trophy,
  Link2,
} from "lucide-react";

import { useApp } from "@/context/AppContext";
import { getTeam } from "@/lib/data/teams";

import type {
  Match,
  MatchStatus,
} from "@/lib/types";

export const Route = createFileRoute("/admin")({
  component: AdminPage,

  head: () => ({
    meta: [
      {
        title: "Admin Panel - KickOff 2026",
      },
    ],
  }),
});

function AdminPage() {
  const {
    currentUser,
    matches,
    updateMatch,
  } = useApp();

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentUser) {
        navigate({ to: "/login" });
        return;
      }

      if (!currentUser.isAdmin) {
        navigate({ to: "/" });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  const stats = useMemo(() => {
    const live = matches.filter((m) => m.status === "live").length;
    const finished = matches.filter((m) => m.status === "finished").length;

    return {
      total: matches.length,
      live,
      finished,
    };
  }, [matches]);

  if (!currentUser?.isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
          <ShieldCheck className="size-4" />
          Verifying Access
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

      {/* HERO (removed bright gradient feel) */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#121212] p-6 sm:p-8">

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-accent">
              <ShieldCheck className="size-3.5" />
              Admin Console
            </div>

            <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Match Control Center
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Manage match states, update live scores, attach stream links,
              and control tournament flow in real time.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard label="Matches" value={stats.total} icon={<Trophy className="size-4" />} />
            <StatCard label="Live" value={stats.live} icon={<Radio className="size-4 text-red-400" />} />
            <StatCard label="Finished" value={stats.finished} icon={<ShieldCheck className="size-4" />} />
          </div>
        </div>
      </div>

      {/* MATCHES */}
      <div className="mt-8 space-y-4">
        {matches.map((match) => (
          <AdminMatchRow
            key={match.id}
            match={match}
            onSave={(override) => {
              updateMatch(match.id, override);
              toast.success("Match updated successfully");
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AdminMatchRow({
  match,
  onSave,
}: {
  match: Match;
  onSave: (override: Partial<Match>) => void;
}) {
  const home = getTeam(match.homeCode);
  const away = getTeam(match.awayCode);

  const [status, setStatus] = useState<MatchStatus>(match.status);
  const [homeScore, setHomeScore] = useState(match.homeScore?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(match.awayScore?.toString() ?? "");
  const [watchUrl, setWatchUrl] = useState(match.watchUrl ?? "");

  const statusStyle = {
    scheduled: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    live: "border-red-500/20 bg-red-500/10 text-red-300",
    finished: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#151515] p-5">

      <div className="relative z-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Teams */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{home.flag}</span>

              <div>
                <p className="font-display text-lg font-black text-white">
                  {home.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  {match.homeCode}
                </p>
              </div>
            </div>

            <span className="px-2 text-sm font-black uppercase tracking-[0.2em] text-slate-600">
              VS
            </span>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-display text-lg font-black text-white">
                  {away.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  {match.awayCode}
                </p>
              </div>

              <span className="text-2xl">{away.flag}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${statusStyle[status]}`}>
              {status}
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
              {match.stage}
            </div>

            <div className="text-[10px] font-bold uppercase text-slate-500">
              {format(new Date(match.kickoff), "EEE d MMM · HH:mm")}
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[170px_120px_120px_1fr_auto]">

          <Field label="Match Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MatchStatus)}
              className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-semibold text-white outline-none"
            >
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="finished">Finished</option>
            </select>
          </Field>

          <Field label={home.code}>
            <input
              type="number"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-center font-display text-lg font-black text-white outline-none"
            />
          </Field>

          <Field label={away.code}>
            <input
              type="number"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-center font-display text-lg font-black text-white outline-none"
            />
          </Field>

          <Field label="Watch URL">
            <div className="relative">
              <Link2 className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                value={watchUrl}
                onChange={(e) => setWatchUrl(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none"
              />
            </div>
          </Field>

          <button
            onClick={() =>
              onSave({
                status,
                homeScore: homeScore === "" ? null : Number(homeScore),
                awayScore: awayScore === "" ? null : Number(awayScore),
                watchUrl: watchUrl || null,
              })
            }
            className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-xs font-black uppercase text-pitch-black"
          >
            <Save className="size-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="min-w-[100px] rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">{icon}</span>
        <span className="font-display text-2xl font-black text-white">
          {value}
        </span>
      </div>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
    </div>
  );
}