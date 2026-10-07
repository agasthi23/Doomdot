import React, { useEffect, useRef, useState } from 'react';
import { RobotAnchor } from './RobotCompanion.tsx';
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Github,
  Linkedin,
  Zap,
  GitBranch,
  Clock,
} from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { DoomLogo } from './DoomLogo.tsx';

interface TeamMember {
  id: string;
  index: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  discipline: 'SE' | 'CS';
  degree: string;
  initials: string;
  tagline: string;
  specialties: string[];
  github: string;
  linkedin: string;
  tint: string;
  /** Photo path inside /public, e.g. '/team/agasthi.png'. If empty or missing, a silhouette + initials is shown. */
  photo?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'agasthi',
    index: '01',
    name: 'Agasthi Silva',
    firstName: 'Agasthi',
    lastName: 'Silva',
    role: 'Co-Founder & Software Engineer',
    discipline: 'SE',
    degree: 'B.Sc. Software Engineering',
    initials: 'AS',
    tagline: 'Modern Web Architectures & Client Systems',
    specialties: ['TypeScript', 'Next.js 15', 'React 19', 'PostgreSQL', 'Tailwind'],
    github: 'https://github.com/agasthi23',
    linkedin: 'https://www.linkedin.com/in/agasthi-i-silva/',
    tint: '#B8E351',
    photo: '/team/agasthi.png',
  },
  {
    id: 'gavin',
    index: '02',
    name: 'Gavin Ranasinghe',
    firstName: 'Gavin',
    lastName: 'Ranasinghe',
    role: 'Co-Founder & Software Engineer',
    discipline: 'SE',
    degree: 'B.Sc. Software Engineering',
    initials: 'GR',
    tagline: 'Distributed Systems & Scalable Cloud APIs',
    specialties: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    github: 'https://github.com/GavinRanasinghe29870',
    linkedin: 'https://www.linkedin.com/in/gavin-ranasinghe-585183323/',
    tint: '#6EE7A8',
    photo: '/team/gavin.png',
  },
  {
    id: 'thamidu',
    index: '03',
    name: 'Thamidu Samarathunga',
    firstName: 'Thamidu',
    lastName: 'Samarathunga',
    role: 'Co-Founder & Computer Scientist',
    discipline: 'CS',
    degree: 'B.Sc. Computer Science',
    initials: 'TS',
    tagline: 'Intelligent Workflows & Machine Algorithms',
    specialties: ['Python', 'FastAPI', 'Gemini API', 'Qdrant'],
    github: 'https://github.com/Thamindu3',
    linkedin: 'https://www.linkedin.com/in/thamindu-samarathunga-29546a26b',
    tint: '#5EEAD4',
    photo: '/team/thamidu.png',
  },
  {
    id: 'odisha',
    index: '04',
    name: 'Odisha Rathnayaka',
    firstName: 'Odisha',
    lastName: 'Rathnayaka',
    role: 'Co-Founder & Computer Scientist',
    discipline: 'CS',
    degree: 'B.Sc. Computer Science',
    initials: 'OR',
    tagline: 'Platform Security & Interactive 3D WebGL',
    specialties: ['OAuth 2.0', 'Three.js', 'Webhooks', 'React'],
    github: 'https://github.com/odishaa',
    linkedin: 'https://www.linkedin.com/in/odisha-rathnayake-rm2002/',
    tint: '#E4FF7A',
    photo: '/team/odisha.png',
  },
];

