export type ISODateString = string;

export type MatchStatus =
  | "scheduled"
  | "live"
  | "finished";

export type MatchStage =
  | "Group"
  | "R16"
  | "QF"
  | "SF"
  | "Final"
  | "3rd";

export interface Team {
  code: string;
  name: string;
  flag: string;
  group?: string;
}

export interface Match {
  id: string;

  homeCode: string;
  awayCode: string;

  kickoff: ISODateString;

  stadium: string;
  city: string;

  group: string;
  stage: MatchStage;

  status: MatchStatus;

  homeScore: number | null;
  awayScore: number | null;

  watchUrl?: string | null;
}

export interface User {
  id: string;

  username: string;
  email: string;

  password: string;

  avatar: string;

  isAdmin?: boolean;

  createdAt: ISODateString;
}

export interface Prediction {
  id: string;

  userId: string;
  matchId: string;

  homeScore: number;
  awayScore: number;

  points: number;

  createdAt: ISODateString;

  /*
    NEW
    Allows admin-entered predictions
  */
  addedByAdmin?: boolean;
}

export interface Comment {
  id: string;

  matchId: string;
  userId: string;

  username: string;
  text: string;

  createdAt: ISODateString;
}

export interface LeaderboardEntry {
  user: User;
  points: number;
  correct: number;
  total: number;
  accuracy: number;
}

export interface MatchResult {
  home: number;
  away: number;
}

export type PredictionOutcome =
  | "exact"
  | "difference"
  | "winner"
  | "wrong";

export interface AdminPredictionInput {
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
}