import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { MATCHES } from "@/lib/data/matches";

import type {
  Comment,
  Match,
  Prediction,
  User,
  AdminPredictionInput,
} from "@/lib/types";

import { lsGet, lsSet, STORAGE_KEYS } from "@/lib/storage";

import { scorePrediction } from "@/lib/scoring";

const DEMO_USERS: User[] = [
  {
    id: "u-admin",
    username: "admin",
    email: "admin@kickoff2026.app",
    password: "admin123",
    avatar: "AD",
    isAdmin: true,
    createdAt: new Date(0).toISOString(),
  },

  {
    id: "u-saroj",
    username: "Saroj Dhital",
    email: "saroj@demo.com",
    password: "demo123",
    avatar: "SA",
    createdAt: new Date(0).toISOString(),
  },

  {
    id: "u-rijan",
    username: "Rijan Maharjan",
    email: "rijan@demo.com",
    password: "demo123",
    avatar: "RI",
    createdAt: new Date(0).toISOString(),
  },

  {
    id: "u-rahul",
    username: "Rahul Adhikari",
    email: "rahul@demo.com",
    password: "demo123",
    avatar: "RA",
    createdAt: new Date(0).toISOString(),
  },

  {
    id: "u-aashish",
    username: "Aashish Pokhrel",
    email: "aashish@demo.com",
    password: "demo123",
    avatar: "AP",
    createdAt: new Date(0).toISOString(),
  },

  {
    id: "u-anup",
    username: "Anup Aryal",
    email: "anup@demo.com",
    password: "demo123",
    avatar: "AA",
    createdAt: new Date(0).toISOString(),
  },

  {
    id: "u-durgesh",
    username: "Durgesh Dhakal",
    email: "durgesh@demo.com",
    password: "demo123",
    avatar: "DD",
    createdAt: new Date(0).toISOString(),
  },
];

type MatchOverride = Partial<
  Pick<
    Match,
    "homeScore" | "awayScore" | "status" | "watchUrl" | "kickoff"
  >
>;

interface AppContextValue {
  currentUser: User | null;

  users: User[];

  login: (
    email: string,
    password: string,
  ) => User | null;

  register: (
    username: string,
    email: string,
    password: string,
  ) => User | { error: string };

  logout: () => void;

  matches: Match[];

  getMatch: (
    id: string,
  ) => Match | undefined;

  updateMatch: (
    id: string,
    override: MatchOverride,
  ) => void;

  predictions: Prediction[];

  submitPrediction: (
    matchId: string,
    home: number,
    away: number,
  ) => void;

  submitPredictionAsAdmin: (
    input: AdminPredictionInput,
  ) => void;

  getUserPredictionForMatch: (
    userId: string,
    matchId: string,
  ) => Prediction | undefined;

  getCommunityPercentages: (
    matchId: string,
  ) => {
    home: number;
    draw: number;
    away: number;
    count: number;
  };

  comments: Comment[];

  addComment: (
    matchId: string,
    text: string,
  ) => void;

  leaderboard: Array<{
    user: User;
    points: number;
    correct: number;
    total: number;
    accuracy: number;
  }>;
}

