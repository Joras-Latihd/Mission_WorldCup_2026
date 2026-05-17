/* =========================================================
   LOCAL STORAGE HELPERS
========================================================= */

export const STORAGE_KEYS = {
  users: "kickoff2026_users",

  session: "kickoff2026_session",

  predictions: "kickoff2026_predictions",

  comments: "kickoff2026_comments",

  matchOverrides: "kickoff2026_match_overrides",

  adminPredictions: "kickoff2026_admin_predictions",

  predictionStats: "kickoff2026_prediction_stats",

  leaderboard: "kickoff2026_leaderboard",

  achievements: "kickoff2026_achievements",

  notifications: "kickoff2026_notifications",

  coins: "kickoff2026_coins",

  streaks: "kickoff2026_streaks",

  matchChats: "kickoff2026_match_chats",

  reactions: "kickoff2026_reactions",

  polls: "kickoff2026_polls",

  settings: "kickoff2026_settings",

  bookmarks: "kickoff2026_bookmarks",

  hiddenSections: "kickoff2026_hidden_sections",

  featuredPredictions:
    "kickoff2026_featured_predictions",

  trendingPredictions:
    "kickoff2026_trending_predictions",
} as const;

/* =========================================================
   GENERIC GET
========================================================= */

export function lsGet<T>(
  key: string,
  fallback: T,
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw =
      localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(
      "localStorage GET error:",
      key,
      err,
    );

    return fallback;
  }
}

/* =========================================================
   GENERIC SET
========================================================= */

export function lsSet(
  key: string,
  value: unknown,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (
      value === undefined ||
      value === null
    ) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch (err) {
    console.error(
      "localStorage SET error:",
      key,
      err,
    );
  }
}

/* =========================================================
   REMOVE SINGLE KEY
========================================================= */

export function lsRemove(
  key: string,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(
      "localStorage REMOVE error:",
      key,
      err,
    );
  }
}

/* =========================================================
   CLEAR APP STORAGE ONLY
========================================================= */

export function clearKickoffStorage() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    Object.values(
      STORAGE_KEYS,
    ).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (err) {
    console.error(
      "localStorage CLEAR error:",
      err,
    );
  }
}