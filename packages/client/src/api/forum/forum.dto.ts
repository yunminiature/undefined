export interface Topic {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  authorId: string; // Изменено: теперь просто ID автора
  author?: {
    // Опциональный полный объект автора (если понадобится позже)
    id: number;
    login: string;
    first_name: string;
    second_name: string;
    display_name?: string;
    avatar?: string;
    email: string;
  };
  commentsCount?: number;
}

export interface TopicCreateRequest {
  title: string;
  body: string;
}

export interface TopicUpdateRequest {
  title?: string;
  body?: string;
}

export interface TopicQuery {
  limit?: number;
  offset?: number;
  query?: string;
}

export interface TopicListResponse {
  data: Topic[];
  total: number;
  hasMore: boolean;
}

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  authorId: string; // Изменено: теперь просто ID автора
  author?: {
    // Опциональный полный объект автора
    id: number;
    login: string;
    first_name: string;
    second_name: string;
    display_name?: string;
    avatar?: string;
    email: string;
  };
  topicId: number;
  parentId?: number;
  reactions?: Reaction[];
}

export interface CommentCreateRequest {
  body: string;
  parentId?: number;
}

export interface CommentUpdateRequest {
  body: string;
}

export interface CommentQuery {
  limit?: number;
  offset?: number;
}

export interface CommentListResponse {
  data: Comment[];
  total: number;
  hasMore: boolean;
}

export interface Reaction {
  id: number;
  emoji: string;
  userId: number;
  commentId: number;
  createdAt: string;
}

export interface ReactionSetRequest {
  emoji: string;
}

export interface ReactionResponse {
  reactions: Reaction[];
  userReactions: Reaction[];
}

export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
}
