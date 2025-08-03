// Shared event listener system for glow effects
let pointerListeners = new Set();
let isListenerActive = false;

const addPointerListener = (callback) => {
  pointerListeners.add(callback);
  if (!isListenerActive) {
    isListenerActive = true;
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
  }
};

const removePointerListener = (callback) => {
  pointerListeners.delete(callback);
  if (pointerListeners.size === 0 && isListenerActive) {
    isListenerActive = false;
    document.removeEventListener('pointermove', handlePointerMove);
  }
};

const handlePointerMove = (e) => {
  const { clientX: x, clientY: y } = e;
  const xp = (x / window.innerWidth).toFixed(2);
  const yp = (y / window.innerHeight).toFixed(2);
  
  pointerListeners.forEach(callback => {
    callback(x, y, xp, yp);
  });
};

// Memoized styles cache
const glowStyles = new Map();
const buttonGlowStyles = new Map();

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  pink: { base: 320, spread: 200 }
};

const getGlowStyles = (glowColor) => {
  if (glowStyles.has(glowColor)) {
    return glowStyles.get(glowColor);
  }

  const { base, spread } = glowColorMap[glowColor];
  const styles = {
    '--base': base,
    '--spread': spread,
    '--radius': '14',
    '--border': '3',
    '--backdrop': 'hsl(0 0% 60% / 0.12)',
    '--backup-border': 'var(--backdrop)',
    '--size': '200',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)),
      transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative',
    touchAction: 'none',
  };

  glowStyles.set(glowColor, styles);
  return styles;
};

const getButtonGlowStyles = (glowColor) => {
  if (buttonGlowStyles.has(glowColor)) {
    return buttonGlowStyles.get(glowColor);
  }

  const { base, spread } = glowColorMap[glowColor];
  const styles = {
    '--base': base,
    '--spread': spread,
    '--radius': '8',
    '--border': '2',
    '--backdrop': 'hsl(0 0% 60% / 0.12)',
    '--backup-border': 'var(--backdrop)',
    '--size': '150',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)),
      transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative',
    touchAction: 'none',
  };

  buttonGlowStyles.set(glowColor, styles);
  return styles;
};

export {
  addPointerListener,
  removePointerListener,
  getGlowStyles,
  getButtonGlowStyles,
  glowColorMap
}; 