const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

const createIndexes = async () => {
  try {
    console.log('Creating database indexes...');

    // Create indexes for Post model
    await Post.collection.createIndex({ author: 1, createdAt: -1 });
    console.log('✓ Created index: author + createdAt (desc)');

    await Post.collection.createIndex({ createdAt: -1 });
    console.log('✓ Created index: createdAt (desc)');

    await Post.collection.createIndex({ 'likes': 1 });
    console.log('✓ Created index: likes');

    await Post.collection.createIndex({ 'comments.user': 1 });
    console.log('✓ Created index: comments.user');

    // Create indexes for User model (if needed)
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✓ Created index: email (unique)');

    await User.collection.createIndex({ name: 1 });
    console.log('✓ Created index: name');

    console.log('All indexes created successfully!');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
};

module.exports = createIndexes; 