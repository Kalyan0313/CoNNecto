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
    required: true
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