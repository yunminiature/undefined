import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  TopScoresResponse,
  LeaderboardResponse,
  LeaderboardQuery,
  PaginatedLeaderboardResponse,
} from './leaderboard.dto';
import { baseQueryWithAuth } from '@/api/baseQuery';

const mockTopScores: TopScoresResponse = [
  { score: 15420, scoreDescription: 'Highest Score' },
  { score: 12350, scoreDescription: 'This Week' },
  { score: 8930, scoreDescription: 'This Month' },
];

const generateMockLeaderboard = (): LeaderboardResponse => {
  const firstNames = [
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Ethan',
    'Fiona',
    'George',
    'Helen',
    'Ivan',
    'Julia',
    'Kevin',
    'Luna',
    'Mike',
    'Nina',
    'Oscar',
    'Paula',
    'Quinn',
    'Rachel',
    'Steve',
    'Tina',
  ];
  const lastNames = [
    'Johnson',
    'Smith',
    'Brown',
    'Prince',
    'Hunt',
    'Green',
    'Miller',
    'Troy',
    'Petrov',
    'Roberts',
    'Wilson',
    'Davis',
    'Garcia',
    'Martinez',
    'Anderson',
    'Taylor',
    'Thomas',
    'Hernandez',
    'Moore',
    'Martin',
  ];

  const players = [];
  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName} ${i}`;
    const score = Math.max(1000, 16000 - i * 150 + Math.floor(Math.random() * 200));

    players.push({
      id: i.toString(),
      name,
      score,
      rank: i,
      avatar: undefined,
    });
  }
  return players;
};

const mockLeaderboard = generateMockLeaderboard();

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getTopScores: builder.query<TopScoresResponse, void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: mockTopScores };
      },
    }),
    getLeaderboard: builder.query<PaginatedLeaderboardResponse, LeaderboardQuery>({
      queryFn: async ({ page = 1, limit = 10, search = '' }) => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        let filteredData = mockLeaderboard;
        if (search.trim()) {
          filteredData = mockLeaderboard.filter((player) => player.name.toLowerCase().includes(search.toLowerCase()));
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredData.length / limit);

        return {
          data: {
            data: paginatedData,
            total: filteredData.length,
            page,
            limit,
            totalPages,
          },
        };
      },
    }),
  }),
});

export const { useGetTopScoresQuery, useGetLeaderboardQuery } = leaderboardApi;
