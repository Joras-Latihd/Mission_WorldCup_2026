import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Target,
  Trophy,
  CheckCircle2,
  Radio,
  Sparkles,
} from "lucide-react";

import { useApp } from "@/context/AppContext";
import { getTeam } from "@/lib/data/teams";
import { scorePrediction } from "@/lib/scoring";

export const Route = createFileRoute("/my-predictions")({
  component: MyPredictionsPage,
  head: () => ({
    meta: [{ title: "My Predictions - KickOff 2026" }],
  }),
});

function MyPredictionsPage() {
  const { currentUser, predictions, matches } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === null) {
      const t = setTimeout(() => {
        if (!currentUser) navigate({ to: "/login" });
      }, 100);

      return () => clearTimeout(t);
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-[#141414]">
          <span className="text-slate-400 font-medium">
            Loading your predictions...
          </span>
        </div>
      </div>
    );
  }

  const mine = predictions
    .filter((p) => p.userId === currentUser.id)
    .map((p) => ({
      p,
      match: matches.find((m) => m.id === p.matchId)!,
    }))
    .filter((x) => x.match)
    .sort(
      (a, b) =>
        new Date(b.match.kickoff).getTime() -
        new Date(a.match.kickoff).getTime()
    );

  const totalPoints = mine.reduce(
    (s, x) => s + scorePrediction(x.p, x.match),
    0
  );

  const stats = useMemo(() => {
    const finished = mine.filter(
      (x) => x.match.status === "finished"
    );

    const exact = finished.filter(
      (x) =>
        x.p.homeScore === x.match.homeScore &&
        x.p.awayScore === x.match.awayScore
    );

    return {
      total: mine.length,
      finished: finished.length,
      exact: exact.length,
      accuracy: finished.length
        ? Math.round((exact.length / finished.length) * 100)
        : 0,
    };
  }, [mine]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative overflow-hidden rounded-[2rem]
          border border-white/10
          bg-[#141414]
          p-6 sm:p-8
        "
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-3 py-1.5 mb-5">
              <Sparkles className="size-3.5 text-accent" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent">
                Prediction Center
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-black text-white italic uppercase tracking-tight">
              My Picks
            </h1>

            <p className="text-slate-400 mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
              Track all your World Cup predictions and review performance.
            </p>
          </div>

          {/* RIGHT STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <StatCard icon={<Target className="size-4" />} label="Predictions" value={stats.total} />
            <StatCard icon={<Trophy className="size-4" />} label="Points" value={totalPoints} />
            <StatCard icon={<CheckCircle2 className="size-4" />} label="Exact" value={stats.exact} />
            <StatCard icon={<Radio className="size-4" />} label="Accuracy" value={`${stats.accuracy}%`} />
          </div>
        </div>
      </motion.section>

      {/* EMPTY */}
      {mine.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            rounded-[2rem]
            border border-white/10
            bg-[#141414]
            p-12 text-center
          "
        >
          <div className="mx-auto size-20 rounded-3xl border border-white/10 bg-[#141414] flex items-center justify-center mb-6">
            <Target className="size-8 text-accent" />
          </div>

          <h2 className="text-2xl font-display font-black text-white uppercase">
            No Predictions Yet
          </h2>

          <p className="text-slate-500 mt-3 max-w-md mx-auto">
            Start predicting upcoming matches.
          </p>

          <Link
            to="/matches"
            className="
              mt-7 inline-flex items-center gap-2
              bg-accent text-black
              px-6 py-3 rounded-2xl
              font-black text-xs uppercase tracking-[0.18em]
            "
          >
            Browse Matches
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {mine.map(({ p, match }, index) => {
            const home = getTeam(match.homeCode);
            const away = getTeam(match.awayCode);

            const pts = scorePrediction(p, match);

            const exact =
              match.status === "finished" &&
              p.homeScore === match.homeScore &&
              p.awayScore === match.awayScore;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to="/matches/$matchId"
                  params={{ matchId: match.id }}
                  className="
                    group relative block overflow-hidden
                    rounded-[1.8rem]
                    border border-white/10
                    bg-[#141414]
                    p-5 sm:p-6
                    transition-all duration-300
                  "
                >

                  <div className="relative z-10">

                    {/* TOP */}
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                      {/* MATCH */}
                      <div className="flex items-center gap-5 flex-1 min-w-0">

                        {/* HOME */}
                        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                          <div className="text-right min-w-0">
                            <h3 className="font-display font-black text-white text-base sm:text-lg truncate">
                              {home.name}
                            </h3>

                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mt-1">
                              {match.homeCode}
                            </p>
                          </div>

                          <div className="size-14 rounded-2xl border border-white/10 bg-[#151515] flex items-center justify-center text-3xl">
                            {home.flag}
                          </div>
                        </div>

                        {/* CENTER */}
                        <div className="shrink-0 text-center min-w-[110px]">
                          <div className="bg-[#141414] border border-white/10 rounded-2xl px-4 py-3">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">
                              Your Pick
                            </p>

                            <div className="font-display text-2xl font-black text-white tabular-nums">
                              {p.homeScore}
                              <span className="mx-1 text-accent">:</span>
                              {p.awayScore}
                            </div>
                          </div>

                          {match.status === "finished" &&
                            match.homeScore != null && (
                              <div className="mt-3 text-slate-400 text-sm">
                                {match.homeScore}–{match.awayScore}
                              </div>
                            )}
                        </div>

                        {/* AWAY */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="size-14 rounded-2xl border border-white/10 bg-[#151515] flex items-center justify-center text-3xl">
                            {away.flag}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-display font-black text-white text-base sm:text-lg truncate">
                              {away.name}
                            </h3>

                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mt-1">
                              {match.awayCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="flex flex-row xl:flex-col items-center xl:items-end gap-3">
                        <div className="px-4 py-2 rounded-2xl border border-white/10 bg-[#141414] text-slate-300 text-center min-w-[110px]">
                          <p className="text-[9px] uppercase tracking-[0.18em] font-black">
                            Points
                          </p>
                          <p className="font-display text-xl font-black mt-1">
                            +{pts}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock3 className="size-3.5" />
                        <span className="text-[10px] uppercase tracking-[0.18em] font-bold">
                          {format(new Date(match.kickoff), "EEE d MMM · HH:mm")}
                        </span>
                      </div>

                      <div className="text-slate-400 text-xs uppercase">
                        {match.stage} · {match.stadium}
                      </div>

                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
      <div className="flex items-center gap-2 text-accent mb-2">
        {icon}
      </div>

      <p className="text-2xl font-display font-black text-white">
        {value}
      </p>

      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-black mt-1">
        {label}
      </p>
    </div>
  );
}