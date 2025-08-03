const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { validateObjectId } = require('../utils/validation');
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');

class UserController {
  // Get current user profile
  static getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    return ResponseHandler.success(res, user);
  });

  // Get user profile by ID
  static getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return ResponseHandler.badRequest(res, 'Invalid user ID');
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    // Get user stats
    const postsCount = await Post.countDocuments({ author: id });
    const totalLikes = await Post.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } }
    ]);

    const userStats = {
      postsCount,
      totalLikes: totalLikes.length > 0 ? totalLikes[0].totalLikes : 0
    };

    return ResponseHandler.success(res, {
      user,
      stats: userStats
    });
  });

  // Update user profile
  static updateProfile = asyncHandler(async (req, res) => {
    const { name, email, bio } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return ResponseHandler.badRequest(res, 'Email already exists');
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return ResponseHandler.success(res, userResponse, 'Profile updated successfully');
  });

  // Change password
  static changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return ResponseHandler.badRequest(res, 'Current password and new password are required');
    }

    if (newPassword.length < 6) {
      return ResponseHandler.badRequest(res, 'New password must be at least 6 characters long');
    }

    const user = await User.findById(userId);

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return ResponseHandler.badRequest(res, 'Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return ResponseHandler.success(res, null, 'Password changed successfully');
  });

  // Delete user account
  static deleteAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      return ResponseHandler.badRequest(res, 'Password is required to delete account');
    }

    const user = await User.findById(userId);

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ResponseHandler.badRequest(res, 'Password is incorrect');
    }

    // Delete user's posts
    await Post.deleteMany({ author: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    return ResponseHandler.success(res, null, 'Account deleted successfully');
  });

  // Search users
  static searchUsers = asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length === 0) {
      return ResponseHandler.badRequest(res, 'Search query is required');
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    })
    .select('-password')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ name: 1 });

    const total = await User.countDocuments({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    });

    return ResponseHandler.success(res, {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  });

  // Get user suggestions (users to follow)
  static getUserSuggestions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { limit = 5 } = req.query;

    // Get users that the current user is not following
    const suggestions = await User.find({
      _id: { $ne: userId }
    })
    .select('-password')
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

    return ResponseHandler.success(res, suggestions);
  });
}

module.exports = UserController; 