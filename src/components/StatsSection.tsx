import React, { useEffect, useRef, useState } from 'react';

type Stat = {
  prefix?: string;
  value: number;
  suffix: string;
  line1: string;
  line2: string;
};

const STATS: Stat[] = [
  { value: 14, suffix: ' Days', line1: 'Average Delivery', line2: 'Kickoff to Launch' },
  { value: 100, suffix: '%', line1: 'Code quality', line2: 'Tested + Reviewed' },
  { prefix: '<', value: 2, suffix: ' Hrs', line1: 'Client Response', line2: 'Direct Communication' },
];

// Counts from 0 to `end` once `start` becomes true
function useCountUp(end: number, start: boolean, duration = 1800, delay = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(end);
      return;
    }

    let frame = 0;

    const timeout = setTimeout(() => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out
        setCount(Math.round(end * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [end, start, duration, delay]);

  return count;
}

function StatCard({ stat, started }: { stat: Stat; started: boolean }) {
  const count = useCountUp(stat.value, started);

  return (
    <div className="group relative flex-1 cursor-default overflow-hidden rounded-sm border border-white/10 px-6 py-8 text-center transition-colors duration-300 hover:border-[#BBE351]">
      {/* Faded background, fades in on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#BBE351]/25 via-[#BBE351]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <h3
          className="text-3xl font-extrabold tracking-wide text-[#FFFFFF] md:text-4xl"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          {stat.prefix}
          {count}
          {stat.suffix}
        </h3>
        <p className="mt-4 text-sm text-[#FFFFFF]">{stat.line1}</p>
        <p className="mt-1 text-sm text-[#FFFFFF]">{stat.line2}</p>
      </div>
    </div>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);

  // Start counting when the section scrolls into view (runs once)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="stats" className="bg-[#050607] px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:gap-10">
        {STATS.map((stat) => (
          <StatCard key={stat.line1} stat={stat} started={started} />
        ))}
      </div>
    </section>
  );
}

export default StatsSection;