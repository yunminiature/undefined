export interface TopScore {
  score: number;
  scoreDescription: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
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

export interface LeaderboardAddRequest {
  data: LeaderboardData;
}

export interface LeaderboardAllRequest {
  ratingFieldName: string;
  cursor: number;
  limit: number;
  teamName?: string;
}

export interface LeaderboardData {
  undefinedName: string;
  undefinedScore: number;
}

export interface LeaderboardItem {
  data: LeaderboardData;
}

export type LeaderboardAllResponse = LeaderboardItem[];

export type TopScoresResponse = TopScore[];
export type LeaderboardResponse = LeaderboardEntry[];
