import { useEffect, useState, useMemo } from "react";

function diff(target: number, now: number) {
  const ms = Math.max(0, target - now);
  const s = Math.floor(ms / 1000);

  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
    done: ms === 0,
  };
}

export function Countdown({
  iso,
  compact = false,
}: {
  iso: string;
  compact?: boolean;
}) {
  const target = useMemo(() => new Date(iso).getTime(), [iso]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const t = useMemo(() => diff(target, now), [target, now]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (t.done) {
    return (
      <span className="text-accent font-mono text-xs uppercase tracking-widest">
        Kickoff
      </span>
    );
  }

  if (compact) {
    return (
      <span className="font-mono text-xs text-slate-400 tabular-nums">
        {t.d > 0 ? `${t.d}d ` : ""}
        {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
      </span>
    );
  }

  return (
    <div className="flex items-end gap-2 font-display tabular-nums">
      {t.d > 0 && <Block label="DAYS" value={String(t.d)} />}
      <Block label="HRS" value={pad(t.h)} />
      <Block label="MIN" value={pad(t.m)} />
      <Block label="SEC" value={pad(t.s)} />
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center min-w-[44px]">
      <span className="text-3xl sm:text-4xl font-black text-white leading-none tabular-nums">
        {value}
      </span>
      <span className="text-[9px] font-bold text-slate-500 mt-1 tracking-widest">
        {label}
      </span>
    </div>
  );
}