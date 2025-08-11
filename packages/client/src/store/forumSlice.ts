import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Topic, Comment } from '@/types';
import {
  getTopics,
  saveTopic,
  getTopicById,
  getCommentsByTopicId,
  saveComment,
  initializeSampleData,
} from '@/utils/forumStorage';

interface ForumState {
  topics: Topic[];
  comments: Comment[];
  currentTopic: Topic | null;
  currentTopicComments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: ForumState = {
  topics: [],
  comments: [],
  currentTopic: null,
  currentTopicComments: [],
  loading: false,
  error: null,
};

// Async Thunks
export const loadTopics = createAsyncThunk('forum/loadTopics', async () => {
  initializeSampleData();
  return getTopics();
});

export const loadTopicById = createAsyncThunk('forum/loadTopicById', async (topicId: string) => {
  const topic = getTopicById(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }
  const comments = getCommentsByTopicId(topicId);
  return { topic, comments };
});

export const createTopic = createAsyncThunk(
  'forum/createTopic',
  async (topicData: Omit<Topic, 'id' | 'createdAt' | 'commentsCount'>) => {
    return saveTopic(topicData);
  }
);

export const addComment = createAsyncThunk(
  'forum/addComment',
  async (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment = saveComment(commentData);

    // Update topics array to reflect new comment count
    const updatedTopics = getTopics();

    return { comment: newComment, updatedTopics };
  }
);

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    clearCurrentTopic: (state) => {
      state.currentTopic = null;
      state.currentTopicComments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Topics
      .addCase(loadTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTopics.fulfilled, (state, action: PayloadAction<Topic[]>) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(loadTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load topics';
      })

      // Load Topic by ID
      .addCase(loadTopicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTopicById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTopic = action.payload.topic;
        state.currentTopicComments = action.payload.comments;
      })
      .addCase(loadTopicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load topic';
      })

      // Create Topic
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
        state.loading = false;
        state.topics.unshift(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create topic';
      })

      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const { comment, updatedTopics } = action.payload;

        // Add comment to current topic comments
        state.currentTopicComments.push(comment);

        // Update topics array with new comment counts
        state.topics = updatedTopics;

        // Update current topic comment count if it's loaded
        if (state.currentTopic && state.currentTopic.id === comment.topicId) {
          state.currentTopic.commentsCount = state.currentTopicComments.length;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add comment';
      });
  },
});

export const { clearCurrentTopic, clearError } = forumSlice.actions;
export default forumSlice.reducer;

// Selectors
export const selectTopics = (state: { forum: ForumState }) => state.forum.topics;
export const selectCurrentTopic = (state: { forum: ForumState }) => state.forum.currentTopic;
export const selectCurrentTopicComments = (state: { forum: ForumState }) => state.forum.currentTopicComments;
export const selectForumLoading = (state: { forum: ForumState }) => state.forum.loading;
export const selectForumError = (state: { forum: ForumState }) => state.forum.error;
