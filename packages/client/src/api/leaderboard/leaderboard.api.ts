import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  TopScoresResponse,
  LeaderboardQuery,
  PaginatedLeaderboardResponse,
  LeaderboardAllRequest,
  LeaderboardAllResponse,
  LeaderboardAddRequest,
} from './leaderboard.dto';
import { baseQueryWithAuth } from '@/api/baseQuery';

const TEAM_NAME = 'undefined';
const RATING_FIELD = 'undefinedScore';

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getTopScores: builder.mutation<TopScoresResponse, void>({
      query: () => ({
        url: `/leaderboard/${TEAM_NAME}`,
        method: 'POST',
        body: {
          ratingFieldName: RATING_FIELD,
          cursor: 0,
          limit: 3,
        },
      }),
      transformResponse: (response: LeaderboardAllResponse) => {
        const sorted = [...response]
          .map((item) => ({ score: Number(item.data.undefinedScore ?? 0) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        return sorted.map((s, idx) => ({
          score: s.score,
          scoreDescription: idx === 0 ? 'Highest Score' : `Top ${idx + 1}`,
        }));
      },
    }),

    getLeaderboard: builder.mutation<PaginatedLeaderboardResponse, LeaderboardQuery>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/leaderboard/${TEAM_NAME}`,
        method: 'POST',
        body: {
          ratingFieldName: RATING_FIELD,
          cursor: (page - 1) * limit,
          limit,
        } as LeaderboardAllRequest,
      }),
      transformResponse: (response: LeaderboardAllResponse, _meta, arg) => {
        const page = arg?.page ?? 1;
        const limit = arg?.limit ?? 10;
        const search = (arg?.search ?? '').trim().toLowerCase();
        const cursor = (page - 1) * limit;

        const mapped = response
          .map((item, idx) => {
            const data = item.data;
            const score = Number(data.undefinedScore ?? 0);
            const name = data.undefinedName || 'Anonymous';
            const idRaw = cursor + idx + 1;
            return { id: String(idRaw), name, score };
          })
          .sort((a, b) => b.score - a.score)
          .map((item, index) => ({ ...item, rank: cursor + index + 1 }));

        const filtered = search ? mapped.filter((p) => p.name.toLowerCase().includes(search)) : mapped;
        const baseTotal = cursor + response.length;
        const total = search ? filtered.length : baseTotal;
        const totalPages = search ? (filtered.length > 0 ? 1 : 0) : response.length === limit ? page + 1 : page;

        return {
          data: filtered,
          total,
          page,
          limit,
          totalPages,
        } as PaginatedLeaderboardResponse;
      },
    }),

    submitScore: builder.mutation<unknown, LeaderboardAddRequest>({
      query: ({ data }) => ({
        url: '/leaderboard',
        method: 'POST',
        body: {
          ratingFieldName: RATING_FIELD,
          teamName: TEAM_NAME,
          data,
        },
      }),
    }),
  }),
});

export const { useGetTopScoresMutation, useGetLeaderboardMutation, useSubmitScoreMutation } = leaderboardApi;
