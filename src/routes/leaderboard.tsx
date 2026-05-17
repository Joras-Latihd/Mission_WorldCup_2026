import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { badgeForPoints } from "@/lib/scoring";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
  head: () => ({
    meta: [
      { title: "Leaderboard — KickOff 2026" },
      { name: "description", content: "World Cup 2026 prediction leaderboard." },
    ],
  }),
});

function LeaderboardPage() {
  const { leaderboard, currentUser } = useApp();

  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];

  const podium = safeLeaderboard.slice(0, 3);
  const rest = safeLeaderboard.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <header>
        <h1 className="font-display text-4xl font-black text-white italic uppercase tracking-tight">
          Leaderboard
        </h1>
        <p className="text-slate-500 mt-1">
          Friends ranked by points & accuracy
        </p>
      </header>

      {/* Podium */}
      {podium.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end">
          {[1, 0, 2].map((idx) => {
            const e = podium[idx];
            if (!e) return <div key={idx} />;

            const heights = [
              "h-32 sm:h-40",
              "h-44 sm:h-56",
              "h-24 sm:h-32",
            ];

            const barHeight =
              idx === 0 ? heights[1] : idx === 1 ? heights[0] : heights[2];

            return (
              <motion.div
                key={e.user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`size-14 sm:size-16 rounded-full mb-2 grid place-items-center text-sm font-black ${
                    idx === 0
                      ? "bg-accent text-pitch-black ring-4 ring-accent/30"
                      : "bg-surface-2 text-white border border-border-subtle"
                  }`}
                >
                  {e.user.avatar}
                </div>

                <p className="font-bold text-white text-sm sm:text-base text-center truncate max-w-full px-2">
                  {e.user.username}
                </p>

                <p className="text-[10px] text-slate-500 mb-3">
                  {e.accuracy}% acc
                </p>

                <div
                  className={`w-full ${barHeight} ${
                    idx === 0 ? "bg-accent" : "bg-surface-2"
                  } rounded-t-2xl border-x border-t border-border-subtle flex items-start justify-center pt-3`}
                >
                  <div className="text-center">
                    <p
                      className={`font-display font-black text-2xl sm:text-3xl ${
                        idx === 0 ? "text-pitch-black" : "text-white"
                      } tabular-nums`}
                    >
                      {e.points}
                    </p>
                    <p
                      className={`text-[10px] uppercase font-bold tracking-widest ${
                        idx === 0 ? "text-pitch-black/60" : "text-slate-500"
                      }`}
                    >
                      #{idx + 1}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2.5rem_1fr_5rem_5rem_5rem] sm:grid-cols-[3rem_1fr_6rem_6rem_6rem] gap-2 px-5 py-3 border-b border-border-subtle text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          <span>#</span>
          <span>Player</span>
          <span className="text-right">Acc</span>
          <span className="text-right hidden sm:block">Picks</span>
          <span className="text-right">Pts</span>
        </div>

        {[...podium, ...rest].map((e, i) => {
          const isMe = currentUser?.id === e.user.id;

          return (
            <div
              key={e.user.id}
              className={`grid grid-cols-[2.5rem_1fr_5rem_5rem_5rem] sm:grid-cols-[3rem_1fr_6rem_6rem_6rem] gap-2 px-5 py-4 border-b border-border-subtle last:border-b-0 items-center ${
                isMe ? "bg-accent/5" : ""
              }`}
            >
              <span
                className={`font-display font-black italic ${
                  i === 0 ? "text-accent" : "text-slate-600"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-full bg-surface-2 border border-border-subtle grid place-items-center text-[10px] font-bold text-white shrink-0">
                  {e.user.avatar}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-white text-sm truncate">
                    {e.user.username}{" "}
                    {isMe && (
                      <span className="text-accent text-[10px]">YOU</span>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {badgeForPoints(e.points)}
                  </p>
                </div>
              </div>

              <span className="text-right text-sm text-slate-300 tabular-nums">
                {e.accuracy}%
              </span>

              <span className="text-right text-sm text-slate-500 tabular-nums hidden sm:block">
                {e.correct}/{e.total}
              </span>

              <span className="text-right font-display font-black text-white tabular-nums">
                {e.points}
              </span>
            </div>
          );
        })}

        {!safeLeaderboard.length && (
          <div className="px-6 py-16 text-center text-slate-500">
            <Trophy className="size-8 mx-auto mb-3 text-slate-700" />
            <p>No predictions scored yet. Be the first to play.</p>
          </div>
        )}
      </div>
    </div>
  );
}