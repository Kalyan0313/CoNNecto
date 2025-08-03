import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/posts');
      // Handle new API response format
      const postsData = response.data.data?.posts || response.data.data || response.data;
      return Array.isArray(postsData) ? postsData : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/posts', postData);
      const newPostData = response.data.data || response.data;
      return newPostData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const response = await api.put(`/api/posts/${postId}/like`);
      return {
        postId,
        liked: response.data.data.liked,
        likesCount: response.data.data.likesCount,
        updatedPost: response.data.data.post
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(`/api/posts/${postId}/comments`, { content });
      return {
        postId,
        comment: response.data.data.comment,
        commentsCount: response.data.data.commentsCount
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/posts/${postId}/comments/${commentId}`);
      return { 
        postId, 
        commentId,
        commentsCount: response.data.data?.commentsCount || 0
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const initialState = {
  posts: [],
  loading: false,
  error: null,
  creating: false,
  liking: false,
  commenting: false,
  optimisticLikes: {}, // Track optimistic like updates
  optimisticComments: {}, // Track optimistic comment updates
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPosts: (state) => {
      state.posts = [];
    },
    // Optimistic like update
    optimisticLike: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
          post.likes = post.likes.filter(id => id !== userId);
        } else {
          post.likes.push(userId);
        }
        state.optimisticLikes[postId] = { userId, isLiked: !isLiked };
      }
    },
    // Revert optimistic like update
    revertOptimisticLike: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        const optimisticUpdate = state.optimisticLikes[postId];
        if (optimisticUpdate && optimisticUpdate.userId === userId) {
          if (optimisticUpdate.isLiked) {
            post.likes = post.likes.filter(id => id !== userId);
          } else {
            post.likes.push(userId);
          }
        }
        delete state.optimisticLikes[postId];
      }
    },
    // Optimistic comment update
    optimisticAddComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.comments.push(comment);
        state.optimisticComments[postId] = {
          type: 'add',
          commentId: comment._id
        };
      }
    },
    // Revert optimistic comment update
    revertOptimisticComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.comments = post.comments.filter(c => c._id !== commentId);
        delete state.optimisticComments[postId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.optimisticLikes = {}; // Clear optimistic updates when fetching fresh data
        state.optimisticComments = {};
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      // Like Post
      .addCase(likePost.pending, (state) => {
        state.liking = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.liking = false;
        const { postId, updatedPost } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }
        // Clear optimistic update
        delete state.optimisticLikes[postId];
      })
      .addCase(likePost.rejected, (state, action) => {
        state.liking = false;
        state.error = action.payload;
        // Revert optimistic updates on error
        Object.keys(state.optimisticLikes).forEach(postId => {
          const optimisticUpdate = state.optimisticLikes[postId];
          if (optimisticUpdate) {
            const post = state.posts.find(p => p._id === postId);
            if (post) {
              if (optimisticUpdate.isLiked) {
                post.likes = post.likes.filter(id => id !== optimisticUpdate.userId);
              } else {
                post.likes.push(optimisticUpdate.userId);
              }
            }
          }
        });
        state.optimisticLikes = {};
      })
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.commenting = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.commenting = false;
        const { postId, comment, commentsCount } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          // Update the comment with the real data from server
          const optimisticComment = state.optimisticComments[postId];
          if (optimisticComment && optimisticComment.type === 'add') {
            // Replace the optimistic comment with the real one
            const commentIndex = state.posts[postIndex].comments.findIndex(
              c => c._id === optimisticComment.commentId
            );
            if (commentIndex !== -1) {
              state.posts[postIndex].comments[commentIndex] = comment;
            }
          } else {
            // Add new comment if no optimistic update
            state.posts[postIndex].comments.push(comment);
          }
        }
        delete state.optimisticComments[postId];
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commenting = false;
        state.error = action.payload;
        // Revert optimistic comment updates on error
        Object.keys(state.optimisticComments).forEach(postId => {
          const optimisticUpdate = state.optimisticComments[postId];
          if (optimisticUpdate && optimisticUpdate.type === 'add') {
            const post = state.posts.find(p => p._id === postId);
            if (post) {
              post.comments = post.comments.filter(c => c._id !== optimisticUpdate.commentId);
            }
          }
        });
        state.optimisticComments = {};
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId, commentsCount } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments = state.posts[postIndex].comments.filter(
            comment => comment._id !== commentId
          );
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearPosts, 
  optimisticLike, 
  revertOptimisticLike,
  optimisticAddComment,
  revertOptimisticComment
} = postsSlice.actions;
export default postsSlice.reducer; 