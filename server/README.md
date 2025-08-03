# Mini LinkedIn Backend API

A robust, scalable Node.js/Express backend API following senior developer practices with proper error handling, validation, and architecture patterns.

## 🏗️ Architecture

### Folder Structure
```
server/
├── config/           # Configuration files
│   └── database.js   # Database connection
├── controllers/      # Business logic layer
│   ├── authController.js
│   ├── postController.js
│   └── userController.js
├── middleware/       # Express middleware
│   └── auth.js       # JWT authentication
├── models/          # Mongoose schemas
│   ├── Post.js
│   └── User.js
├── routes/          # API route definitions
│   ├── auth.js
│   ├── posts.js
│   └── users.js
├── utils/           # Utility functions
│   ├── asyncHandler.js
│   ├── errorHandler.js
│   ├── responseHandler.js
│   └── validation.js
├── index.js         # Server entry point
└── package.json
```

## 🚀 Features

### ✅ Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Token refresh functionality
- Password reset (placeholder)

### ✅ Post Management
- CRUD operations for posts
- Like/unlike functionality
- Comment system with nested operations
- Pagination support
- User-specific post filtering

### ✅ User Management
- User registration and login
- Profile management
- Password change functionality
- Account deletion
- User search and suggestions

### ✅ Error Handling
- Centralized error handling
- Custom error classes
- Development vs production error responses
- Proper HTTP status codes
- Detailed error messages

### ✅ Validation
- Input validation with express-validator
- Custom validation utilities
- Request sanitization
- Type checking and object validation

### ✅ Performance
- Async/await with proper error handling
- Database query optimization
- Response caching strategies
- Request logging

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **Error Handling**: Custom error classes

## 📋 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user
POST   /api/auth/refresh-token - Refresh JWT token
POST   /api/auth/logout       - Logout (client-side)
POST   /api/auth/forgot-password - Forgot password
POST   /api/auth/reset-password  - Reset password
```

### Posts
```
GET    /api/posts             - Get all posts (with pagination)
GET    /api/posts/:id         - Get single post
POST   /api/posts             - Create new post
PUT    /api/posts/:id         - Update post
DELETE /api/posts/:id         - Delete post
PUT    /api/posts/:id/like    - Like/unlike post
POST   /api/posts/:id/comments - Add comment
DELETE /api/posts/:id/comments/:commentId - Delete comment
GET    /api/posts/user/:userId - Get user's posts
```

### Users
```
GET    /api/users/:id         - Get user profile
GET    /api/users/search      - Search users
GET    /api/users/me/profile  - Get current user profile
PUT    /api/users/me/profile  - Update profile
PUT    /api/users/me/password - Change password
DELETE /api/users/me/account  - Delete account
GET    /api/users/suggestions - Get user suggestions
```

## 🔧 Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mini-linkedin
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 🧪 Development

### Running in Development
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "error": {
    // Error details (development only)
  }
}
```

## 🔒 Security Features

- **Input Validation**: All inputs are validated and sanitized
- **Password Security**: Passwords are hashed using bcrypt
- **JWT Security**: Tokens with expiration and refresh mechanism
- **CORS**: Configured for cross-origin requests
- **Rate Limiting**: Ready for implementation
- **Helmet**: Security headers (ready for implementation)

## 🚀 Performance Optimizations

- **Database Indexing**: Proper indexes on frequently queried fields
- **Query Optimization**: Efficient MongoDB queries with population
- **Async Operations**: Non-blocking I/O operations
- **Error Boundaries**: Proper error handling without crashes
- **Memory Management**: Efficient memory usage patterns

## 📝 Code Quality

### Error Handling
- Custom `AppError` class for operational errors
- Centralized error handling middleware
- Proper HTTP status codes
- Development vs production error responses

### Validation
- Input validation with express-validator
- Custom validation utilities
- Request sanitization
- Type checking

### Async Operations
- `asyncHandler` utility to eliminate try-catch boilerplate
- Proper error propagation
- Non-blocking operations

### Response Handling
- Consistent response format
- `ResponseHandler` utility for standardized responses
- Proper HTTP status codes
- Error message standardization

## 🔄 Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  bio: String (optional),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Schema
```javascript
{
  content: String (required, max 1000 chars),
  author: ObjectId (ref: User, required),
  likes: [ObjectId] (ref: User),
  comments: [{
    user: ObjectId (ref: User, required),
    content: String (required, max 500 chars),
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing Strategy

### Unit Tests
- Controller functions
- Utility functions
- Validation logic

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### Performance Tests
- Load testing
- Database query optimization
- Response time monitoring

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure MongoDB Atlas
- [ ] Set up environment variables
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up logging
- [ ] Configure monitoring

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=very-long-secure-secret
CORS_ORIGIN=https://yourdomain.com
```

## 📈 Monitoring & Logging

### Logging
- Request logging middleware
- Error logging with stack traces
- Performance monitoring
- Database query logging

### Health Checks
- `/api/health` endpoint
- Database connection status
- Memory usage monitoring
- Response time tracking

## 🔧 Maintenance

### Database Maintenance
- Regular backups
- Index optimization
- Query performance monitoring
- Data cleanup scripts

### Code Maintenance
- Regular dependency updates
- Security patches
- Code refactoring
- Performance optimization

## 🤝 Contributing

1. Follow the established code structure
2. Use the provided utilities and helpers
3. Write comprehensive error handling
4. Add proper validation
5. Follow the response format
6. Write tests for new features
7. Update documentation

## 📄 License

This project is licensed under the MIT License. 