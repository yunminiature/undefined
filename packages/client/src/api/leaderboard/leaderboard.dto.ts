export interface TopScore {
  score: number;
  scoreDescription: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar?: string;
}

export interface LeaderboardQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedLeaderboardResponse {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TopScoresResponse = TopScore[];
export type LeaderboardResponse = LeaderboardEntry[];