const WHY_CHOOSE_US = [
  {
    icon: <Zap className="w-5 h-5 text-[#B8E351]" />,
    title: 'Direct Engineer Access (Zero Middlemen)',
    description:
      'You collaborate directly with the 4 co-founders who write every line of code. No sales reps, account managers, or outsourced junior developers. Daily updates via Discord or Slack.',
    stat: '100% DIRECT DEV ACCESS',
  },
  {
    icon: <Clock className="w-5 h-5 text-[#B8E351]" />,
    title: 'High-Velocity Sprints with 30-Day Warranty',
    description:
      'We ship production code in focused weekly milestones. Every completed project includes 30 days of complimentary bug fixes, performance monitoring, and live SLA support.',
    stat: '30-DAY WARRANTY INCLUDED',
  },
  {
    icon: <GitBranch className="w-5 h-5 text-[#B8E351]" />,
    title: '100% Code & Intellectual Property Ownership',
    description:
      'Private GitHub repository handover from day one. Clean, type-safe, fully documented code with complete commercial copyright and zero vendor lock-in.',
    stat: 'FULL IP HANDOVER',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#B8E351]" />,
    title: 'Software Engineering + Computer Science Rigor',
    description:
      'Our team combines modern software architecture with computer science algorithm design and security hardening. Systems engineered for sub-30ms latencies and zero vulnerabilities.',
    stat: 'SE + CS DEGREES COMBINED',
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const TOTAL = TEAM_MEMBERS.length;
const pad = (n: number) => String(n).padStart(2, '0');

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

/** Fade + slide up wrapper */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const [ref, inView] = useInView<HTMLDivElement>(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 700ms ${EASE} ${delay}ms, transform 700ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * The "character" shown in the lineup.
 * Uses the photo (cropped into the capsule frame) if it loads,
 * otherwise falls back to a silhouette + initials.
 */
const FounderFigure: React.FC<{ member: TeamMember }> = ({ member }) => {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = !!member.photo && !photoFailed;

  return (
    <div className="relative w-full h-full">
      {showPhoto ? (
        <img
          src={member.photo}
          alt={member.name}
          draggable={false}
          onError={() => setPhotoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-top rounded-[56px] border border-[#B8E351]/40 group-hover:border-[#B8E351] transition-colors"
        />
      ) : (
        <>
          {/* head */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[6px] w-[58px] h-[58px] rounded-full border border-[#B8E351]/50 group-hover:border-[#B8E351] bg-gradient-to-br from-[#223d12] to-[#0a1405] transition-colors" />
          {/* body */}
          <div className="absolute inset-x-0 top-[70px] bottom-0 rounded-t-[56px] rounded-b-xl border border-[#B8E351]/40 group-hover:border-[#B8E351] bg-gradient-to-b from-[#1c3410] via-[#0d1a08] to-[#060a04] overflow-hidden transition-colors">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(184,227,81,0.12) 0, rgba(184,227,81,0.12) 1px, transparent 1px, transparent 6px)',
              }}
            />
            <div className="relative mt-6 text-center font-display font-black text-[34px] leading-none text-[#B8E351]">
              {member.initials}
            </div>
            <div className="relative mt-3 mx-auto w-8 h-px bg-[#B8E351]/60" />
            <div className="relative mt-2 text-center text-[8px] font-mono tracking-[0.25em] text-zinc-400">
              {member.discipline}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Why Choose Us (circular layout + expandable pills)                  */
/* ------------------------------------------------------------------ */

// px push to the right on desktop so the pills follow an arc
const PILL_OFFSETS = [0, 56, 56, 0];

const WhyChooseUs: React.FC = () => {
  const reduced = prefersReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  const [active, setActive] = useState<number | null>(0); // null = all closed at start

  const toggle = (i: number) => {
    sound.playClick();
    setActive((cur) => (cur === i ? null : i));
  };

  return (
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
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-zinc-400 mb-2">
          <span aria-hidden="true" className="text-[#23430C]">///</span>
          <span>ZERO MIDDLEMEN · GUARANTEED QUALITY</span>
        </div>
        <p className="mb-6 text-xs sm:text-sm text-zinc-400 font-sans max-w-md leading-relaxed">
          Traditional agencies bill for layers of middle management. We replace overhead with direct,
          battle-tested engineering output.
        </p>

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
                    className="w-full flex items-center gap-4 p-2.5 pr-5 text-left rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E351]"
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
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export const SquadSection: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const finePointer = useMediaQuery('(pointer: fine)');
  const reduced = prefersReducedMotion();

  const [stageRef, revealed] = useInView<HTMLDivElement>(0.25);
  const [introDone, setIntroDone] = useState<boolean>(reduced);

  const [selected, setSelected] = useState<number | null>(null);
  const [switching, setSwitching] = useState(false);
  const lastIndex = useRef(0);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  // cursor ring
  const ringRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0, rx: 0, ry: 0, raf: 0 });
  const [ringVisible, setRingVisible] = useState(false);
  const [overClickable, setOverClickable] = useState(false);

  if (selected !== null) lastIndex.current = selected;
  const shown = TEAM_MEMBERS[selected ?? lastIndex.current];
  const panelVisible = selected !== null && !switching;

  // lineup entrance finishes after the stagger
  useEffect(() => {
    if (!revealed || introDone) return;
    const t = window.setTimeout(() => setIntroDone(true), 1700);
    return () => window.clearTimeout(t);
  }, [revealed, introDone]);

  // cleanup
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      if (mouse.current.raf) cancelAnimationFrame(mouse.current.raf);
    };
  }, []);

  /* ---------------- navigation ---------------- */

  const openFounder = (i: number) => {
    sound.playConfirm();
    setSelected(i);
  };

  const closeFounder = () => {
    sound.playClick();
    setSwitching(false);
    busy.current = false;
    setSelected(null);
  };

  const goTo = (i: number) => {
    if (busy.current || selected === null) return;
    busy.current = true;
    sound.playClick();
    setSwitching(true);
    timers.current.push(
      window.setTimeout(() => setSelected(i), reduced ? 0 : 380),
      window.setTimeout(() => {
        setSwitching(false);
        busy.current = false;
      }, reduced ? 0 : 880),
    );
  };

  const next = () => selected !== null && goTo((selected + 1) % TOTAL);
  const prev = () => selected !== null && goTo((selected - 1 + TOTAL) % TOTAL);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') closeFounder();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* ---------------- cursor ring ---------------- */

  const tick = () => {
    const m = mouse.current;
    m.rx += (m.x - m.rx) * 0.18;
    m.ry += (m.y - m.ry) * 0.18;
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${m.rx}px, ${m.ry}px, 0)`;
    }
    m.raf = requestAnimationFrame(tick);
  };

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!finePointer || reduced || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const m = mouse.current;
    m.x = m.rx = e.clientX - r.left;
    m.y = m.ry = e.clientY - r.top;
    setRingVisible(true);
    if (!m.raf) m.raf = requestAnimationFrame(tick);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!finePointer || reduced || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    mouse.current.x = e.clientX - r.left;
    mouse.current.y = e.clientY - r.top;
    setOverClickable(!!(e.target as HTMLElement).closest('button, a'));
  };

  const handleLeave = () => {
    const m = mouse.current;
    if (m.raf) cancelAnimationFrame(m.raf);
    m.raf = 0;
    setRingVisible(false);
    setOverClickable(false);
  };

  const ringMode: 'idle' | 'hover' | 'pill' = switching ? 'pill' : overClickable ? 'hover' : 'idle';

  /* ---------------- panel stagger ---------------- */

  const st = (k: number): React.CSSProperties => ({
    opacity: panelVisible ? 1 : 0,
    transform: panelVisible ? 'translateY(0)' : 'translateY(18px)',
    transition: reduced
      ? 'none'
      : `opacity 600ms ease ${panelVisible ? 200 + k * 70 : 0}ms, transform 600ms ${EASE} ${panelVisible ? 200 + k * 70 : 0}ms`,
  });

  const fade = (visible: boolean): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transition: reduced ? 'none' : 'opacity 600ms ease',
  });

  const detailRows: [string, string][] = [
    ['Role', shown.role],
    ['Degree', shown.degree],
    ['Focus', shown.tagline],
    ['Ownership', '100% code & IP handover'],
  ];

  return (
    <section id="team" className="py-20 bg-[#050607] border-t border-[#23430C] relative cyber-grid overflow-hidden">
      {/* Anchor alias for squad links */}
      <span id="squad" className="absolute -top-20" aria-hidden="true" />
      <RobotAnchor x="94%" y="4%" scale={0.35} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================================= */}
        {/* 1. OUR TEAM — INTERACTIVE FOUNDER SELECTOR                        */}
        {/* ================================================================= */}
        <Reveal className="mb-8 text-left">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3">
            <span className="text-[#B8E351] font-bold">03</span>
            <span aria-hidden="true" className="text-[#23430C]">///</span>
            <span>CORE SQUAD</span>
            <span aria-hidden="true" className="text-[#23430C]">///</span>
            <span className="text-[#B8E351]">OUR TEAM</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl font-sans leading-relaxed">
            Four founding software engineers and computer scientists working directly on your
            codebase. Zero account managers, zero outsourced freelancers, and 100% technical transparency.
          </p>
        </Reveal>

        <div
          ref={stageRef}
          onMouseEnter={handleEnter}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative rounded-3xl border border-[#23430C] bg-[#050607] overflow-hidden min-h-[580px] lg:min-h-[640px] mb-20 text-left shadow-[0_0_60px_rgba(184,227,81,0.08)]"
        >
          {/* ---------- backgrounds ---------- */}
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#08110a] via-[#050607] to-[#050607]" />
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 90%, rgba(184,227,81,0.12), transparent 60%)',
                ...fade(selected === null),
              }}
            />
            {TEAM_MEMBERS.map((m, i) => (
              <div
                key={m.id}
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${isDesktop ? '27% 72%' : '50% 30%'}, ${m.tint}33 0%, transparent 55%), radial-gradient(circle at 85% 20%, ${m.tint}12 0%, transparent 45%)`,
                  opacity: selected === i ? 1 : 0,
                  transition: reduced ? 'none' : 'opacity 900ms ease',
                }}
              />
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
          </div>

          {/* ---------- top bar ---------- */}
          <div className="absolute top-0 inset-x-0 z-30 h-14 px-5 sm:px-8 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-pulse" />
              <span>Founders</span>
            </div>
            <DoomLogo variant="lockup" size="sm" />
            <div className="text-[10px] font-mono text-zinc-400 tabular-nums">
              {selected === null ? '--' : pad(selected + 1)} / {pad(TOTAL)}
            </div>
          </div>

          {/* ---------- heading (lineup mode) ---------- */}
          <div
            className="absolute left-5 sm:left-8 lg:left-10 top-[76px] z-10 max-w-[560px] pr-4"
            style={{
              ...fade(selected === null),
              pointerEvents: selected === null ? 'auto' : 'none',
            }}
          >
            <h2 className="font-display font-black uppercase tracking-tight leading-[0.92] text-white text-[38px] sm:text-6xl lg:text-7xl">
              Meet The
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8E351] to-[#e4ff9a]">
                Founders
              </span>
            </h2>
            <div
              className="mt-4 h-[2px] bg-gradient-to-r from-[#B8E351] to-transparent"
              style={{
                width: revealed ? '100%' : '0%',
                transition: reduced ? 'none' : `width 1200ms ${EASE} 300ms`,
              }}
            />
          </div>

          {/* ---------- floor glow (lineup mode) ---------- */}
          <div
            aria-hidden="true"
            className="absolute z-0"
            style={{
              left: '4%',
              right: '4%',
              top: isDesktop ? 500 : 410,
              height: 70,
              background: 'radial-gradient(ellipse at center, rgba(184,227,81,0.18), transparent 70%)',
              ...fade(selected === null),
            }}
          />

          {/* ---------- founder figures (they morph between lineup and spotlight) ---------- */}
          {TEAM_MEMBERS.map((m, i) => {
            const inDetail = selected !== null;
            const isSel = selected === i;

            let left: string;
            let top: number;
            let scale: number;
            let blur: number;
            let opacity: number;
            let z: number;

            if (!inDetail) {
              left = `${14 + i * 24}%`;
              top = isDesktop ? 290 : 200;
              scale = isDesktop ? 1.15 : 0.62;
              blur = 0;
              opacity = revealed ? 1 : 0;
              z = 10;
            } else if (isSel) {
              left = isDesktop ? '27%' : '50%';
              top = isDesktop ? 440 : 93;
              scale = isDesktop ? 2.5 : 1.1;
              blur = switching ? 18 : 0;
              opacity = switching ? 0.55 : 1;
              z = 20;
            } else {
              left = isDesktop ? (i < (selected as number) ? '4%' : '58%') : '50%';
              top = isDesktop ? 440 : 93;
              scale = isDesktop ? 2.3 : 1.1;
              blur = 16;
              opacity = 0.12;
              z = 5;
            }

            const lift = !inDetail && !revealed ? 90 : 0;
            const d = !inDetail && !introDone ? i * 140 : 0;

            return (
              <div
                key={m.id}
                className="absolute"
                style={{
                  left,
                  top,
                  width: 120,
                  height: 230,
                  zIndex: z,
                  opacity,
                  filter: `blur(${blur}px)`,
                  transform: `translate(-50%, ${lift}px) scale(${scale})`,
                  transformOrigin: '50% 100%',
                  pointerEvents: inDetail ? 'none' : 'auto',
                  transition: reduced
                    ? 'none'
                    : `left 900ms ${EASE} 0ms, top 900ms ${EASE} 0ms, transform 900ms ${EASE} ${d}ms, filter 700ms ease 0ms, opacity 700ms ease ${d}ms`,
                }}
              >
                <button
                  type="button"
                  onClick={() => openFounder(i)}
                  onMouseEnter={() => !inDetail && sound.playHover()}
                  tabIndex={inDetail ? -1 : 0}
                  aria-label={`Open ${m.name}`}
                  className="group relative block w-full h-full rounded-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E351]"
                >
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:-translate-y-3">
                    <FounderFigure member={m} />

                    {/* name plate (lineup only) */}
                    <div
                      className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[160px] text-center"
                      style={fade(!inDetail)}
                    >
                      <div className="font-display font-bold text-white text-[18px] lg:text-[15px] group-hover:text-[#B8E351] transition-colors">
                        {m.firstName}
                      </div>
                      <div className="font-mono text-[10px] text-[#B8E351] tracking-wider">
                        {m.discipline} · {m.index}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}

          {/* ---------- bottom bar (lineup mode) ---------- */}
          <div
            className="absolute bottom-0 inset-x-0 z-20 px-5 sm:px-8 lg:px-10 py-5 flex items-center gap-4"
            style={{
              ...fade(selected === null),
              pointerEvents: selected === null ? 'auto' : 'none',
            }}
          >
            <button
              type="button"
              onClick={() => openFounder(0)}
              tabIndex={selected === null ? 0 : -1}
              aria-label="Open first founder"
              className="shrink-0 w-11 h-11 rounded-full border-2 border-white/80 hover:border-[#B8E351] hover:text-[#B8E351] text-white flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[11px] font-display font-bold tracking-[0.2em] text-white uppercase">
                DoomDot Squad
              </div>
              <p className="text-[11px] text-zinc-400 max-w-sm leading-snug">
                Click a founder to explore their profile and stack.
              </p>
            </div>
          </div>

          {/* ---------- detail panel (spotlight mode) ---------- */}
          <div
            className={
              isDesktop
                ? 'absolute z-30 top-[84px] left-[48%] right-10'
                : selected === null
                ? 'absolute z-30 inset-x-0 top-0 px-5'
                : 'relative z-30 px-5 sm:px-8 pt-[360px] pb-8'
            }
            style={{ pointerEvents: panelVisible ? 'auto' : 'none' }}
          >
            <div style={st(0)} className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em]">
              <span className="text-[#B8E351] font-bold">
                {shown.discipline === 'SE' ? 'Software Engineering' : 'Computer Science'}
              </span>
              <span className="text-zinc-500">
                {shown.index} / {pad(TOTAL)}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#B8E351]/70 to-transparent" />
            </div>

            <h3
              style={st(1)}
              className="mt-4 font-display font-black uppercase tracking-tight leading-[0.92] text-white text-4xl sm:text-5xl lg:text-6xl"
            >
              <span className="block">{shown.firstName}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#B8E351] to-[#e4ff9a]">
                {shown.lastName}
              </span>
            </h3>

            <p style={st(2)} className="mt-3 text-xs font-mono text-[#B8E351] font-semibold">
              {shown.role}
            </p>

            <div style={st(3)} className="mt-4 pt-4 border-t border-[#23430C] space-y-2.5">
              {detailRows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[96px_1fr] gap-x-4 items-baseline">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</span>
                  <span className="text-xs text-zinc-200 font-sans leading-snug">{value}</span>
                </div>
              ))}
            </div>

            <div style={st(4)} className="mt-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Tech stack</div>
              <div className="flex flex-wrap gap-2">
                {shown.specialties.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1.5 rounded-md bg-[#030602]/90 border border-[#23430C] hover:border-[#B8E351] text-[11px] font-mono text-zinc-200 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div style={st(5)} className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous founder"
                  className="w-11 h-11 rounded-full border-2 border-white/80 hover:border-[#B8E351] hover:text-[#B8E351] text-white flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next founder"
                  className="w-11 h-11 rounded-full border-2 border-white/80 hover:border-[#B8E351] hover:text-[#B8E351] text-white flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={shown.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-2 rounded-lg bg-[#040802] border border-[#23430C] hover:border-[#B8E351] hover:text-[#B8E351] text-zinc-300 transition-colors"
                  title={`${shown.name} GitHub`}
                  aria-label={`${shown.name} GitHub`}
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={shown.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-2 rounded-lg bg-[#040802] border border-[#23430C] hover:border-[#B8E351] hover:text-[#B8E351] text-zinc-300 transition-colors"
                  title={`${shown.name} LinkedIn`}
                  aria-label={`${shown.name} LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={closeFounder}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-[#23430C] hover:border-[#B8E351] hover:text-[#B8E351] text-zinc-300 text-[10px] font-mono uppercase tracking-wider transition-colors"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All founders</span>
                </button>
              </div>
            </div>
          </div>

          {/* ---------- cursor ring ---------- */}
          {finePointer && !reduced && (
            <div
              ref={ringRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-40"
              style={{ opacity: ringVisible ? 1 : 0, transition: 'opacity 200ms ease' }}
            >
              <div
                style={{
                  width: ringMode === 'pill' ? 64 : 36,
                  height: ringMode === 'pill' ? 26 : 36,
                  borderRadius: 9999,
                  border: `2px solid ${ringMode === 'idle' ? 'rgba(255,255,255,0.85)' : '#B8E351'}`,
                  background: ringMode === 'hover' ? 'rgba(184,227,81,0.15)' : 'transparent',
                  transform: `translate(-50%, -50%) rotate(${ringMode === 'pill' ? -35 : 0}deg) scale(${ringMode === 'hover' ? 1.5 : 1})`,
                  transition: `all 300ms ${EASE}`,
                }}
              />
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 2. WHY YOU NEED TO CHOOSE US                                      */}
        {/* ================================================================= */}
        <div className="relative mb-14 text-left">
          <RobotAnchor x="96%" y="6%" scale={0.3} />
          <WhyChooseUs />
        </div>

        {/* ================================================================= */}
        {/* 3. COLLECTIVE STATEMENT & CTA BANNER  (unchanged)                 */}
        {/* ================================================================= */}
        <div className="rounded-2xl border border-[#23430C] bg-[#070b04]/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#B8E351]">
              <Sparkles className="w-4 h-4 text-[#B8E351]" />
              <span className="font-bold">READY TO BUILD WITH US?</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold font-display text-white">
              Work Directly With Agasthi, Gavin, Thamidu & Odhisha
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans">
              Send us your project scope or architectural requirements. We reply with a detailed technical feasibility review and fixed quote within 24 hours.
            </p>
          </div>

          <a
            href="#contact"
            onClick={() => sound.playConfirm()}
            className="px-6 py-3 rounded-xl bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(184,227,81,0.5)] shrink-0 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Message The Team</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};