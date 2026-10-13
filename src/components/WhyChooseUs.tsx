import React, { useEffect, useRef, useState } from 'react';
import { RobotAnchor } from './RobotCompanion.tsx';
import { ArrowRight, ShieldCheck, Zap, GitBranch, Clock } from 'lucide-react';
import { sound } from '../utils/audio.ts';

const WHY_CHOOSE_US = [
  {
    icon: <Zap className="w-5 h-5 text-[#B8E351]" />,
    title: 'Direct Engineer Access',
    description:
      'You collaborate exclusively with the 4 co-founders, computer science graduates who write every line of code. Zero sales reps, zero account managers, and zero outsourced junior developers. Expect direct, technical alignment and daily updates via Discord or Slack.',
    stat: '100% DIRECT DEV ACCESS',
  },
  {
    icon: <Clock className="w-5 h-5 text-[#B8E351]" />,
    title: 'High-Velocity Sprints',
    description:
      'Rapid, milestone-driven execution designed to take your product from concept to production in record time. Every project includes dedicated bug-fixing and deployment support for 30 days post-launch.',
    stat: '30-DAY WARRANTY INCLUDED',
  },
  {
    icon: <GitBranch className="w-5 h-5 text-[#B8E351]" />,
    title: 'Full Code & IP Ownership',
    description:
      'You maintain absolute ownership of your product from day one. Upon completion, we hand over clean, well-documented private GitHub repositories with zero vendor lock-in.',
    stat: 'FULL IP HANDOVER',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#B8E351]" />,
    title: 'Software Engineering Excellence',
    description:
      "We don't just hack things together. We apply rigorous computer science principles to build secure, scalable, and battle-tested software architectures that last.",
    stat: 'NO HACKS. NO SHORTCUTS. NO REGRETS.',
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const EASE = 'cubic-bezier(0.22,1,0.36,1)';

// Matte fade background color (#23430C as rgb)
const MATTE_RGB = '35,67,12';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Returns [ref, inView]. Becomes true once the element enters the viewport. */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView] as const;
}

/**
 * Scroll "hide" effect.
 * While the section scrolls off the top of the screen it fades out,
 * drifts up and shrinks slightly. Scrolling back up restores it.
 * (Blur has been removed.)
 * Styles are written straight to the element (no re-renders on scroll).
 */
