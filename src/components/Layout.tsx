import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { Toaster } from "sonner";
import {
  LogOut,
  Trophy,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  TimerReset,
  Radio,
} from "lucide-react";
import { useMemo, useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/matches", label: "Matches" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/my-predictions", label: "My Picks" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Layout() {
  const { currentUser, logout, leaderboard, matches } = useApp();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const myEntry = currentUser
    ? leaderboard.find((l) => l.user.id === currentUser.id)
    : null;

  const featuredMatch = useMemo(() => {
    return matches.find((m) => m.status === "scheduled") || matches[0];
  }, [matches]);

  const countdown = useMemo(() => {
    if (!featuredMatch) return "Soon";

    const diff =
      new Date(featuredMatch.kickoff).getTime() - Date.now();

    if (diff <= 0) return "LIVE";

    const hrs = Math.floor(diff / 1000 / 60 / 60);
    const mins = Math.floor((diff / 1000 / 60) % 60);

    return `${hrs}h ${mins}m`;
  }, [featuredMatch]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050505] text-foreground overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-180px] left-[-120px] h-[420px] w-[420px] rounded-full bg-accent/10 blur-[90px]" />

        <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[90px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_40%)]" />
      </div>

      {/* TOP LIVE STRIP */}
      <div className="relative z-50 border-b border-white/10 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 backdrop-blur-xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 min-h-11 py-2 flex items-center justify-between gap-3 text-sm flex-wrap">
          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />

                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </div>

              <span className="font-black uppercase tracking-[0.2em] text-red-400 text-[10px]">
                Live Hub
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
  href="https://play.fifa.com/bracket-predictor/"
  target="_blank"
  rel="noopener noreferrer"
  className="
    hidden
    md:flex
    items-center
    gap-2
    text-slate-300
    hover:text-white
    transition-all
    duration-300
    group
  "
>
  <div
    className="
      flex
      items-center
      gap-2
      rounded-full
      border
      border-yellow-500/20
      bg-yellow-500/10
      px-4
      py-1.5
      group-hover:bg-yellow-500/20
      group-hover:border-yellow-400/40
      transition-all
    "
  >
    <Radio className="size-4 text-yellow-400" />

    <span className="font-bold uppercase tracking-wide text-yellow-100">
      Bracket Predictor
    </span>
  </div>
</a>
            <a
              href="https://saroj-football-predictor.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                hidden
                md:flex
                items-center
                gap-2
                text-slate-300
                hover:text-white
                transition-all
                duration-300
                group
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  px-4
                  py-1.5
                  group-hover:bg-cyan-500/20
                  group-hover:border-cyan-400/40
                  transition-all
                "
              >
                <TimerReset className="size-4 text-cyan-400" />

                <span className="font-bold uppercase tracking-wide text-cyan-100">
                  Open Predictor
                </span>
              </div>
            </a>

            <Link
              to="/matches"
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-1.5
                text-[11px]
                font-black
                uppercase
                tracking-[0.18em]
                text-red-300
                hover:bg-red-500/20
                transition-all
              "
            >
              <Radio className="size-3.5" />

              <span className="hidden sm:inline">
                Match Center
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
<nav className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
    {/* LEFT */}
    <div className="flex items-center gap-10">
      <Link
        to="/"
        className="group relative font-black tracking-tight text-white"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="size-4 text-accent absolute -top-1 -right-1" />

            <span className="font-display text-3xl sm:text-4xl leading-none">
              KICKOFF
            </span>
          </div>

          <span className="font-display text-3xl sm:text-4xl leading-none bg-gradient-to-r from-accent via-yellow-300 to-orange-400 bg-clip-text text-transparent">
            2026
          </span>
        </div>

        <div className="h-[2px] w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r from-accent to-orange-400 mt-1 rounded-full" />
      </Link>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-2">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeProps={{
              className:
                "!text-white bg-white/10 border-white/15",
            }}
            activeOptions={{ exact: n.to === "/" }}
            className="
              relative
              px-5
              py-2.5
              rounded-full
              text-sm
              font-extrabold
              tracking-wide
              uppercase
              text-slate-400
              border
              border-transparent
              hover:text-white
              hover:bg-white/5
              hover:border-white/10
              transition-all
              duration-200
            "
          >
            {n.label}
          </Link>
        ))}

        {currentUser?.isAdmin && (
          <Link
            to="/admin"
            activeProps={{
              className:
                "!bg-accent !text-black border-accent",
            }}
            className="
              px-5
              py-2.5
              rounded-full
              text-sm
              font-extrabold
              uppercase
              tracking-wide
              text-slate-400
              border
              border-transparent
              hover:text-white
              hover:bg-white/5
              hover:border-white/10
              transition-all
              duration-200
            "
          >
            Admin
          </Link>
        )}
      </div>
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-3">
      {currentUser ? (
        <>
          {/* POINTS */}
          <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2">
            <div className="size-8 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 grid place-items-center">
              <Trophy className="size-4 text-black" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                Total Points
              </span>

              <span className="text-sm font-black text-white">
                {(myEntry?.points ?? 0).toLocaleString()} PTS
              </span>
            </div>
          </div>

          {/* USER */}
          <Link
            to="/dashboard"
            className="
              relative
              size-11
              rounded-full
              bg-gradient-to-br
              from-accent
              via-orange-400
              to-yellow-300
              p-[2px]
              hover:scale-105
              transition-transform
              duration-200
            "
          >
            <div className="size-full rounded-full bg-black grid place-items-center text-sm font-black text-white">
              {currentUser.avatar}
            </div>
          </Link>

          {/* LOGOUT */}
          <button
            onClick={() => {
              logout();
              router.navigate({ to: "/" });
            }}
            className="
              hidden
              sm:grid
              size-11
              place-items-center
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              text-slate-400
              hover:text-white
              hover:bg-red-500/10
              hover:border-red-500/30
              transition-all
              duration-200
            "
          >
            <LogOut className="size-4" />
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="
            relative
            overflow-hidden
            rounded-xl
            px-5
            py-3
            font-black
            text-xs
            uppercase
            tracking-[0.18em]
            text-black
            bg-gradient-to-r
            from-accent
            via-yellow-300
            to-orange-400
            hover:scale-[1.02]
            transition-transform
            duration-200
            flex
            items-center
            gap-2
          "
        >
          <UserIcon className="size-3.5" />
          Sign In
        </Link>
      )}

      {/* MOBILE MENU */}
      <button
        className="
          md:hidden
          size-11
          rounded-xl
          border
          border-white/10
          bg-white/[0.04]
          grid
          place-items-center
          text-white
        "
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </button>
    </div>
  </div>

  {/* MOBILE NAV */}
  {open && (
    <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="px-4 py-5 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className="
              px-4
              py-3
              rounded-2xl
              text-sm
              font-extrabold
              uppercase
              tracking-wide
              text-slate-300
              hover:bg-white/5
              transition-colors
            "
          >
            {n.label}
          </Link>
        ))}
      </div>
    </div>
  )}
