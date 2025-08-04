const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for author queries
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add compound indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 }); // For user posts sorted by date
postSchema.index({ createdAt: -1 }); // For general post listing
postSchema.index({ 'likes': 1 }); // For like-related queries
postSchema.index({ 'comments.user': 1 }); // For comment-related queries

// Method to get post with populated author
postSchema.methods.toJSON = function() {
  const post = this.toObject();
  return {
    id: post._id,
    content: post.content,
    author: post.author,
    likes: post.likes,
    comments: post.comments,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
};

module.exports = mongoose.model('Post', postSchema); 