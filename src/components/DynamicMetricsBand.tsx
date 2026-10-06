import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/audio.ts';

interface MetricItem {
  id: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel: string;
  color: 'white' | 'lime';
  mode: 'count-up' | 'drop-down';
  formatValue: (val: number) => string;
}

export const DynamicMetricsBand: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    devs: 0,
    days: 0,
    handover: 0,
    middlemen: 100,
  });

  const metrics: MetricItem[] = [
    {
      id: 'devs',
      targetValue: 4,
      label: 'DEDICATED DEVS',
      sublabel: '2 CS + 2 SE Architects',
      color: 'white',
      mode: 'count-up',
      formatValue: (val) => `${val} / 4`,
    },
    {
      id: 'days',
      targetValue: 14,
      label: 'AVERAGE MVP TURNAROUND',
      sublabel: 'Zero Bureaucracy Speed',
      color: 'lime',
      mode: 'count-up',
      formatValue: (val) => `${val} Days`,
    },
    {
      id: 'handover',
      targetValue: 100,
      label: 'CODE HANDOVER',
      sublabel: 'Clean GitHub + CI/CD',
      color: 'white',
      mode: 'count-up',
      formatValue: (val) => `${val}%`,
    },
    {
      id: 'middlemen',
      targetValue: 0,
      label: 'MIDDLEMEN',
      sublabel: 'Direct Slack / Discord Access',
      color: 'lime',
      mode: 'drop-down',
      formatValue: (val) => `${val}%`,
    },
  ];

  const animateMetrics = () => {
    sound.playHover();
    const startTime = performance.now();
    const duration = 1200; // 1.2s total smooth animation

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out expo for snappy deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        devs: Math.round(0 + (4 - 0) * ease),
        days: Math.round(0 + (14 - 0) * ease),
        handover: Math.round(0 + (100 - 0) * ease),
        middlemen: Math.round(100 - (100 - 0) * ease), // drops from 100 to 0
      });

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          animateMetrics();
          setHasAnimated(true);
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardClick = () => {
    sound.playClick();
    animateMetrics();
  };

  return (
    <div
      ref={containerRef}
      className="mt-8 pt-8 border-t border-[#23430C] grid grid-cols-2 md:grid-cols-4 gap-6 text-left font-mono relative select-none"
    >
      {metrics.map((m, idx) => {
        const isLime = m.color === 'lime';
        const displayValue = m.formatValue(counts[m.id]);

        return (
          <div
            key={m.id}
            onClick={handleCardClick}
            className="group cursor-pointer p-3.5 -m-2 rounded-xl transition-all duration-200 hover:bg-[#0c1408] border border-transparent hover:border-[#23430C]"
            title="Click to re-roll metrics"
          >
            {/* Animated dropping number slot container */}
            <div className="relative overflow-hidden py-0.5">
              <div
                className={`text-3xl sm:text-4xl font-extrabold font-display tabular-nums tracking-tight transition-transform duration-500 ${
                  hasAnimated ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                } ${isLime ? 'text-[#B8E351] text-glitch' : 'text-white'}`}
                style={{
                  transitionDelay: `${idx * 120}ms`,
                }}
              >
                {displayValue}
              </div>
            </div>

            {/* Label with neon styling */}
            <div
              className={`text-xs mt-1.5 uppercase tracking-wider font-semibold transition-colors ${
                isLime ? 'text-zinc-200 group-hover:text-[#B8E351]' : 'text-[#B8E351] group-hover:text-[#D2F874]'
              }`}
            >
              {m.label}
            </div>

            {/* Sublabel */}
            <div className="text-xs text-zinc-400 mt-0.5 group-hover:text-zinc-300 transition-colors">
              {m.sublabel}
            </div>

            {/* Dynamic Micro Status Indicator */}
            <div className="mt-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#B8E351]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-ping" />
              <span>CLICK TO RE-TRIGGER</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