const AppContext =
  createContext<AppContextValue | null>(
    null,
  );

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [users, setUsers] = useState<User[]>(
    [],
  );

  const [predictions, setPredictions] =
    useState<Prediction[]>([]);

  const [comments, setComments] =
    useState<Comment[]>([]);

  const [overrides, setOverrides] =
    useState<Record<string, MatchOverride>>(
      {},
    );

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [hydrated, setHydrated] =
    useState(false);

  /* HYDRATION */

  useEffect(() => {
    const storedUsers = lsGet<User[]>(
      STORAGE_KEYS.users,
      [],
    );

    const merged = [...DEMO_USERS];

    for (const u of storedUsers) {
      if (
        !merged.some(
          (m) => m.email === u.email,
        )
      ) {
        merged.push(u);
      }
    }

    setUsers(merged);

    setPredictions(
      lsGet(STORAGE_KEYS.predictions, []),
    );

    setComments(
      lsGet(STORAGE_KEYS.comments, []),
    );

    setOverrides(
      lsGet(STORAGE_KEYS.matchOverrides, {}),
    );

    const sessionId = lsGet<string | null>(
      STORAGE_KEYS.session,
      null,
    );

    if (sessionId) {
      const u = merged.find(
        (x) => x.id === sessionId,
      );

      if (u) {
        setCurrentUser(u);
      }
    }

    setHydrated(true);
  }, []);

  /* MATCHES */

  const baseMatches = MATCHES;

  const matches = useMemo(() => {
    return baseMatches.map((m) =>
      overrides[m.id]
        ? {
            ...m,
            ...overrides[m.id],
          }
        : m,
    );
  }, [baseMatches, overrides]);

  const matchMap = useMemo(() => {
    const map = new Map<
      string,
      Match
    >();

    for (const m of matches) {
      map.set(m.id, m);
    }

    return map;
  }, [matches]);

  const getMatch = useCallback(
    (id: string) => {
      return matchMap.get(id);
    },
    [matchMap],
  );

  /* STORAGE */

  useEffect(() => {
    if (!hydrated) return;

    const customOnly = users.filter(
      (u) =>
        !DEMO_USERS.some(
          (d) => d.id === u.id,
        ),
    );

    lsSet(
      STORAGE_KEYS.users,
      customOnly,
    );
  }, [users, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    lsSet(
      STORAGE_KEYS.predictions,
      predictions,
    );
  }, [predictions, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    lsSet(
      STORAGE_KEYS.comments,
      comments,
    );
  }, [comments, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    lsSet(
      STORAGE_KEYS.matchOverrides,
      overrides,
    );
  }, [overrides, hydrated]);

  /* AUTH */

  const login = useCallback(
    (
      email: string,
      password: string,
    ) => {
      const u = users.find(
        (x) =>
          x.email.toLowerCase() ===
            email.toLowerCase() &&
          x.password === password,
      );

      if (u) {
        setCurrentUser(u);

        lsSet(
          STORAGE_KEYS.session,
          u.id,
        );

        return u;
      }

      return null;
    },
    [users],
  );

  const register = useCallback(
    (
      username: string,
      email: string,
      password: string,
    ) => {
      if (
        users.some(
          (u) =>
            u.email.toLowerCase() ===
            email.toLowerCase(),
        )
      ) {
        return {
          error: "Email already in use",
        };
      }

      const user: User = {
        id: "u-" + crypto.randomUUID(),
        username,
        email,
        password,
        avatar: username
          .slice(0, 2)
          .toUpperCase(),
        createdAt:
          new Date().toISOString(),
      };

      setUsers((p) => [...p, user]);

      setCurrentUser(user);

      lsSet(
        STORAGE_KEYS.session,
        user.id,
      );

      return user;
    },
    [users],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);

    lsSet(
      STORAGE_KEYS.session,
      null,
    );
  }, []);

  /* PREDICTIONS */

  const submitPrediction =
    useCallback(
      (
        matchId: string,
        home: number,
        away: number,
      ) => {
        if (!currentUser) return;

        const match =
          matchMap.get(matchId);

        if (!match) return;

        if (
          Date.now() >=
            new Date(
              match.kickoff,
            ).getTime() ||
          match.status !== "scheduled"
        ) {
          return;
        }

        setPredictions((prev) => {
          const filtered = prev.filter(
            (p) =>
              !(
                p.userId ===
                  currentUser.id &&
                p.matchId === matchId
              ),
          );

          const prediction: Prediction =
            {
              id:
                "p-" +
                crypto.randomUUID(),

              userId: currentUser.id,

              matchId,

              homeScore: home,

              awayScore: away,

              points: 0,

              createdAt:
                new Date().toISOString(),
            };

          return [
            ...filtered,
            prediction,
          ];
        });
      },
      [currentUser, matchMap],
    );

  const submitPredictionAsAdmin =
    useCallback(
      (
        input: AdminPredictionInput,
      ) => {
        const match = matchMap.get(
          input.matchId,
        );

        if (!match) return;

        setPredictions((prev) => {
          const filtered = prev.filter(
            (p) =>
              !(
                p.userId ===
                  input.userId &&
                p.matchId ===
                  input.matchId
              ),
          );

          const prediction: Prediction =
            {
              id:
                "p-" +
                crypto.randomUUID(),

              userId: input.userId,

              matchId: input.matchId,

              homeScore:
                input.homeScore,

              awayScore:
                input.awayScore,

              points: 0,

              createdAt:
                new Date().toISOString(),
            };

          return [
            ...filtered,
            prediction,
          ];
        });
      },
      [matchMap],
    );

  const getUserPredictionForMatch =
    useCallback(
      (
        userId: string,
        matchId: string,
      ) => {
        return predictions.find(
          (p) =>
            p.userId === userId &&
            p.matchId === matchId,
        );
      },
      [predictions],
    );

  const getCommunityPercentages =
    useCallback(
      (matchId: string) => {
        const ps = predictions.filter(
          (p) =>
            p.matchId === matchId,
        );

        const total = ps.length;

        if (!total) {
          return {
            home: 0,
            draw: 0,
            away: 0,
            count: 0,
          };
        }

        let h = 0;
        let d = 0;
        let a = 0;

        for (const p of ps) {
          if (
            p.homeScore >
            p.awayScore
          ) {
            h++;
          } else if (
            p.homeScore <
            p.awayScore
          ) {
            a++;
          } else {
            d++;
          }
        }

        return {
          home: Math.round(
            (h / total) * 100,
          ),

          draw: Math.round(
            (d / total) * 100,
          ),

          away: Math.round(
            (a / total) * 100,
          ),

          count: total,
        };
      },
      [predictions],
    );

  /* COMMENTS */

  const addComment = useCallback(
    (
      matchId: string,
      text: string,
    ) => {
      if (
        !currentUser ||
        !text.trim()
      ) {
        return;
      }

      const comment: Comment = {
        id:
          "c-" +
          crypto.randomUUID(),

        matchId,

        userId: currentUser.id,

        username:
          currentUser.username,

        text: text.trim(),

        createdAt:
          new Date().toISOString(),
      };

      setComments((p) => [
        ...p,
        comment,
      ]);
    },
    [currentUser],
  );

  /* LEADERBOARD */

  const leaderboard = useMemo(() => {
    return users
      .map((user) => {
        const userPreds =
          predictions.filter(
            (p) =>
              p.userId === user.id,
          );

        let points = 0;
        let correct = 0;
        let total = 0;

        for (const p of userPreds) {
          const match =
            matchMap.get(p.matchId);

          if (
            !match ||
            match.status !==
              "finished"
          ) {
            continue;
          }

          total++;

          const pts =
            scorePrediction(
              p,
              match,
            );

          points += pts;

          if (pts > 0) {
            correct++;
          }
        }

        return {
          user,
          points,
          correct,
          total,

          accuracy: total
            ? Math.round(
                (correct / total) *
                  100,
              )
            : 0,
        };
      })
      .filter(
        (x) => !x.user.isAdmin,
      )
      .sort(
        (a, b) =>
          b.points - a.points ||
          b.accuracy - a.accuracy,
      );
  }, [users, predictions, matchMap]);

  const value: AppContextValue = {
    currentUser,

    users,

    login,

    register,

    logout,

    matches,

    getMatch,

    updateMatch: (
      id,
      override,
    ) =>
      setOverrides((p) => ({
        ...p,

        [id]: {
          ...p[id],
          ...override,
        },
      })),

    predictions,

    submitPrediction,

    submitPredictionAsAdmin,

    getUserPredictionForMatch,

    getCommunityPercentages,

    comments,

    addComment,

    leaderboard,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx =
    useContext(AppContext);

  if (!ctx) {
    throw new Error(
      "useApp must be used within AppProvider",
    );
  }

  return ctx;
}