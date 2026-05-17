import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { format, isToday } from "date-fns";
import { getTeam } from "@/lib/data/teams";
import type { Match } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import {
  ArrowRight,
  Lock,
  Radio,
  Trophy,
  Clock3,
} from "lucide-react";
import { Countdown } from "./Countdown";

export function MatchCard({ match }: { match: Match }) {
  const {
    currentUser,
    getUserPredictionForMatch,
  } = useApp();

  const home = getTeam(match.homeCode);
  const away = getTeam(match.awayCode);

  const kickoff = new Date(match.kickoff);

  const locked =
    match.status !== "scheduled" ||
    Date.now() >= kickoff.getTime();

  const myPred = currentUser
    ? getUserPredictionForMatch(currentUser.id, match.id)
    : null;

  const isLive = match.status === "live";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      {/* MAIN CARD LINK */}
      <div
  className="
          relative
          block
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#0d0d0d]
          p-5
          sm:p-6
          transition-all
          duration-300
          cursor-pointer
        "
      >
        {/* TOP BAR */}
        <div className="absolute top-0 left-0 h-[2px] w-full bg-white/10 opacity-60" />

        <div className="relative z-10 flex items-center justify-between gap-5">

          {/* LEFT */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">

            {/* TIME */}
            <div className="shrink-0 w-[68px] text-center">
              {isLive ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1">
                    <Radio className="size-3 text-red-400" />

                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
                      Live
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                    Playing
                  </span>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-white/10 bg-[#141414] px-3 py-2">
                    <p className="text-base font-black text-white leading-none">
                      {isToday(kickoff)
                        ? format(kickoff, "HH:mm")
                        : format(kickoff, "dd")}
                    </p>

                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold mt-1">
                      {isToday(kickoff)
                        ? "Today"
                        : format(kickoff, "MMM")}
                    </p>
                  </div>

                  <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-600 font-bold">
                    {format(kickoff, "HH:mm")}
                  </p>
                </>
              )}
            </div>

            {/* DIVIDER */}
            <div className="hidden sm:block h-16 w-px bg-white/10 shrink-0" />

            {/* TEAMS */}
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">

              {/* HOME */}
              <div className="flex items-center justify-end gap-3 flex-1 min-w-0">
                <div className="text-right min-w-0">
                  <h3 className="font-display text-sm sm:text-lg font-black text-white truncate tracking-tight">
                    {home.name}
                  </h3>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                    {match.homeCode}
                  </p>
                </div>

                <div className="size-14 rounded-2xl border border-white/10 bg-[#151515] flex items-center justify-center text-3xl shadow-md">
                  {home.flag}
                </div>
              </div>

              {/* CENTER */}
              <div className="shrink-0 min-w-[80px] text-center">
                {match.status !== "scheduled" &&
                match.homeScore != null &&
                match.awayScore != null ? (
                  <>
                    <div className="font-display text-3xl font-black text-white tracking-tight tabular-nums">
                      {match.homeScore}
                      <span className="mx-1 text-accent">:</span>
                      {match.awayScore}
                    </div>

                    {isLive && (
                      <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-red-400 font-black">
                        Live Score
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#151515] px-4 py-2">
                      <span className="text-sm font-black tracking-[0.25em] text-slate-300">
                        VS
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-slate-500 font-bold">
                      Match
                    </p>
                  </>
                )}
              </div>

              {/* AWAY */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="size-14 rounded-2xl border border-white/10 bg-[#151515] flex items-center justify-center text-3xl shadow-md">
                  {away.flag}
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-sm sm:text-lg font-black text-white truncate tracking-tight">
                    {away.name}
                  </h3>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                    {match.awayCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div
            className="hidden lg:flex items-center shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {match.watchUrl ? (
              <a
                href={match.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-red-400"
              >
                <div className="size-11 rounded-2xl border border-red-500/20 bg-red-500/10 flex items-center justify-center">
                  <Radio className="size-4" />
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] font-black">
                  Watch
                </span>
              </a>
            ) : myPred ? (
              <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 min-w-[120px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="size-3 text-accent" />

                  <span className="text-[9px] uppercase tracking-[0.18em] text-accent font-black">
                    Your Pick
                  </span>
                </div>

                <p className="text-center font-display text-xl font-black text-white tabular-nums">
                  {myPred.homeScore}–{myPred.awayScore}
                </p>
              </div>
            ) : locked ? (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <div className="size-11 rounded-2xl border border-white/10 bg-[#141414] flex items-center justify-center">
                  <Lock className="size-4" />
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] font-black">
                  Locked
                </span>
              </div>
            ) : (
              <Link
                to="/predict/$matchId"
                params={{ matchId: match.id }}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center gap-2 text-accent"
              >
                <div className="size-11 rounded-2xl border border-accent/20 bg-accent/10 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <ArrowRight className="size-4" />
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] font-black">
                  Predict
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* BOTTOM */}
        {match.status === "scheduled" && !locked && (
          <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-3 py-1.5">
              <Clock3 className="size-3.5 text-accent" />

              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-300 font-black">
                {match.stage}
                {match.group !== "—"
                  ? ` • Group ${match.group}`
                  : ""}
              </span>
            </div>

            <div className="rounded-full border border-white/10 bg-[#141414] px-3 py-1.5">
              <Countdown iso={match.kickoff} compact />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}