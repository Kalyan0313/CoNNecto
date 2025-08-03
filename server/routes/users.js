const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateRequest } = require('../utils/validation');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

const deleteAccountValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account')
];

// Public routes
router.get('/:id', UserController.getUserById);
router.get('/search', UserController.searchUsers);

// Protected routes
router.get('/me/profile', auth, UserController.getCurrentUser);
router.put('/me/profile', [auth, ...updateProfileValidation, validateRequest], UserController.updateProfile);
router.put('/me/password', [auth, ...changePasswordValidation, validateRequest], UserController.changePassword);
router.delete('/me/account', [auth, ...deleteAccountValidation, validateRequest], UserController.deleteAccount);
router.get('/suggestions', auth, UserController.getUserSuggestions);

module.exports = router; 