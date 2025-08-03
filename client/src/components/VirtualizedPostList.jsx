import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PostCard from './PostCard';

const VirtualizedPostList = React.memo(({ posts, onUpdate, itemHeight = 300, containerHeight = 600 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      posts.length
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, posts.length]);

  // Get visible posts
  const visiblePosts = useMemo(() => {
    return posts.slice(visibleRange.startIndex, visibleRange.endIndex);
  }, [posts, visibleRange]);

  // Calculate total height and offset
  const totalHeight = posts.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return (
    <div
      ref={setContainerRef}
      className="relative overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visiblePosts.map((post, index) => (
            <div key={post._id} style={{ height: itemHeight }}>
              <PostCard
                post={post}
                onUpdate={onUpdate}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualizedPostList.displayName = 'VirtualizedPostList';

export default VirtualizedPostList; 