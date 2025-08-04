const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { validateObjectId } = require('../utils/validation');
const Post = require('../models/Post');
const User = require('../models/User');

class PostController {
  // Get all posts with pagination
  static getAllPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, userId } = req.query; // Increased default limit
    const skip = (page - 1) * limit;

    let query = {};
    if (userId) {
      if (!validateObjectId(userId)) {
        return ResponseHandler.badRequest(res, 'Invalid user ID');
      }
      query.author = userId;
    }

    // Use Promise.all for parallel execution and lean() for better performance
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name email avatar')
        .populate('comments.user', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(), // Use lean for better performance
      Post.countDocuments(query)
    ]);

    return ResponseHandler.success(res, {
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });

  // Get single post by ID
  static getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return ResponseHandler.badRequest(res, 'Invalid post ID');
    }

    const post = await Post.findById(id)
      .populate('author', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    if (!post) {
      return ResponseHandler.notFound(res, 'Post not found');
    }

    return ResponseHandler.success(res, post);
  });

  // Create new post
  static createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user._id;

    const post = new Post({
      content,
      author: userId
    });

    await post.save();
    await post.populate('author', 'name email avatar');

    return ResponseHandler.created(res, post, 'Post created successfully');
  });

  // Update post
  static updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!validateObjectId(id)) {
      return ResponseHandler.badRequest(res, 'Invalid post ID');
    }

    const post = await Post.findById(id);

    if (!post) {
      return ResponseHandler.notFound(res, 'Post not found');
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return ResponseHandler.forbidden(res, 'You can only edit your own posts');
    }

    post.content = content;
    await post.save();
    await post.populate('author', 'name email avatar');

    return ResponseHandler.success(res, post, 'Post updated successfully');
  });

  // Delete post
  static deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!validateObjectId(id)) {
      return ResponseHandler.badRequest(res, 'Invalid post ID');
    }

    const post = await Post.findById(id);

    if (!post) {
      return ResponseHandler.notFound(res, 'Post not found');
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return ResponseHandler.forbidden(res, 'You can only delete your own posts');
    }

    await Post.findByIdAndDelete(id);

    return ResponseHandler.success(res, null, 'Post deleted successfully');
  });

  // Like/Unlike post
  static toggleLike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!validateObjectId(id)) {
      return ResponseHandler.badRequest(res, 'Invalid post ID');
    }

    const post = await Post.findById(id);

    if (!post) {
      return ResponseHandler.notFound(res, 'Post not found');
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(likeId => likeId.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('author', 'name email avatar');
    await post.populate('comments.user', 'name email avatar');

    return ResponseHandler.success(res, {
      post,
      liked: !isLiked,
      likesCount: post.likes.length
    }, isLiked ? 'Post unliked' : 'Post liked');
  });

  // Add comment to post
  static addComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!validateObjectId(id)) {
      return ResponseHandler.badRequest(res, 'Invalid post ID');
    }

    if (!content || content.trim().length === 0) {
      return ResponseHandler.badRequest(res, 'Comment content is required');
    }

    if (content.length > 500) {
      return ResponseHandler.badRequest(res, 'Comment must be less than 500 characters');
    }

    const post = await Post.findById(id);

    if (!post) {
      return ResponseHandler.notFound(res, 'Post not found');
    }

    const comment = {
      user: userId,
      content: content.trim()
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('author', 'name email avatar');
    await post.populate('comments.user', 'name email avatar');

    const newComment = post.comments[post.comments.length - 1];

    return ResponseHandler.created(res, {
      comment: newComment,
      commentsCount: post.comments.length
    }, 'Comment added successfully');
  });

  // Delete comment
  static deleteComment = asyncHandler(async (req, res) => {
    const { id, commentId } = req.params;
    const userId = req.user._id;

    if (!validateObjectId(id)) {
      return ResponseHandler.badRequest(res, 'Invalid post ID');
    }

    if (!validateObjectId(commentId)) {
      return ResponseHandler.badRequest(res, 'Invalid comment ID');
    }

    const post = await Post.findById(id);

    if (!post) {
      return ResponseHandler.notFound(res, 'Post not found');
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return ResponseHandler.notFound(res, 'Comment not found');
    }

    // Check if user is the comment author or post author
    if (comment.user.toString() !== userId.toString() && 
        post.author.toString() !== userId.toString()) {
      return ResponseHandler.forbidden(res, 'You can only delete your own comments or comments on your posts');
    }

    comment.remove();
    await post.save();
    await post.populate('author', 'name email avatar');
    await post.populate('comments.user', 'name email avatar');

    return ResponseHandler.success(res, {
      post,
      commentsCount: post.comments.length
    }, 'Comment deleted successfully');
  });

  // Get user's posts
  static getUserPosts = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query; // Increased default limit
    const skip = (page - 1) * limit;

    if (!validateObjectId(userId)) {
      return ResponseHandler.badRequest(res, 'Invalid user ID');
    }

    // Use lean() for better performance when we don't need to modify the documents
    const [posts, total] = await Promise.all([
      Post.find({ author: userId })
        .populate('author', 'name email avatar')
        .populate('comments.user', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(), // Use lean for better performance
      Post.countDocuments({ author: userId })
    ]);

    // Check if user exists (only if we need user data)
    const user = await User.findById(userId).select('name email avatar').lean();

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    return ResponseHandler.success(res, {
      posts,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });
}

module.exports = PostController; 