</nav>

      {/* MAIN */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="relative mt-24 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#1e1b4b]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-12 items-start">
            {/* LEFT */}
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-display text-3xl sm:text-4xl font-black text-white">
                  KICKOFF
                </span>

                <span className="font-display text-3xl sm:text-4xl font-black bg-gradient-to-r from-accent via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  2026
                </span>
              </div>

              <p className="text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0">
                FIFA World Cup prediction platform built for football fans,
                competitive leaderboards, match analysis and community interaction.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href="https://saroj-football-predictor.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    rounded-full
                    border
                    border-accent/30
                    bg-accent/10
                    px-5
                    py-2.5
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-accent
                    hover:bg-accent/20
                    transition-all
                  "
                >
                  Open Predictor
                </a>
              </div>
            </div>

            {/* CENTER */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] uppercase tracking-[0.35em] text-slate-500 font-bold mb-5">
                About The Developer
              </span>

              <div className="relative mb-5">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full p-[3px] bg-gradient-to-br from-accent via-orange-400 to-yellow-300">
                  <img
                    src="/assets/Developer.png"
                    alt="Saroj Dhital"
                    draggable="false"
                    className="
                      h-full
                      w-full
                      rounded-full
                      object-cover
                      border-4
                      border-black
                    "
                  />
                </div>
              </div>

              <h3 className="text-xl font-black text-white">
                Saroj Dhital
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-sm">
                BCSIT student and frontend developer based in Kathmandu, Nepal.
                Building modern web applications using React, Next.js,
                JavaScript and PHP.
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center md:items-start lg:items-end gap-4">
              <span className="text-[11px] uppercase tracking-[0.35em] text-slate-500 font-bold">
                Connect
              </span>

              <div className="flex flex-col gap-3 w-full lg:items-end">
                <a
                  href="https://saroj-portfolio-website.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-full
                    sm:w-auto
                    justify-center
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-slate-300
                    hover:bg-white/[0.07]
                    hover:text-white
                    transition-all
                  "
                >
                  🌐 Portfolio
                </a>

                <a
                  href="https://github.com/Joras-Latihd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-full
                    sm:w-auto
                    justify-center
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-slate-300
                    hover:bg-white/[0.07]
                    hover:text-white
                    transition-all
                  "
                >
                  💻 GitHub
                </a>

                <a
                  href="https://www.linkedin.com/in/sarojdhital71/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-full
                    sm:w-auto
                    justify-center
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-slate-300
                    hover:bg-white/[0.07]
                    hover:text-white
                    transition-all
                  "
                >
                  🔗 LinkedIn
                </a>

                <a
                  href="mailto:sarojdhital71@gmail.com"
                  className="
                    w-full
                    sm:w-auto
                    justify-center
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-slate-300
                    hover:bg-white/[0.07]
                    hover:text-white
                    transition-all
                  "
                >
                  ✉ Email
                </a>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
            <span className="text-sm text-slate-500 font-medium">
              © {new Date().getFullYear()} Saroj Dhital. All rights reserved.
            </span>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-600 font-bold flex-wrap justify-center">
              <span>Football</span>
              <span>•</span>
              <span>Predictions</span>
              <span>•</span>
              <span>Community</span>
            </div>
          </div>
        </div>
      </footer>

      {/* TOASTER */}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15,15,15,0.94)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
            borderRadius: "16px",
            fontWeight: 700,
          },
        }}
      />
    </div>
  );
}