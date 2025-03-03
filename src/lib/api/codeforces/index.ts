import axios from "axios";
import { persisted } from "svelte-persisted-store";
import { get } from "svelte/store";

export const codeforces = axios.create({
  baseURL: "https://codeforces.com/api/",
});

export type TProblemStatistic = {
  contestId: number;
  index: string;
  solvedCount: number;
};

export type TProblem = {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
  type: string;
};

export const getCodeForcesProblemSet = async (tagsString?: string[]) => {
  const searchParams = new URLSearchParams({
    tags: tagsString?.join(";") ?? "",
  });
  if (
    get(problemsUpdatedAt) &&
    +new Date() - +new Date(get(problemsUpdatedAt)) < 1000 * 60
  )
    return;
  const { problems: iproblems, problemStats: iproblemstats } = await codeforces
    .get<{
      status: string;
      result: {
        problemStatistics: TProblemStatistic[];
        problems: TProblem[];
      };
    }>(`problemset.problems?${searchParams.toString()}`)
    .then(
      ({
        data: {
          result: { problems, problemStatistics: problemStats },
        },
      }) => ({
        problems,
        problemStats,
      })
    );
  tags.set([
    ...new Set<string>(
      iproblems.reduce<string[]>((set, p) => [...set, ...p.tags], [])
    ),
  ]);
  problems.set(iproblems);
  problemStats.set(iproblemstats);
  problemsUpdatedAt.set(new Date().toISOString());
  return problems;
};

export const tags = persisted<string[]>("codeforces.tags", []);
export const problems = persisted<TProblem[]>("codeforces.problems", []);
export const problemStats = persisted<TProblemStatistic[]>(
  "codeforces.problems-stats",
  []
);
export const problemsUpdatedAt = persisted<string>(
  "codeforces.problems-updatedat",
  ""
);
