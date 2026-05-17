import type { Team } from "@/lib/types";

const BALL = "⚽";

export const TEAMS: Record<string, Team> = {
  USA: { code: "USA", name: "United States", flag: BALL, group: "A" },
  MEX: { code: "MEX", name: "Mexico", flag: BALL, group: "A" },
  CAN: { code: "CAN", name: "Canada", flag: BALL, group: "B" },
  ARG: { code: "ARG", name: "Argentina", flag: BALL, group: "C" },
  BRA: { code: "BRA", name: "Brazil", flag: BALL, group: "D" },
  FRA: { code: "FRA", name: "France", flag: BALL, group: "E" },
  ENG: { code: "ENG", name: "England", flag: BALL, group: "F" },
  ESP: { code: "ESP", name: "Spain", flag: BALL, group: "G" },
  GER: { code: "GER", name: "Germany", flag: BALL, group: "H" },
  POR: { code: "POR", name: "Portugal", flag: BALL, group: "B" },
  NED: { code: "NED", name: "Netherlands", flag: BALL, group: "C" },
  ITA: { code: "ITA", name: "Italy", flag: BALL, group: "D" },
  BEL: { code: "BEL", name: "Belgium", flag: BALL, group: "E" },
  CRO: { code: "CRO", name: "Croatia", flag: BALL, group: "F" },
  URU: { code: "URU", name: "Uruguay", flag: BALL, group: "G" },
  JPN: { code: "JPN", name: "Japan", flag: BALL, group: "H" },
  KOR: { code: "KOR", name: "South Korea", flag: BALL, group: "A" },
  MAR: { code: "MAR", name: "Morocco", flag: BALL, group: "B" },
  SEN: { code: "SEN", name: "Senegal", flag: BALL, group: "C" },
  AUS: { code: "AUS", name: "Australia", flag: BALL, group: "D" },
  COL: { code: "COL", name: "Colombia", flag: BALL, group: "E" },
  DEN: { code: "DEN", name: "Denmark", flag: BALL, group: "F" },
  SUI: { code: "SUI", name: "Switzerland", flag: BALL, group: "G" },
  POL: { code: "POL", name: "Poland", flag: BALL, group: "H" },
};

export const getTeam = (code: string): Team =>
  TEAMS[code] ?? {
    code,
    name: code,
    flag: BALL,
    group: "",
  };