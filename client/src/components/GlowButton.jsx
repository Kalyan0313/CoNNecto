import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { addPointerListener, removePointerListener, getButtonGlowStyles } from '../utils/glowEffects';

// Memoized variant classes
const variantClasses = {
  primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-neon',
  secondary: 'bg-gradient-to-r from-neon-green to-neon-blue text-white hover:shadow-neon',
  outline: 'border-2 border-neon-blue text-neon-blue hover:bg-neon-blue/10',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-neon-red'
};

// Memoized size classes
const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

const GlowButton = React.memo(({ 
  children, 
  className = '', 
  glowColor = 'blue', 
  size = 'md',
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  as: Component = 'button',
  ...props
}) => {
  const buttonRef = useRef(null);
  const innerRef = useRef(null);

  // Memoized callback for pointer updates
  const updatePointer = useCallback((x, y, xp, yp) => {
    if (buttonRef.current) {
      buttonRef.current.style.setProperty('--x', x.toFixed(2));
      buttonRef.current.style.setProperty('--xp', xp);
      buttonRef.current.style.setProperty('--y', y.toFixed(2));
      buttonRef.current.style.setProperty('--yp', yp);
    }
  }, []);

  useEffect(() => {
    addPointerListener(updatePointer);
    return () => removePointerListener(updatePointer);
  }, [updatePointer]);

  // Memoized styles
  const baseStyles = useMemo(() => {
    return getButtonGlowStyles(glowColor);
  }, [glowColor]);

  // Memoized variant class
  const variantClass = useMemo(() => {
    return variantClasses[variant] || variantClasses.primary;
  }, [variant]);

  // Memoized size class
  const sizeClass = useMemo(() => {
    return sizeClasses[size] || sizeClasses.md;
  }, [size]);

  // Memoized final className
  const finalClassName = useMemo(() => {
    return `
      ${sizeClass}
      ${variantClass}
      rounded-lg font-medium transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-neon-blue/20
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [sizeClass, variantClass, className]);

  return (
    <Component
      ref={buttonRef}
      data-glow-button
      type={Component === 'button' ? type : undefined}
      style={baseStyles}
      className={finalClassName}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <div ref={innerRef} data-glow-button></div>
      {children}
    </Component>
  );
});

GlowButton.displayName = 'GlowButton';

export default GlowButton; 