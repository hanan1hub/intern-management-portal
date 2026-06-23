import { useState, useEffect, useRef } from 'react';

export function useCountUp(target, duration = 900) {
  const [count, setCount] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (target == null || target === prev.current) return;
    const start = prev.current;
    const diff  = target - start;
    if (diff === 0) return;

    const startTime = performance.now();
    let frame;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + diff * eased));
      if (progress < 1) { frame = requestAnimationFrame(tick); }
      else { prev.current = target; }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return count;
}
