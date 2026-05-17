import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SHOWDOWN_CATEGORIES,
  SHOWDOWN_PLAYERS,
} from "@/lib/showdown-data";

export const Route = createFileRoute("/showdown")({
  component: ShowdownPage,
});

function ShowdownPage() {
  const [data, setData] = useState<
    Record<string, Record<string, string>>
  >({});

  useEffect(() => {
    const saved = localStorage.getItem(
      "kickoff_showdown",
    );

    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  function updateValue(
    player: string,
    key: string,
    value: string,
  ) {
    const updated = {
      ...data,
      [player]: {
        ...(data[player] || {}),
        [key]: value,
      },
    };

    setData(updated);

    localStorage.setItem(
      "kickoff_showdown",
      JSON.stringify(updated),
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tight">
          Prediction Showdown
        </h1>

        <p className="text-slate-400 mt-3 max-w-3xl">
          FIFA World Cup 2026 tournament predictions with Saroj.
        </p>
      </div>

      <div className="space-y-6">
        {SHOWDOWN_CATEGORIES.map((category) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border-subtle rounded-3xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border-subtle bg-pitch-black">
              <h2 className="text-white text-xl font-black uppercase tracking-wide">
                {category.label}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              {SHOWDOWN_PLAYERS.map((player) => (
                <div
                  key={player}
                  className="bg-pitch-black border border-border-subtle rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">
                      {player}
                    </h3>

                    <div className="text-[10px] uppercase tracking-widest text-slate-500">
                      Prediction
                    </div>
                  </div>

                  <input
                    value={
                      data[player]?.[
                        category.key
                      ] || ""
                    }
                    onChange={(e) =>
                      updateValue(
                        player,
                        category.key,
                        e.target.value,
                      )
                    }
                    placeholder="Enter prediction..."
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}