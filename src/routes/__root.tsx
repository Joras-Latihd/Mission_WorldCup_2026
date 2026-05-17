import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  HeadContent,
  Scripts,
  useRouter,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/Layout";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pitch-black px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35))]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="mb-3 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
          404 Error
        </div>

        <h1 className="font-display text-7xl font-black tracking-tighter text-white sm:text-8xl">
          404
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Off the pitch - this page doesn&apos;t exist or may have been moved.
        </p>

        <div className="mt-7">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-accent
              px-6
              py-3
              text-xs
              font-black
              uppercase
              tracking-[0.22em]
              text-pitch-black
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pitch-black px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35))]" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="mb-3 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-red-400">
          Application Error
        </div>

        <h1 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          An unexpected error occurred while rendering this page.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-left">
          <code className="block overflow-x-auto text-xs leading-relaxed text-red-300">
            {error.message || "Unknown error"}
          </code>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-accent
              px-5
              py-3
              text-xs
              font-black
              uppercase
              tracking-[0.22em]
              text-pitch-black
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >
            Try Again
          </button>

          <Link
            to="/"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              px-5
              py-3
              text-xs
              font-black
              uppercase
              tracking-[0.22em]
              text-white
              transition-all
              duration-300
              hover:border-white/20
              hover:bg-white/[0.05]
            "
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "KickOff 2026 - World Cup Prediction League",
      },
      {
        name: "description",
        content:
          "Predict every World Cup 2026 match, climb the leaderboard, and compete with friends.",
      },
      {
        property: "og:title",
        content: "KickOff 2026 - World Cup Prediction League",
      },
      {
        property: "og:description",
        content:
          "Predict every World Cup 2026 match. Track scores, rankings, and community picks.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "theme-color",
        content: "#050505",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,700;0,900;1,400;1,900&family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,

  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>

      <body className="bg-pitch-black text-white antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Layout />
      </AppProvider>
    </QueryClientProvider>
  );
}