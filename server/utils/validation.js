const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw new AppError(errorMessages.join(', '), 400);
  }
  next();
};

const validateObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  
  if (pageNum < 1) throw new AppError('Page must be greater than 0', 400);
  if (limitNum < 1 || limitNum > 100) throw new AppError('Limit must be between 1 and 100', 400);
  
  return { page: pageNum, limit: limitNum };
};

module.exports = {
  validateRequest,
  validateObjectId,
  validatePagination
}; 