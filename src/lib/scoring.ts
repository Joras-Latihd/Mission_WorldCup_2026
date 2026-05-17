import type { Match, Prediction } from "./types";

/*
Scoring Rules:
- Exact score: 10 pts
- Correct goal difference + correct winner: 6 pts
- Correct winner only: 4 pts
- Draw predicted but wrong score: 4 pts
- Otherwise: 0 pts
*/

export function scorePrediction(
  p: Prediction,
  m: Match,
): number {
  if (
    m.status !== "finished" ||
    m.homeScore == null ||
    m.awayScore == null
  ) {
    return 0;
  }

  const pDiff = p.homeScore - p.awayScore;
  const mDiff = m.homeScore - m.awayScore;

  const pIsDraw = pDiff === 0;
  const mIsDraw = mDiff === 0;

  // 1. Exact score
  const isExact =
    p.homeScore === m.homeScore &&
    p.awayScore === m.awayScore;

  if (isExact) return 10;

  // 2. Exact goal difference (strong match)
  if (pDiff === mDiff) return 6;

  // 3. Same outcome type (win/loss/draw)
  const sameOutcome =
    (pDiff > 0 && mDiff > 0) ||
    (pDiff < 0 && mDiff < 0) ||
    (pIsDraw && mIsDraw);

  if (sameOutcome) return 4;

  return 0;
}

export function badgeForPoints(points: number): string {
  if (points >= 1000) return "🏆 Legend";
  if (points >= 500) return "⭐ Veteran";
  if (points >= 200) return "🔥 Hot Streak";
  if (points >= 50) return "⚽ Rookie";
  return "🆕 Newcomer";
}