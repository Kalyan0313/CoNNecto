import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const LazyLoad = React.memo(({ children, fallback = null, threshold = 0.1 }) => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold
  });

  if (!hasIntersected) {
    return (
      <div ref={ref}>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={ref}>
      {children}
    </div>
  );
});

LazyLoad.displayName = 'LazyLoad';

export default LazyLoad; 