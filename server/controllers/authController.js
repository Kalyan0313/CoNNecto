const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
  // Register new user
  static register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseHandler.badRequest(res, 'User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return ResponseHandler.created(res, {
      user: userResponse,
      token
    }, 'User registered successfully');
  });

  // Login user
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return ResponseHandler.unauthorized(res, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ResponseHandler.unauthorized(res, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return ResponseHandler.success(res, {
      user: userResponse,
      token
    }, 'Login successful');
  });

  // Get current user
  static getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    return ResponseHandler.success(res, user);
  });

  // Refresh token
  static refreshToken = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    // Generate new JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return ResponseHandler.success(res, {
      user,
      token
    }, 'Token refreshed successfully');
  });

  // Logout (client-side token removal)
  static logout = asyncHandler(async (req, res) => {
    return ResponseHandler.success(res, null, 'Logged out successfully');
  });

  // Forgot password (placeholder for future implementation)
  static forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return ResponseHandler.badRequest(res, 'User not found with this email');
    }

    // TODO: Implement email sending functionality
    // For now, just return success message
    return ResponseHandler.success(res, null, 'Password reset email sent (placeholder)');
  });

  // Reset password (placeholder for future implementation)
  static resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return ResponseHandler.badRequest(res, 'Token and new password are required');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        return ResponseHandler.badRequest(res, 'Invalid token');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return ResponseHandler.success(res, null, 'Password reset successfully');
    } catch (error) {
      return ResponseHandler.badRequest(res, 'Invalid or expired token');
    }
  });
}

module.exports = AuthController; 