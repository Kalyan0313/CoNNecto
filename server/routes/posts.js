const express = require('express');
const { body } = require('express-validator');
const PostController = require('../controllers/postController');
const auth = require('../middleware/auth');
const { validateRequest } = require('../utils/validation');

const router = express.Router();

// Validation rules
const postValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Post content must be between 1 and 1000 characters')
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment content must be between 1 and 500 characters')
];

// Public routes
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.get('/user/:userId', PostController.getUserPosts);

// Protected routes
router.post('/', [auth, ...postValidation, validateRequest], PostController.createPost);
router.put('/:id', [auth, ...postValidation, validateRequest], PostController.updatePost);
router.delete('/:id', auth, PostController.deletePost);

// Like/Unlike post
router.put('/:id/like', auth, PostController.toggleLike);

// Comments
router.post('/:id/comments', [auth, ...commentValidation, validateRequest], PostController.addComment);
router.delete('/:id/comments/:commentId', auth, PostController.deleteComment);

module.exports = router; 