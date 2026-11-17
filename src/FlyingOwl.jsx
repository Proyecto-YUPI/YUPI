import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Sample a continuous curve instead of moving between sharp corners.
function flightFrames(points, position) {
  const interpolate = (a, b, c, d, t) => .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  return Array.from({ length: 101 }, (_, i) => {
    const progress = i / 100;
    const step = progress * (points.length - 1);
    const index = Math.min(points.length - 2, Math.floor(step));
    const t = step - index;
    const a = points[Math.max(0, index - 1)], b = points[index], c = points[index + 1], d = points[Math.min(points.length - 1, index + 2)];
    const values = b.map((_, key) => interpolate(a[key], b[key], c[key], d[key], t));
    return { transform: position(...values), opacity: Math.min(1, progress * 12), offset: progress };
  });
}

export default function FlyingOwl({ active, homeRef, onFlying, children }) {
  const flightRef = useRef(null);
  const [flying, setFlying] = useState(false);
  useEffect(() => {
    if (!active) { setFlying(false); onFlying(false); return; }
    let cancelled = false;
    let timer;
    let animation;
    const stop = () => { cancelled = true; clearTimeout(timer); animation?.cancel(); setFlying(false); onFlying(false); };
    const fly = () => {
      if (cancelled) return;
      if (document.hidden) { timer = setTimeout(fly, 5000); return; }
      setFlying(true);
      onFlying(true);
      timer = setTimeout(async () => {
        const element = flightRef.current;
        if (!element || cancelled) return;
        const w = window.innerWidth, h = window.innerHeight;
        const scale = Math.min(w < 600 ? .7 : 1, (w - 36) / 420);
        const baseScale = w < 600 ? .4 : .6;
        const home = homeRef.current?.getBoundingClientRect();
        const homeVisible = home && home.bottom > 0 && home.top < h;
        const position = (x, y, s, angle = 0) => `translate3d(${x}px,${y}px,0) scale(${s}) rotate(${angle}deg)`;
        const safeX = value => Math.max(80 * scale + 12, Math.min(w - 340 * scale - 12, value));
        const safeY = value => Math.max(12, Math.min(h - 310 * scale - 12, value));
        const centerX = safeX((w - 260 * scale) / 2);
        const centerY = safeY((h - 310 * scale) / 2);
        const endX = safeX(w * .66), endY = safeY(h * .4);
        const start = homeVisible ? [home.left, home.top, home.width / 260, 0] : [safeX(w * .7), safeY(h * .7), baseScale, 0];
        const points = [start,
          [safeX(w * .58), safeY(h * .12), baseScale, -5],
          [safeX(w * .13), safeY(h * .27), baseScale, 5],
          [centerX, centerY, scale, 0],
          [centerX + 4, centerY - 5, scale, 1],
          [endX, endY, baseScale, -3],
        ];
        animation = element.animate(flightFrames(points, position), { duration: 11000, easing: 'cubic-bezier(.25,.1,.25,1)', fill: 'forwards' });
        try {
          await animation.finished;
          if (cancelled) return;
          element.classList.add('landing');
          const destination = homeRef.current?.getBoundingClientRect();
          const visible = destination && destination.bottom > 0 && destination.top < window.innerHeight;
          const target = visible ? position(destination.left, destination.top, destination.width / 260) : position(window.innerWidth + 80, endY, baseScale);
          animation = element.animate([{ transform: position(endX, endY, baseScale, -3), opacity: 1 }, { transform: target, opacity: visible ? 1 : 0 }], { duration: 1800, easing: 'cubic-bezier(.33,0,.2,1)', fill: 'forwards' });
          await animation.finished;
          if (cancelled) return;
          setFlying(false); onFlying(false);
          timer = setTimeout(fly, 22000);
        } catch { /* Cancellation is expected when pausing or unmounting. */ }
      }, 50);
    };
    timer = setTimeout(fly, 6000);
    return stop;
  }, [active, homeRef, onFlying]);

  return flying ? createPortal(<div className="flying-yupi" ref={flightRef} aria-hidden="true"><div className="flight-character">{children}<div className="flight-wing left"><span/></div><div className="flight-wing right"><span/></div></div></div>, document.body) : null;
}
