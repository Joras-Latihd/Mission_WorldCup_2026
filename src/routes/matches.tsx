import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { MatchCard } from "@/components/MatchCard";

export const Route = createFileRoute("/matches")({
  component: MatchesPage,
});

function MatchesPage() {
  const { matches } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase">
          All Matches
        </h1>

        <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest">
          FIFA World Cup 2026 Fixtures
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
          />
        ))}
      </div>
    </div>
  );
}