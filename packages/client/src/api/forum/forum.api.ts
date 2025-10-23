import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  Topic,
  TopicCreateRequest,
  TopicUpdateRequest,
  TopicQuery,
  TopicListResponse,
  Comment,
  CommentCreateRequest,
  CommentUpdateRequest,
  CommentQuery,
  CommentListResponse,
  ReactionSetRequest,
  ReactionResponse,
} from './forum.dto';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Forum API использует локальный сервер
// Используем относительный путь для работы через Vite proxy (dev) и nginx proxy (prod)
const forumBaseQuery = fetchBaseQuery({
  baseUrl: '/api', // Относительный путь - проксируется на сервер
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Cache-Control', 'no-cache');
    headers.set('Pragma', 'no-cache');
    return headers;
  },
});

export const forumApi = createApi({
  reducerPath: 'forumApi',
  baseQuery: forumBaseQuery,
  tagTypes: ['Topic', 'Comment', 'Reaction'],
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Topics endpoints
    getTopics: builder.query<TopicListResponse, TopicQuery>({
      query: ({ limit = 20, offset = 0, query = '' } = {}) => ({
        url: '/topics',
        params: { limit, offset, query },
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'Topic' as const, id })), { type: 'Topic', id: 'LIST' }]
          : [{ type: 'Topic', id: 'LIST' }],
    }),

    getTopic: builder.query<Topic, number>({
      query: (id) => `/topics/${id}`,
      providesTags: (result, error, id) => [{ type: 'Topic', id }],
    }),

    createTopic: builder.mutation<Topic, TopicCreateRequest>({
      query: (body) => ({
        url: '/topics',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Topic', id: 'LIST' }],
    }),

    updateTopic: builder.mutation<Topic, { id: number; data: TopicUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/topics/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Topic', id },
        { type: 'Topic', id: 'LIST' },
      ],
    }),

    deleteTopic: builder.mutation<void, number>({
      query: (id) => ({
        url: `/topics/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Topic', id },
        { type: 'Topic', id: 'LIST' },
      ],
    }),

    // Comments endpoints
    getCommentsByTopic: builder.query<CommentListResponse, { topicId: number } & CommentQuery>({
      query: ({ topicId, limit = 20, offset = 0 }) => ({
        url: `/comments/by-topic/${topicId}`,
        params: { limit, offset },
      }),
      providesTags: (result, error, { topicId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment', id: `TOPIC_${topicId}` },
            ]
          : [{ type: 'Comment', id: `TOPIC_${topicId}` }],
    }),

    getCommentReplies: builder.query<CommentListResponse, { commentId: number } & CommentQuery>({
      query: ({ commentId, limit = 20, offset = 0 }) => ({
        url: `/comments/${commentId}/replies`,
        params: { limit, offset },
      }),
      providesTags: (result, error, { commentId }) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'Comment', id: `REPLIES_${commentId}` },
            ]
          : [{ type: 'Comment', id: `REPLIES_${commentId}` }],
    }),

    createComment: builder.mutation<Comment, { topicId: number; data: CommentCreateRequest }>({
      query: ({ topicId, data }) => ({
        url: `/comments/by-topic/${topicId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { topicId }) => [
        { type: 'Comment', id: `TOPIC_${topicId}` },
        { type: 'Topic', id: topicId },
      ],
    }),

    updateComment: builder.mutation<Comment, { id: number; data: CommentUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    deleteComment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    // Reactions endpoints
    getReactions: builder.query<ReactionResponse, number>({
      query: (commentId) => `/reactions/${commentId}`,
      providesTags: (result, error, commentId) => [{ type: 'Reaction', id: `COMMENT_${commentId}` }],
    }),

    setReaction: builder.mutation<void, { commentId: number; data: ReactionSetRequest }>({
      query: ({ commentId, data }) => ({
        url: `/reactions/${commentId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { commentId }) => [{ type: 'Reaction', id: `COMMENT_${commentId}` }],
    }),

    removeReaction: builder.mutation<void, number>({
      query: (commentId) => ({
        url: `/reactions/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, commentId) => [{ type: 'Reaction', id: `COMMENT_${commentId}` }],
    }),
  }),
});

export const {
  // Topics
  useGetTopicsQuery,
  useGetTopicQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  // Comments
  useGetCommentsByTopicQuery,
  useGetCommentRepliesQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  // Reactions
  useGetReactionsQuery,
  useSetReactionMutation,
  useRemoveReactionMutation,
} = forumApi;
