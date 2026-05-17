import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { getTeam } from "@/lib/data/teams";
import { scorePrediction } from "@/lib/scoring";
import { toast } from "sonner";

export const Route = createFileRoute("/predictions")({
  component: PredictionsPage,
});

function PredictionsPage() {
  const {
    matches,
    currentUser,
    submitPrediction,
    getUserPredictionForMatch,
  } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase">
          Predictions
        </h1>

        <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest">
          Predict every match and earn points
        </p>
      </div>

      <div className="space-y-6">
        {matches.map((match) => {
          const home = getTeam(match.homeCode);
          const away = getTeam(match.awayCode);

          const existing = currentUser
            ? getUserPredictionForMatch(
                currentUser.id,
                match.id
              )
            : null;

          return (
            <PredictionCard
              key={match.id}
              match={match}
              homeName={home.name}
              awayName={away.name}
              existing={existing}
              onSave={(h, a) => {
                submitPrediction(
                  match.id,
                  h,
                  a
                );

                toast.success(
                  "Prediction saved"
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function PredictionCard({
  match,
  homeName,
  awayName,
  existing,
  onSave,
}: any) {
  const [home, setHome] = useState(
    existing?.homeScore ?? 0
  );

  const [away, setAway] = useState(
    existing?.awayScore ?? 0
  );

  const locked =
    match.status !== "scheduled";

  const points =
    existing &&
    match.status === "finished"
      ? scorePrediction(
          existing,
          match
        )
      : null;

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-black text-white">
            {homeName}
            <span className="mx-3 text-accent">
              ⚽
            </span>
            {awayName}
          </h2>

          <p className="text-slate-500 text-xs uppercase tracking-widest mt-2">
            {match.stage}
          </p>
        </div>

        {match.status === "finished" && (
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Final Score
            </p>

            <p className="text-2xl font-black text-white">
              {match.homeScore} -{" "}
              {match.awayScore}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-5">
        <Stepper
          value={home}
          setValue={setHome}
          disabled={locked}
        />

        <span className="text-3xl">
          ⚽
        </span>

        <Stepper
          value={away}
          setValue={setAway}
          disabled={locked}
        />
      </div>

      {!locked ? (
        <button
          onClick={() =>
            onSave(home, away)
          }
          className="mt-6 w-full bg-accent text-pitch-black py-3 rounded-xl font-black text-xs uppercase tracking-widest"
        >
          {existing
            ? "Update Prediction"
            : "Save Prediction"}
        </button>
      ) : (
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Predictions Locked
          </p>

          {existing && (
            <>
              <p className="text-white font-black text-xl mt-2">
                Your Pick:
                {" "}
                {existing.homeScore}
                {" - "}
                {existing.awayScore}
              </p>

              {points != null && (
                <p className="text-accent font-bold mt-2">
                  +{points} pts
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Stepper({
  value,
  setValue,
  disabled,
}: any) {
  return (
    <div className="flex items-center gap-2">
      <button
        disabled={disabled}
        onClick={() =>
          setValue(
            Math.max(0, value - 1)
          )
        }
        className="size-10 rounded-xl bg-pitch-black border border-border-subtle text-white"
      >
        −
      </button>

      <div className="w-16 h-16 rounded-xl bg-pitch-black border border-border-subtle grid place-items-center text-3xl font-black text-white">
        {value}
      </div>

      <button
        disabled={disabled}
        onClick={() =>
          setValue(
            Math.min(15, value + 1)
          )
        }
        className="size-10 rounded-xl bg-pitch-black border border-border-subtle text-white"
      >
        +
      </button>
    </div>
  );
}