import React, { useEffect, useRef, useState } from 'react';
import { RobotAnchor } from './RobotCompanion.tsx';
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Sparkles,
  Github,
  Linkedin,
  Rocket,
  Lock,
  Bell,
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
  /** Shown in the "Focus" row: the founder's main services from the Services page. */
  tagline: string;
  /** Short description shown in the "About" row. */
  bio: string;
  /** Tech tags matching the Focus services. */
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
    tagline: 'Front-End Development & UI/UX · Full-Stack Web Applications · Custom Software Applications',
    bio: 'Co-Founder of DoomDot, responsible for front-end development and user interface design, with a focus on delivering polished and high-performing digital products.',
    specialties: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'C#', '.NET', 'Java',],
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
    tagline: 'Back-End Engineering & Scalable APIs · Full-Stack Web Applications · Mobile Applications',
    bio: 'Co-Founder of DoomDot, responsible for back-end architecture and API development, ensuring that developing systems remain secure, reliable, and scalable.',
    specialties: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'TypeScript', 'NativeWind', 'Next.js'],
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
    tagline: 'Custom Software Applications · Back-End Engineering & Scalable APIs · Mobile Applications',
    bio: 'Co-Founder of DoomDot, responsible for custom software development, applying strong problem-solving skills to build dependable, business-focused solutions.',
    specialties: ['Python', 'C#', '.NET', 'Java', 'PostgreSQL', 'Docker', 'NativeWind'],
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
    tagline: 'Full-Stack Web Applications · Mobile Applications · Front-End Development & UI/UX',
    bio: 'Co-Founder of DoomDot, responsible for full-stack web and mobile development, overseeing projects from initial planning through to final delivery.',
    specialties: ['React', 'Node.js', 'MongoDB', 'Stripe', 'React Native', 'Expo', 'NativeWind'],
    github: 'https://github.com/odishaa',
    linkedin: 'https://www.linkedin.com/in/odisha-rathnayake-rm2002/',
    tint: '#E4FF7A',
    photo: '/team/odisha.png',
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
const FounderFigure: React.FC<{ member: TeamMember; full?: boolean }> = ({ member, full = false }) => {
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
          className={`absolute inset-0 w-full h-full object-cover object-top border border-[#B8E351]/40 group-hover:border-[#B8E351] transition-[border-radius,border-color,box-shadow] duration-700 ${
            full ? 'rounded-[32px] shadow-[0_0_60px_rgba(184,227,81,0.15)]' : 'rounded-[56px]'
          }`}
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
/* ------------------------------------------------------------------ */
/* Team backdrop (soft green aurora + particles, like the Services)    */
/* ------------------------------------------------------------------ */

const TEAM_BG_CSS = `
  @keyframes tsDriftA {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(0, -34px, 0) scale(1.08); }
  }
  @keyframes tsDriftB {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(0, 30px, 0) scale(0.94); }
  }
  @keyframes tsTwinkle {
    0%, 100% { opacity: 0.12; }
    50% { opacity: 0.85; }
  }
  .ts-drift-a { animation: tsDriftA 16s ease-in-out infinite; }
  .ts-drift-b { animation: tsDriftB 20s ease-in-out infinite; }
  .ts-twinkle { animation: tsTwinkle 5s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .ts-drift-a, .ts-drift-b, .ts-twinkle { animation: none; }
  }
`;

const TEAM_GLOWS: { cls: string; style: React.CSSProperties }[] = [
  {
    cls: 'ts-drift-a',
    style: {
      left: '-18%',
      top: '2%',
      width: 760,
      height: 760,
      background: 'radial-gradient(circle, rgba(96,140,22,0.34) 0%, rgba(96,140,22,0) 68%)',
    },
  },
  {
    cls: 'ts-drift-b',
    style: {
      right: '-20%',
      top: '12%',
      width: 820,
      height: 820,
      background: 'radial-gradient(circle, rgba(150,200,40,0.26) 0%, rgba(150,200,40,0) 68%)',
    },
  },
  {
    cls: 'ts-drift-b',
    style: {
      left: '-14%',
      top: '50%',
      width: 700,
      height: 700,
      background: 'radial-gradient(circle, rgba(96,140,22,0.26) 0%, rgba(96,140,22,0) 68%)',
    },
  },
  {
    cls: 'ts-drift-a',
    style: {
      right: '-16%',
      top: '64%',
      width: 760,
      height: 760,
      background: 'radial-gradient(circle, rgba(150,200,40,0.28) 0%, rgba(150,200,40,0) 68%)',
    },
  },
];

// [left %, top %, delay s, size px]
const TEAM_PARTICLES: [number, number, number, number][] = [
  [5, 6, 0, 3],
  [14, 18, 1.4, 2],
  [27, 9, 2.8, 2],
  [41, 4, 0.7, 2],
  [58, 11, 3.6, 3],
  [72, 7, 2.1, 2],
  [88, 15, 0.3, 3],
  [95, 28, 3.1, 2],
  [8, 34, 2.5, 3],
  [22, 46, 0.9, 2],
  [91, 44, 1.8, 2],
  [4, 58, 3.3, 2],
  [16, 70, 0.5, 3],
  [34, 82, 2.2, 2],
  [52, 90, 1.1, 2],
  [67, 80, 3.8, 3],
  [83, 72, 0.2, 2],
  [94, 62, 2.6, 3],
  [76, 92, 1.6, 2],
  [12, 94, 3.0, 2],
];

const TeamBackdrop: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* soft light behind the header */}
    <div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse 55% 16% at 50% 7%, rgba(184,227,81,0.12), transparent 70%)',
      }}
    />

    {/* drifting green aurora blobs */}
    {TEAM_GLOWS.map((g, i) => (
      <div key={i} className={`absolute rounded-full ${g.cls}`} style={g.style} />
    ))}

    {/* tiny twinkling particles */}
    {TEAM_PARTICLES.map(([l, t, d, size], i) => (
      <span
        key={i}
        className="ts-twinkle absolute rounded-full bg-[#B8E351]"
        style={{
          left: `${l}%`,
          top: `${t}%`,
          width: size,
          height: size,
          animationDelay: `${d}s`,
          boxShadow: '0 0 8px rgba(184,227,81,0.7)',
        }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Marketplace "Coming Soon" banner                                    */
/* ------------------------------------------------------------------ */

const MARKET_CSS = `
  @keyframes mkShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  @keyframes mkBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
  @keyframes mkFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes mkSweep {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  .mk-shimmer { animation: mkShimmer 2.2s ease-in-out infinite; }
  .mk-blink { animation: mkBlink 1.2s steps(2, start) infinite; }
  .mk-float { animation: mkFloat 4s ease-in-out infinite; }
  .mk-sweep { animation: mkSweep 4.5s linear infinite; }
  @media (prefers-reduced-motion: reduce) {
    .mk-shimmer, .mk-blink, .mk-float, .mk-sweep { animation: none; }
  }
`;

const PLATFORMS = [
  {
    name: 'Upwork',
    blurb: 'Big ideas, built to last. Full-stack products and long-term partnerships.',
    status: 'Profile in review',
    progress: 85,
    tint: '#B8E351',
  },
  {
    name: 'Fiverr',
    blurb: 'Small brief, big impact. Quick builds, clean fixes and fast delivery.',
    status: 'Gigs being drafted',
    progress: 70,
    tint: '#6EE7A8',
  },
];

const MarketplaceSoon: React.FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl border border-[#23430C] bg-[#070b04]/80 overflow-hidden p-6 sm:p-10 text-left shadow-[0_0_50px_rgba(184,227,81,0.07)]"
    >
      <style>{MARKET_CSS}</style>

      {/* background glow + scan line */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[260px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(184,227,81,0.16), transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #B8E351 0, #B8E351 1px, transparent 1px, transparent 7px)',
          }}
        />
        <div className="mk-sweep absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#B8E351]/10 to-transparent" />
      </div>

      <div className="relative">
        {/* status line */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8E351]/40 bg-[#050607]/70 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[#B8E351]">
            <Rocket className="w-3.5 h-3.5 mk-float" />
            <span>Incoming Transmission</span>
            <span className="mk-blink">_</span>
          </div>

          <h4 className="mt-5 font-display font-black uppercase tracking-tight leading-[0.95] text-white text-3xl sm:text-5xl">
            We&apos;re Landing On
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8E351] to-[#e4ff9a]">
              Upwork &amp; Fiverr
            </span>
          </h4>

          <p className="mt-4 max-w-2xl text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
            Same quality, same 100% code &amp; IP handover, now on the marketplaces you already
            trust. Our profiles are being built right now. Launching soon.
          </p>
        </div>

        {/* platform cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {PLATFORMS.map((p, i) => (
            <div
              key={p.name}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 700ms ${EASE} ${i * 150}ms, transform 700ms ${EASE} ${i * 150}ms`,
              }}
            >
              <div
                className="group relative rounded-xl border border-dashed bg-[#030602]/80 p-5 sm:p-6 hover:-translate-y-1 transition-transform duration-500"
                style={{ borderColor: `${p.tint}66` }}
              >
                {/* SOON badge */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8E351] text-black text-[9px] font-mono font-black uppercase tracking-widest shadow-[0_0_14px_rgba(184,227,81,0.55)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mk-blink" />
                  Soon
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  <Lock className="w-3 h-3" />
                  <span>Locked // Opening soon</span>
                </div>

                <div
                  className="mt-3 font-display font-black text-4xl sm:text-5xl tracking-tight"
                  style={{ color: p.tint, textShadow: `0 0 28px ${p.tint}55` }}
                >
                  {p.name}
                </div>

                <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-sans leading-snug">{p.blurb}</p>

                {/* progress */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5">
                    <span className="text-zinc-400">{p.status}</span>
                    <span style={{ color: p.tint }}>{p.progress}%</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-[#0d1a08] border border-[#23430C] overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
                      style={{
                        width: inView ? `${p.progress}%` : '0%',
                        background: `linear-gradient(90deg, ${p.tint}99, ${p.tint})`,
                        boxShadow: `0 0 12px ${p.tint}88`,
                        transition: `width 1600ms ${EASE} ${400 + i * 200}ms`,
                      }}
                    >
                      <div className="mk-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* footer row */}
        {/* <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#B8E351]">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">
              Want it sooner? Work with us directly today.
            </span>
          </div>

          <a
            href="#contact"
            onClick={() => sound.playConfirm()}
            className="px-6 py-3 rounded-xl bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(184,227,81,0.5)] shrink-0 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Bell className="w-4 h-4" />
            <span>Get Notified At Launch</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div> */}
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

  // natural aspect ratio (w / h) of each photo, so the spotlight can show the full frame
  const [ratios, setRatios] = useState<Record<string, number>>({});
  useEffect(() => {
    let alive = true;
    TEAM_MEMBERS.forEach((m) => {
      if (!m.photo) return;
      const img = new Image();
      img.onload = () => {
        if (alive && img.naturalWidth && img.naturalHeight) {
          setRatios((r) => ({ ...r, [m.id]: img.naturalWidth / img.naturalHeight }));
        }
      };
      img.src = m.photo;
    });
    return () => {
      alive = false;
    };
  }, []);

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
    ['About', shown.bio],
  ];

  return (
    <section id="team" className="py-20 bg-[#050607] border-t border-[#23430C] relative overflow-hidden">
      <style>{TEAM_BG_CSS}</style>
      <TeamBackdrop />

      {/* Anchor alias for squad links */}
      <span id="squad" className="absolute -top-20" aria-hidden="true" />
      <RobotAnchor x="94%" y="4%" scale={0.35} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================================= */}
        {/* 1. OUR TEAM — INTERACTIVE FOUNDER SELECTOR                        */}
        {/* ================================================================= */}
        <div className="relative">
          <Reveal className="mb-8 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8E351]/40 bg-[#050607]/70 backdrop-blur-sm shadow-[0_0_24px_rgba(184,227,81,0.12)] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.04em] [word-spacing:-0.12em] text-[#B8E351]">
              <span className="relative flex w-2.5 h-2.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-[#B8E351] opacity-60 animate-ping" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-[#B8E351]" />
              </span>
              <span>
                Core TEAM // Online
                <span className="hidden sm:inline"> · 4/4 Founders Ready</span>
              </span>
            </div>
            <h2 className="mt-4 font-display font-extrabold tracking-tight text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Our Team
            </h2>
            <p className="mt-4 font-display font-bold uppercase tracking-wide text-[#B8E351] text-sm sm:text-lg">
              THE FUTURE ISN&apos;T WAITING. NEITHER ARE WE.
            </p>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-3xl font-sans leading-relaxed">
              Doomdot builds for the world that&apos;s coming, not the one that&apos;s fading. We bring
              engineering, creativity, and emerging technology together to transform ambitious ideas into
              products that move fast, think smart, and evolve with the world around them. We embrace the
              bold, untangle the complex, and step confidently into the unknown — building technology that
              helps shape what comes next.
            </p>
          </Reveal>

          <div
            ref={stageRef}
            onMouseEnter={handleEnter}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="relative rounded-3xl border border-[#23430C] bg-[#0a0e0b]/70 backdrop-blur-xl overflow-hidden min-h-[580px] lg:min-h-[640px] mb-20 text-left shadow-[0_0_60px_rgba(184,227,81,0.08),inset_0_1px_0_rgba(255,255,255,0.14)]"
          >
            {/* ---------- backgrounds ---------- */}
            <div aria-hidden="true" className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d170c]/70 via-[#070a08]/60 to-[#050607]/60" />
              <div
                className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(184,227,81,0.20), transparent 68%)' }}
              />
              <div
                className="absolute -bottom-32 -left-24 w-[460px] h-[460px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(60,130,60,0.28), transparent 68%)' }}
              />
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
              let w = 120;
              let h = 230;
              let maxW: string | undefined;
              const ratio = ratios[m.id];
              const full = isSel && !!ratio;

              if (!inDetail) {
                left = `${14 + i * 24}%`;
                top = isDesktop ? 290 : 200;
                scale = isDesktop ? 1.15 : 0.62;
                blur = 0;
                opacity = revealed ? 1 : 0;
                z = 10;
              } else if (isSel) {
                left = isDesktop ? '27%' : '50%';
                blur = switching ? 18 : 0;
                opacity = switching ? 0.55 : 1;
                z = 20;
                if (ratio) {
                  // full photo frame: sized to the photo's own aspect ratio (no cropping)
                  h = isDesktop ? 510 : 270;
                  w = Math.round(h * Math.min(ratio, 1.2));
                  maxW = isDesktop ? '38%' : '80%';
                  top = isDesktop ? 94 : 76;
                  scale = 1;
                } else {
                  top = isDesktop ? 440 : 93;
                  scale = isDesktop ? 2.5 : 1.1;
                }
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
                    width: w,
                    height: h,
                    maxWidth: maxW,
                    zIndex: z,
                    opacity,
                    filter: `blur(${blur}px)`,
                    transform: `translate(-50%, ${lift}px) scale(${scale})`,
                    transformOrigin: '50% 100%',
                    pointerEvents: inDetail ? 'none' : 'auto',
                    transition: reduced
                      ? 'none'
                      : `left 900ms ${EASE} 0ms, top 900ms ${EASE} 0ms, width 900ms ${EASE} 0ms, height 900ms ${EASE} 0ms, transform 900ms ${EASE} ${d}ms, filter 700ms ease 0ms, opacity 700ms ease ${d}ms`,
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
                      <FounderFigure member={m} full={full} />

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
        </div>

        {/* ================================================================= */}
        {/* 2. MARKETPLACE COMING SOON                                        */}
        {/* ================================================================= */}
        <MarketplaceSoon />

      </div>
    </section>
  );
};