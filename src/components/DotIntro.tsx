import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { COLORS } from '../theme';

const LIME = COLORS.primary;
const LETTERS = 'DOOMDOT'.split('');

type Props = {
  onDone?: () => void;
  onCrack?: () => void;
  revealTarget?: string;
};

function makeCrack() {
  const segmentCount = 16;
  const points: [number, number][] = [];

  for (let index = 0; index <= segmentCount; index += 1) {
    const jitter =
      index === 0 || index === segmentCount ? 0 : (Math.random() - 0.5) * 9;
    points.push([50 + jitter, (index / segmentCount) * 100]);
  }

  const branches: string[] = [];
  for (let branch = 0; branch < 7; branch += 1) {
    const [baseX, baseY] = points[1 + Math.floor(Math.random() * (segmentCount - 1))];
    const direction = Math.random() < 0.5 ? -1 : 1;
    let x = baseX;
    let y = baseY;
    let path = `M ${x} ${y}`;
    const steps = 2 + Math.floor(Math.random() * 3);

    for (let step = 0; step < steps; step += 1) {
      x += direction * (2 + Math.random() * 5);
      y += (Math.random() - 0.3) * 6;
      path += ` L ${x} ${y}`;
    }

    branches.push(path);
  }

  const main = `M ${points.map(([x, y]) => `${x} ${y}`).join(' L ')}`;
  const polygonEdge = (offset: number) =>
    points.map(([x, y]) => `${x + offset}% ${y}%`).join(', ');

  return {
    main,
    branches,
    clipLeft: `polygon(0% 0%, ${polygonEdge(0.15)}, 0% 100%)`,
    clipRight: `polygon(${polygonEdge(0)}, 100% 100%, 100% 0%)`,
  };
}

function CrackSvg({ main, branches }: { main: string; branches: string[] }) {
  return (
    <svg
      className="di-crack"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        filter: `drop-shadow(0 0 4px ${LIME}) drop-shadow(0 0 14px ${LIME})`,
        clipPath: 'inset(0% 0% 100% 0%)',
      }}
    >
      <path
        d={main}
        fill="none"
        stroke={LIME}
        strokeWidth={2.5}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      {branches.map((branch, index) => (
        <path
          key={index}
          d={branch}
          fill="none"
          stroke={LIME}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export default function DotIntro({ onDone, onCrack, revealTarget }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const crack = useMemo(makeCrack, []);
  const onCrackRef = useRef(onCrack);
  onCrackRef.current = onCrack;

  useLayoutEffect(() => {
    if (!root.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(true);
      onDone?.();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const revealElement = revealTarget
      ? document.querySelector<HTMLElement>(revealTarget)
      : null;

    const context = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>('.di-letter');
      const rings = gsap.utils.toArray<HTMLElement>('.di-ring');
      const timeline = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = previousOverflow;
          setDone(true);
          onDone?.();
        },
      });

      timeline
        .from(letters, {
          opacity: 0,
          y: 50,
          filter: 'blur(14px)',
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
        })
        .from('.di-dot', { scale: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' }, '+=0.1')
        .fromTo(
          rings,
          { scale: 1, opacity: 0.8 },
          { scale: 40, opacity: 0, duration: 1.6, ease: 'power2.out', stagger: 0.25 },
          '<0.3',
        )
        .to('.di-dot', { scale: 1.6, duration: 0.5, ease: 'power2.in' }, '+=0.3')
        .to(
          '.di-word',
          { opacity: 0, scale: 1.12, filter: 'blur(12px)', duration: 0.6, ease: 'power2.in' },
          '>-0.1',
        )
        .to(
          '.di-crack',
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
          '-=0.2',
        )
        .to('.di-glow', { opacity: 1, duration: 0.25 }, '>-0.1')
        .addLabel('pop')
        .call(() => onCrackRef.current?.(), [], 'pop')
        .to('.di-panel-l', { xPercent: -3, duration: 0.8, ease: 'power3.out' }, 'pop')
        .to('.di-panel-r', { xPercent: 3, duration: 0.8, ease: 'power3.out' }, 'pop')
        .to('.di-panel-l', { xPercent: -8, duration: 1.4, ease: 'power1.inOut' }, 'pop+=0.8')
        .to('.di-panel-r', { xPercent: 8, duration: 1.4, ease: 'power1.inOut' }, 'pop+=0.8')
        .to('.di-panel-l', { xPercent: -105, duration: 1.5, ease: 'power4.inOut' }, 'pop+=2.4')
        .to('.di-panel-r', { xPercent: 105, duration: 1.5, ease: 'power4.inOut' }, 'pop+=2.4')
        .to('.di-glow', { opacity: 0, duration: 0.6 }, 'pop+=2.6');

      if (revealElement) {
        timeline.fromTo(
          revealElement,
          { scale: 1.1, opacity: 0.5, transformOrigin: '50% 50vh' },
          {
            scale: 1,
            opacity: 1,
            duration: 1.9,
            ease: 'power3.out',
            clearProps: 'transform,opacity,transformOrigin',
          },
          'pop+=2.4',
        );
      }
    }, root);

    return () => {
      context.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [onDone, revealTarget]);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 100, overflow: 'hidden' }}
    >
      <div
        className="di-glow"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '45vw',
          marginLeft: '-22.5vw',
          opacity: 0,
          background: `radial-gradient(ellipse at center, ${LIME}cc 0%, ${LIME}55 25%, transparent 70%)`,
        }}
      />

      <div
        className="di-panel-l"
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          clipPath: crack.clipLeft,
          WebkitClipPath: crack.clipLeft,
        }}
      >
        <CrackSvg main={crack.main} branches={crack.branches} />
      </div>

      <div
        className="di-panel-r"
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          clipPath: crack.clipRight,
          WebkitClipPath: crack.clipRight,
        }}
      >
        <CrackSvg main={crack.main} branches={crack.branches} />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          className="di-word"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontWeight: 700,
            fontSize: 'clamp(2.2rem, 9vw, 7rem)',
            letterSpacing: '0.18em',
            color: '#fff',
          }}
        >
          {LETTERS.map((letter, index) => (
            <span key={index} className="di-letter" style={{ display: 'inline-block' }}>
              {letter}
            </span>
          ))}
          <span
            className="di-dot"
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '0.24em',
              height: '0.24em',
              marginLeft: '0.05em',
              borderRadius: '50%',
              background: LIME,
              boxShadow: `0 0 24px ${LIME}, 0 0 60px ${LIME}`,
            }}
          >
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="di-ring"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `1px solid ${LIME}`,
                  opacity: 0,
                }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}