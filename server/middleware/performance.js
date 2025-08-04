const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  // Override res.json to capture response time
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    // Log slow queries (over 500ms)
    if (duration > 500) {
      console.warn(`⚠️  Slow query detected: ${req.method} ${req.path} - ${duration}ms`);
    }
    
    // Log all queries in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${req.method} ${req.path} - ${duration}ms`);
    }
    
    // Add performance header
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = performanceMonitor; 