function useScrollHide<T extends HTMLElement, C extends HTMLElement>() {
  const wrapRef = useRef<T | null>(null);
  const contentRef = useRef<C | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      // 0 while the section is on screen, rises to 1 as it scrolls out of the top
      const p = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.9)));
      const eased = p * p * (3 - 2 * p); // smoothstep

      content.style.opacity = String(1 - eased);
      content.style.transform = `translate3d(0, ${-eased * 70}px, 0) scale(${1 - eased * 0.06})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return [wrapRef, contentRef] as const;
}

/* ------------------------------------------------------------------ */
/* Why Choose Us (circular layout + expandable pills)                  */
/* ------------------------------------------------------------------ */

// px push to the right on desktop. Outer pills stay put, middle pills
// are pushed right, so the left edges form a gentle arc around the circle.
// Gentler: [0, 40, 40, 0]  |  Stronger: [0, 72, 72, 0]
const PILL_OFFSETS = [0, 20, 20, 0];

export const WhyChooseUs: React.FC = () => {
  const reduced = prefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  // Where the matte fade is centered: behind the circle (left on desktop, top on mobile)
  const focal = isDesktop ? '26% 50%' : '50% 26%';
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  const [active, setActive] = useState<number | null>(0); // null = all closed at start
  const [wrapRef, contentRef] = useScrollHide<HTMLElement, HTMLDivElement>();

  const toggle = (i: number) => {
    sound.playClick();
    setActive((cur) => (cur === i ? null : i));
  };

  return (
    <section
      ref={wrapRef}
      id="why-choose-us"
      className="py-20 bg-[#050607] border-t border-[#23430C] relative overflow-hidden"
    >
      {/* ---------------- MATTE FADE BACKGROUND (static, no animation) ---------------- */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 65% 75% at ${focal}, rgba(${MATTE_RGB},0.55) 0%, rgba(${MATTE_RGB},0.22) 45%, transparent 78%)`,
          }}
        />
        {/* top and bottom fade so the section blends into its neighbors */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050607] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050607] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <RobotAnchor x="96%" y="6%" scale={0.3} />

        {/* ---------------- CONTENT (this part fades/hides on scroll) ---------------- */}
        <div ref={contentRef} className="relative" style={{ willChange: 'opacity, transform' }}>
          <div
            ref={ref}
            className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-12 lg:gap-14 items-center"
          >
            <style>{`
              @keyframes wcuCore {
                0%, 100% {
                  box-shadow: 0 0 18px rgba(184,227,81,0.12), inset 0 0 18px rgba(184,227,81,0.05);
                  border-color: rgba(184,227,81,0.35);
                }
                50% {
                  box-shadow: 0 0 55px rgba(184,227,81,0.5), inset 0 0 35px rgba(184,227,81,0.15);
                  border-color: rgba(184,227,81,0.95);
                }
              }
              @keyframes wcuGlow {
                0%, 100% { opacity: 0.55; }
                50% { opacity: 1; }
              }
              @keyframes wcuRipple {
                0% { transform: scale(1); opacity: 0.6; }
                100% { transform: scale(1.55); opacity: 0; }
              }
              @keyframes wcuBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.2; }
              }
              .wcu-core { animation: wcuCore 2.8s ease-in-out infinite; }
              .wcu-glow { animation: wcuGlow 2.8s ease-in-out infinite; }
              .wcu-ripple { animation: wcuRipple 3.2s ease-out infinite; }
              .wcu-blink { animation: wcuBlink 1.4s ease-in-out infinite; }
              @media (prefers-reduced-motion: reduce) {
                .wcu-core, .wcu-glow, .wcu-ripple, .wcu-blink { animation: none; }
              }
            `}</style>

            {/* ---------------- LEFT: circle ---------------- */}
            <div
              className="relative mx-auto w-full max-w-[290px] sm:max-w-[420px] aspect-square"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'scale(1)' : 'scale(0.8)',
                transition: reduced ? 'none' : `opacity 800ms ease, transform 900ms ${EASE}`,
              }}
            >
              <div aria-hidden="true" className="wcu-ripple absolute inset-[14%] rounded-full border border-[#B8E351]/60" />
              <div
                aria-hidden="true"
                className="wcu-ripple absolute inset-[14%] rounded-full border border-[#B8E351]/60"
                style={{ animationDelay: '1.6s' }}
              />
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-full border border-dashed border-[#B8E351]/25 animate-spin motion-reduce:animate-none"
                style={{ animationDuration: '60s' }}
              />
              <div aria-hidden="true" className="absolute -inset-1 rounded-full border border-[#23430C]" />
              <div
                aria-hidden="true"
                className="wcu-glow absolute inset-3 rounded-full bg-gradient-to-br from-[#14260a] via-[#0b1507] to-[#050607] border border-[#B8E351]/20 shadow-[0_0_60px_rgba(184,227,81,0.12)]"
              />

              <div className="wcu-core absolute inset-[14%] rounded-full bg-[#070b04] border border-[#B8E351]/40 flex flex-col items-center justify-center text-center px-6 sm:px-10">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.2em] text-[#B8E351]">
                  CORE ADVANTAGE
                </span>
                <h3 className="mt-2 text-xl sm:text-3xl font-extrabold font-display text-white leading-tight tracking-tight">
                  Why You Need To Choose Us<span className="wcu-blink text-[#B8E351]">?</span>
                </h3>
                <a
                  href="#contact"
                  onClick={() => sound.playConfirm()}
                  className="mt-4 sm:mt-5 px-4 py-2 rounded-lg bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-[10px] font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(184,227,81,0.4)] transition-all active:scale-95"
                >
                  Let&apos;s work with us
                </a>
              </div>
            </div>

            {/* ---------------- RIGHT: expandable pills ---------------- */}
            <div className="relative flex flex-col justify-center lg:min-h-[480px]">
              <div className="space-y-4">
                {WHY_CHOOSE_US.map((item, idx) => {
                  const open = active === idx;
                  const delay = 250 + idx * 120;

                  return (
                    <div
                      key={item.title}
                      style={{
                        marginLeft: isDesktop ? PILL_OFFSETS[idx] : 0,
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateX(0)' : 'translateX(48px)',
                        transition: reduced
                          ? 'none'
                          : `opacity 700ms ease ${delay}ms, transform 800ms ${EASE} ${delay}ms`,
                      }}
                    >
                      <div
                        className={`rounded-[28px] border transition-all duration-500 ${
                          open
                            ? 'border-[#B8E351] bg-[#0c1707] shadow-[0_0_28px_rgba(184,227,81,0.18)]'
                            : 'border-[#23430C] bg-[#070b04]/90 hover:border-[#B8E351]/70'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(idx)}
                          onMouseEnter={() => !open && sound.playHover()}
                          aria-expanded={open}
                          aria-controls={`why-panel-${idx}`}
                          className="w-full flex items-center gap-4 p-2.5 pr-5 text-left rounded-[28px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E351]"
                        >
                          <span
                            className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${
                              open
                                ? 'bg-[#B8E351] border-[#B8E351] scale-105 [&_svg]:text-black'
                                : 'bg-[#0e1c09] border-[#23430C]'
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span
                            className={`flex-1 font-display font-bold text-sm sm:text-base leading-snug transition-colors duration-300 ${
                              open ? 'text-[#B8E351]' : 'text-white'
                            }`}
                          >
                            {item.title}
                          </span>
                          <ArrowRight
                            className={`w-4 h-4 shrink-0 transition-transform duration-500 ${
                              open ? 'rotate-90 text-[#B8E351]' : 'text-zinc-500'
                            }`}
                          />
                        </button>

                        {/* expanding panel */}
                        <div
                          id={`why-panel-${idx}`}
                          role="region"
                          aria-hidden={!open}
                          style={{
                            display: 'grid',
                            gridTemplateRows: open ? '1fr' : '0fr',
                            transition: reduced ? 'none' : `grid-template-rows 600ms ${EASE}`,
                          }}
                        >
                          <div className="overflow-hidden">
                            <div
                              className="px-5 pb-5 pt-1 sm:pl-[74px]"
                              style={{
                                opacity: open ? 1 : 0,
                                transform: open ? 'translateY(0)' : 'translateY(-8px)',
                                transition: reduced
                                  ? 'none'
                                  : `opacity 450ms ease ${open ? 200 : 0}ms, transform 500ms ${EASE} ${open ? 200 : 0}ms`,
                              }}
                            >
                              <p className="text-xs sm:text-[13px] text-zinc-300 font-sans leading-relaxed">
                                {item.description}
                              </p>
                              <div className="mt-4 flex items-center gap-3">
                                <span
                                  aria-hidden="true"
                                  className="h-px bg-gradient-to-r from-[#B8E351] to-transparent"
                                  style={{
                                    width: open ? 48 : 0,
                                    transition: reduced ? 'none' : `width 700ms ${EASE} ${open ? 350 : 0}ms`,
                                  }}
                                />
                                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#030602]/90 border border-[#23430C] text-[10px] font-mono font-bold text-[#B8E351]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-pulse" />
                                  {item.stat}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;