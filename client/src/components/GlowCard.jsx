import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { addPointerListener, removePointerListener, getGlowStyles } from '../utils/glowEffects';

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard = React.memo(({ 
  children, 
  className = '', 
  glowColor = 'blue', 
  size = 'md', 
  width, 
  height, 
  customSize = false 
}) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  // Memoized callback for pointer updates
  const updatePointer = useCallback((x, y, xp, yp) => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--x', x.toFixed(2));
      cardRef.current.style.setProperty('--xp', xp);
      cardRef.current.style.setProperty('--y', y.toFixed(2));
      cardRef.current.style.setProperty('--yp', yp);
    }
  }, []);

  useEffect(() => {
    addPointerListener(updatePointer);
    return () => removePointerListener(updatePointer);
  }, [updatePointer]);

  // Memoized styles
  const baseStyles = useMemo(() => {
    const styles = { ...getGlowStyles(glowColor) };
    
    // Add width and height if provided
    if (width !== undefined) {
      styles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      styles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return styles;
  }, [glowColor, width, height]);

  // Memoized size classes
  const sizeClasses = useMemo(() => {
    if (customSize) {
      return '';
    }
    return sizeMap[size];
  }, [customSize, size]);

  // Memoized className
  const finalClassName = useMemo(() => {
    return `
      ${sizeClasses}
      ${!customSize ? 'aspect-[3/4]' : ''}
      rounded-2xl relative grid grid-rows-[1fr_auto] shadow-[0_1rem_2rem_-1rem_black] p-4 gap-4 backdrop-blur-[5px]
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [sizeClasses, customSize, className]);

  return (
    <div
      ref={cardRef}
      data-glow
      style={baseStyles}
      className={finalClassName}
    >
      <div ref={innerRef} data-glow></div>
      {children}
    </div>
  );
});

GlowCard.displayName = 'GlowCard';

export default GlowCard; 