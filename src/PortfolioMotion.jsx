import { Children, useEffect, useRef, useState } from 'react';

// Lightweight, dependency-free adaptations of React Bits interaction patterns.
export function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rb-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SplitTitle({ text }) {
  return (
    <span className="rb-split-title" aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span key={`${character}-${index}`} aria-hidden="true" style={{ '--letter-index': index }}>
          {character}
        </span>
      ))}
    </span>
  );
}

export function BlurText({ children, className = '', delay = 0 }) {
  return (
    <span
      className={`rb-blur-text ${className}`.trim()}
      style={{ '--blur-delay': `${delay}ms` }}
    >
      {children}
    </span>
  );
}

export function KineticText({ text, className = '' }) {
  return (
    <span className={`rb-kinetic-text ${className}`.trim()} aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span key={`${character}-${index}`} aria-hidden="true" className="rb-kinetic-letter" style={{ '--letter-index': index }}>
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </span>
  );
}

export function SpotlightSurface({ children, className = '' }) {
  const ref = useRef(null);

  function handlePointerMove(event) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = ref.current;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    node.style.setProperty('--spot-opacity', '1');
  }

  function resetSpotlight() {
    const node = ref.current;
    if (node) node.style.setProperty('--spot-opacity', '.55');
  }

  return (
    <section
      ref={ref}
      className={`rb-spotlight-surface ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetSpotlight}
    >
      {children}
    </section>
  );
}

export function TiltSurface({ children, className = '', href, ariaLabel }) {
  const ref = useRef(null);

  function handlePointerMove(event) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = ref.current;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    node.style.setProperty('--pointer-x', `${x * 100}%`);
    node.style.setProperty('--pointer-y', `${y * 100}%`);
    node.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
    node.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`);
    node.style.setProperty('--glare-opacity', '1');
  }

  function resetTilt() {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
    node.style.setProperty('--glare-opacity', '0');
  }

  const shared = {
    ref,
    className: `rb-tilt-surface ${className}`.trim(),
    onPointerMove: handlePointerMove,
    onPointerLeave: resetTilt,
    onBlur: resetTilt,
    'aria-label': ariaLabel
  };

  return href ? <a {...shared} href={href}>{children}<span className="rb-glare" aria-hidden="true" /></a> : <div {...shared}>{children}<span className="rb-glare" aria-hidden="true" /></div>;
}

export function ScrollStack({ children, className = '' }) {
  const items = Children.toArray(children);
  return (
    <div className={`rb-scroll-stack ${className}`.trim()}>
      {items.map((child, index) => (
        <div className="rb-stack-item" style={{ '--stack-index': index }} key={child.key || index}>
          {child}
        </div>
      ))}
    </div>
  );
}
