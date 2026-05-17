import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";

import { useApp } from "@/context/AppContext";
import { TeamBadge } from "@/components/TeamBadge";
import { Countdown } from "@/components/Countdown";
import { getTeam } from "@/lib/data/teams";
import { scorePrediction } from "@/lib/scoring";

import {
  ExternalLink,
  MapPin,
  Lock,
  Radio,
} from "lucide-react";

export const Route = createFileRoute("/predict/$matchId")({
  component: PredictPage,
});

function PredictPage() {
  const { matchId } = Route.useParams();

  const {
    getMatch,
    currentUser,
    getUserPredictionForMatch,
    submitPrediction,
  } = useApp();

  const match = getMatch(matchId);

  const existing =
    currentUser && match
      ? getUserPredictionForMatch(currentUser.id, match.id)
      : null;

  const [homeScore, setHomeScore] = useState(
    existing?.homeScore ?? 0
  );

  const [awayScore, setAwayScore] = useState(
    existing?.awayScore ?? 0
  );

  useEffect(() => {
    setHomeScore(existing?.homeScore ?? 0);
    setAwayScore(existing?.awayScore ?? 0);
  }, [existing]);

  if (!match) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-black text-white">
          Match not found
        </h1>

        <Link
          to="/matches"
          className="text-accent mt-4 inline-block"
        >
          ← Back to matches
        </Link>
      </div>
    );
  }

  const home = getTeam(match.homeCode);
  const away = getTeam(match.awayCode);

  const kickoff = new Date(match.kickoff);

  const locked =
    match.status !== "scheduled" ||
    Date.now() >= kickoff.getTime();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">

      {/* BACK BUTTON */}
      <div className="relative z-50">
        <Link
          to="/matches"
          className="inline-block text-[10px] text-slate-500 hover:text-white uppercase tracking-widest font-bold"
        >
          ← All matches
        </Link>
      </div>

      {/* MATCH CARD */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-surface border border-border-subtle rounded-3xl overflow-hidden"
      >
        <div className="p-6 sm:p-10">

          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">

            {match.status === "live" && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
                <Radio className="size-3 animate-pulse" />
                Live
              </span>
            )}

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {match.stage}
            </span>

            <span className="text-slate-700">·</span>

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <MapPin className="size-3" />
              {match.stadium}, {match.city}
            </span>

          </div>

          <div className="grid grid-cols-3 items-center gap-4 sm:gap-8">

            {/* HOME */}
            <div className="flex flex-col items-center gap-3">
              <TeamBadge code={match.homeCode} size="lg" />

              <span className="font-black text-white text-center text-lg sm:text-2xl">
                {home.name}
              </span>
            </div>

            {/* CENTER */}
            <div className="text-center">

              {match.status !== "scheduled" &&
              match.homeScore != null ? (
                <>
                  <div className="text-5xl sm:text-7xl font-black text-white tabular-nums">
                    {match.homeScore}
                    <span className="mx-3">⚽</span>
                    {match.awayScore}
                  </div>

                  <p className="text-xs text-slate-500 mt-3 uppercase tracking-widest">
                    {match.status === "live"
                      ? "In play"
                      : "Full time"}
                  </p>
                </>
              ) : (
                <>
                  <Countdown iso={match.kickoff} />

                  <p className="mt-4 text-xs text-slate-500">
                    {format(kickoff, "EEE d MMM · HH:mm")}
                  </p>
                </>
              )}

            </div>

            {/* AWAY */}
            <div className="flex flex-col items-center gap-3">
              <TeamBadge code={match.awayCode} size="lg" />

              <span className="font-black text-white text-center text-lg sm:text-2xl">
                {away.name}
              </span>
            </div>

          </div>

          {/* WATCH BUTTON */}
          {match.watchUrl && (
            <div className="mt-8 flex justify-center relative z-50">
              <a
                href={match.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <Radio className="size-4" />
                Watch Live
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          )}

        </div>
      </motion.section>

      {/* PREDICTION PANEL */}
      <div className="relative z-50 bg-surface border border-border-subtle rounded-2xl p-6">

        <h2 className="text-white text-2xl font-black mb-6">
          Your Prediction
        </h2>

        {!currentUser ? (
          <div className="text-center py-8">
            <Lock className="size-8 text-slate-500 mx-auto mb-3" />

            <p className="text-white font-bold">
              Sign in to predict
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-8">

              <Stepper
                label={home.name}
                value={homeScore}
                setValue={setHomeScore}
                disabled={locked}
              />

              <span className="text-4xl">⚽</span>

              <Stepper
                label={away.name}
                value={awayScore}
                setValue={setAwayScore}
                disabled={locked}
              />

            </div>

            {!locked ? (
              <button
                type="button"
                onClick={() => {
                  submitPrediction(
                    match.id,
                    homeScore,
                    awayScore
                  );

                  toast.success("Prediction submitted");
                }}
                className="mt-8 w-full bg-accent text-pitch-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
              >
                {existing
                  ? "Update Prediction"
                  : "Lock Prediction"}
              </button>
            ) : (
              <div className="mt-8 text-center">
                <p className="text-slate-500 uppercase tracking-widest text-xs">
                  Predictions Locked
                </p>

                {existing && (
                  <div className="mt-4">
                    <p className="text-white text-3xl font-black">
                      {existing.homeScore} ⚽{" "}
                      {existing.awayScore}
                    </p>

                    {match.status === "finished" && (
                      <p className="text-accent mt-3 font-bold">
                        +
                        {scorePrediction(
                          existing,
                          match
                        )}{" "}
                        points
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  setValue,
  disabled,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-50">

      <span className="text-xs uppercase tracking-widest text-slate-500 text-center">
        {label}
      </span>

      <div className="flex items-center gap-2">

        <button
          type="button"
          disabled={disabled || value <= 0}
          onClick={() => setValue(value - 1)}
          className="size-10 rounded-lg border border-border-subtle bg-pitch-black text-white hover:border-accent transition-colors disabled:opacity-40 cursor-pointer"
        >
          −
        </button>

        <div className="w-16 h-16 rounded-xl bg-pitch-black border border-border-subtle flex items-center justify-center text-3xl font-black text-white">
          {value}
        </div>

        <button
          type="button"
          disabled={disabled || value >= 15}
          onClick={() => setValue(value + 1)}
          className="size-10 rounded-lg border border-border-subtle bg-pitch-black text-white hover:border-accent transition-colors disabled:opacity-40 cursor-pointer"
        >
          +
        </button>

      </div>
    </div>
  );
}