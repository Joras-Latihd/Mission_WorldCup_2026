import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { MatchCard } from "@/components/MatchCard";
import { TeamBadge } from "@/components/TeamBadge";
import { Countdown } from "@/components/Countdown";
import { format } from "date-fns";
import { ArrowRight, Trophy, Target, Flame, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "KickOff 2026 - World Cup Prediction League" },
      { name: "description", content: "Predict every World Cup 2026 match. Compete with friends. Climb the leaderboard." },
    ],
  }),
});

function HomePage() {
  const { matches, leaderboard, currentUser, predictions } = useApp();

  const featured =
    matches.find((m) => m.status === "live") ??
    matches.find((m) => m.status === "scheduled");

  const upcoming = matches.filter((m) => m.status === "scheduled").slice(0, 5);
  const finishedCount = matches.filter((m) => m.status === "finished").length;

  const myEntry = currentUser
    ? leaderboard.find((l) => l.user.id === currentUser.id)
    : null;
  const myPredictionsCount = currentUser
    ? predictions.filter((p) => p.userId === currentUser.id).length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
      {/* Hero */}
      {featured && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-surface border border-border-subtle rounded-3xl overflow-hidden"
        >
          <div className="relative p-6 sm:p-10 lg:p-14">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {featured.status === "live" ? (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest animate-pulse">
                  ● Live Now
                </span>
              ) : (
                <span className="bg-accent text-pitch-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  Featured Match
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {featured.stage} {featured.group !== "—" ? `· Group ${featured.group}` : ""} · {featured.stadium}, {featured.city}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-12">
              <div className="flex lg:flex-col items-center gap-4 lg:gap-6">
                <TeamBadge code={featured.homeCode} size="lg" />
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight text-center">
                    {featured.homeCode}
                  </h2>
                  <p className="hidden lg:block text-center text-xs text-slate-500 mt-1">Home</p>
                </div>
              </div>

              <div className="text-center">
                {featured.status === "live" ? (
                  <>
                    <div className="text-5xl sm:text-6xl font-display font-black text-white tabular-nums">
                      {featured.homeScore} – {featured.awayScore}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mt-3">In play</p>
                  </>
                ) : (
                  <Countdown iso={featured.kickoff} />
                )}
                <p className="mt-4 text-xs text-slate-500">
                  {format(new Date(featured.kickoff), "EEE d MMM · HH:mm")}
                </p>
              </div>

              <div className="flex lg:flex-col-reverse items-center gap-4 lg:gap-6 justify-end lg:justify-start">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight text-center">
                    {featured.awayCode}
                  </h2>
                  <p className="hidden lg:block text-center text-xs text-slate-500 mt-1">Away</p>
                </div>
                <TeamBadge code={featured.awayCode} size="lg" />
              </div>
            </div>

          <div className="relative z-20 mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
  to={
    featured.status === "live"
      ? "/matches/$matchId"
      : "/predict/$matchId"
  }
  params={{ matchId: featured.id }}
  className="bg-accent text-pitch-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
>
  {featured.status === "live"
    ? "View Match"
    : "Predict Now"}

  <ArrowRight className="size-4" />
</Link>
              <Link
                to="/matches"
                className="border border-border-subtle text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-slate-500 transition-colors"
              >
                All Fixtures
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Trophy className="size-4" />} label="Your Points" value={myEntry?.points.toLocaleString() ?? "—"} />
        <StatCard icon={<Target className="size-4" />} label="Accuracy" value={myEntry ? `${myEntry.accuracy}%` : "—"} />
        <StatCard icon={<Flame className="size-4" />} label="Predictions" value={myPredictionsCount.toString()} />
        <StatCard icon={<Sparkles className="size-4" />} label="Matches Played" value={`${finishedCount}/${matches.length}`} />
      </section>

      {/* Two column */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tight">Upcoming Matches</h2>
              <p className="text-slate-500 mt-1 text-sm">Predict before kickoff to score points</p>
            </div>
            <Link to="/matches" className="text-accent text-[10px] font-bold uppercase tracking-widest hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">Top Predictors</h3>
              <Link to="/leaderboard" className="text-accent text-[10px] font-bold uppercase hover:underline">See all</Link>
            </div>
            <div className="p-2">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div
                  key={entry.user.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? "bg-accent/5 border border-accent/10" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`font-display font-black text-base italic w-6 ${i === 0 ? "text-accent" : "text-slate-700"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="size-8 rounded-full bg-surface-2 border border-border-subtle grid place-items-center text-[10px] font-bold text-white">
                      {entry.user.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{entry.user.username}</p>
                      <p className="text-[10px] text-slate-500">{entry.accuracy}% acc.</p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-white tabular-nums">{entry.points.toLocaleString()}</span>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="p-4 text-sm text-slate-500 text-center">No scores yet.</p>
              )}
            </div>
          </div>

          <div className="bg-accent rounded-2xl p-6 text-pitch-black">
            <h3 className="font-display font-black text-xl uppercase leading-none mb-4">Tournament Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-end border-b border-pitch-black/10 pb-2">
                <span className="text-[10px] font-bold uppercase opacity-70">Matches Done</span>
                <span className="text-2xl font-display font-black tracking-tighter">{finishedCount}/{matches.length}</span>
              </div>
              <div className="flex justify-between items-end border-b border-pitch-black/10 pb-2">
                <span className="text-[10px] font-bold uppercase opacity-70">Players</span>
                <span className="text-2xl font-display font-black tracking-tighter">{leaderboard.length}</span>
              </div>
              {!currentUser && (
                <Link to="/register" className="block text-center w-full bg-pitch-black text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-900 transition-colors mt-4">
                  Join the league
                </Link>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5">
      <div className="flex items-center gap-2 text-slate-500 mb-3">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="font-display text-3xl font-black text-white tabular-nums tracking-tight">{value}</p>
    </div>
  );
}
