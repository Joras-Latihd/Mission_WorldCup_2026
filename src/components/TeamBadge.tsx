import { getTeam } from "@/lib/data/teams";

export function TeamBadge({
  code,
  size = "md",
  showLabels = true,
}: {
  code: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}) {
  const team = getTeam(code);

  const sizes = {
    sm: {
      wrapper: "size-12",
      inner: "text-2xl",
      name: "text-[10px]",
      code: "text-[9px]",
      glow: "blur-xl",
    },
    md: {
      wrapper: "size-16",
      inner: "text-4xl",
      name: "text-xs",
      code: "text-[10px]",
      glow: "blur-2xl",
    },
    lg: {
      wrapper: "size-24 sm:size-28",
      inner: "text-6xl sm:text-7xl",
      name: "text-sm",
      code: "text-xs",
      glow: "blur-3xl",
    },
  } as const;

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Glow (unchanged behavior) */}
      <div
        className={`
          absolute
          inset-0
          rounded-full
          bg-accent/10
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-300
          ${s.glow}
        `}
      />

      {/* Main Badge */}
      <div className="relative group">
        <div
          className={`
            relative
            ${s.wrapper}
            rounded-full
            border
            border-white/10
            bg-gradient-to-br
            from-[#1a1a1a]
            via-[#121212]
            to-[#0d0d0d]
            flex
            items-center
            justify-center
            shadow-lg
            transition-all
            duration-300
            group-hover:border-accent/30
            group-hover:scale-[1.03]
            overflow-hidden
          `}
        >
          {/* Inner Shine (unchanged) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%)]" />

          {/* Flag / Ball */}
          <span
            aria-hidden
            className={`
              relative
              z-10
              ${s.inner}
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]
              select-none
            `}
          >
            {team.flag}
          </span>

          {/* Bottom Highlight (unchanged) */}
          <div className="absolute bottom-0 left-1/2 h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>

      {/* Labels (NEW but safe, optional) */}
      {showLabels && (
        <div className="flex flex-col items-center leading-tight text-center">
          <span className={`font-semibold text-white ${s.name}`}>
            {team.name}
          </span>

          <span className={`font-mono tracking-widest text-slate-500 ${s.code}`}>
            {team.code}
          </span>
        </div>
      )}
    </div>
  );
}