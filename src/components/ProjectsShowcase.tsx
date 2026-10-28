import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BatteryFull,
  Calendar,
  Camera,
  Check,
  Compass,
  FolderOpen,
  Github,
  Layers,
  Mail,
  MessageCircle,
  MousePointer2,
  Music,
  Settings,
  Sparkles,
  Terminal,
  Trash2,
  Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { DoomLogo } from './DoomLogo.tsx';

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type Category = 'Web' | 'Mobile' | 'Software';

interface Project {
  id: string;
  index: string;
  title: string;
  category: Category;
  tagline: string;
  description: string;
  highlights: string[];
  tech: string[];
  /** Screenshots are joined top to bottom and slide as one photo. Put them in /public/projects/ */
  images: string[];
  /** Optional source code link */
  repo?: string;
}

// TODO: replace these placeholders with your real projects
const PROJECTS: Project[] = [
  {
    id: 'utilyze',
    index: '01',
    title: 'Utilyze',
    category: 'Software',
    tagline: 'Adaptive ML Forecasting & Resource Management System',
    description:
      'A full-stack resource management platform combining MERN and Python FastAPI to deliver automated utility bill forecasting, tiered tariff calculations, and proactive anomaly alerts.',
    highlights: [
      'SARIMA & Linear Regression time-series forecasting microservice',
      'Dynamic tiered tariff calculation engine for precise utility budgeting',
      'Proactive anomaly surge alerts with interactive consumption analytics',
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'SARIMA', 'FastAPI'],
    images: [
      '/projects/Utilyze1.jpeg',
      '/projects/Utilyze2.jpeg',
      '/projects/Utilyze3.jpeg',
      '/projects/Utilyze4.jpeg',
    ],
    repo: 'https://github.com/your-org/utilyze',
  },
  {
    id: 'nilminismartdine',
    index: '02',
    title: 'Nilmini SmartDine',
    category: 'Web',
    tagline: 'AI-Powered Restaurant Management System',
    description:
      'An AI-powered restaurant management system that predicts next-day demand using sales history, weather and holidays, then turns it into a production menu and ingredient plan to cut food waste.',
    highlights: [
      'ML demand prediction (80.22% accuracy) and customer age-group prediction (82.35% accuracy)',
      'Gemini-generated daily production menu with automatic ingredient and stock calculation',
      'Manager approval flow, billing, staff attendance, reports and role-based access',
    ],
    tech: [
      'Next.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Python (ML)',
      'Gemini API',
      'Docker',
    ],
    images: [
      '/projects/SmartDine1.jpeg',
      '/projects/SmartDine2.png',
      '/projects/SmartDine3.jpeg',
      '/projects/SmartDine4.png',
      '/projects/SmartDine5.png',
    ],
  },
  {
    id: 'nilmini-hotel',
    index: '04',
    title: 'Nilmini Hotel',
    category: 'Mobile',
    tagline: 'Food Delivery & Chef Booking App for Android',
    description:
      'An Android app for a food delivery business, letting customers order meals, book chefs for home visits and pay securely, with an admin dashboard to manage products, chefs and sales.',
    highlights: [
      'Secure card payments with Stripe, including advance payments for chef bookings',
      'Real-time data and authentication powered by Firebase',
      'Admin dashboard for managing products, chefs, orders and earnings',
    ],
    tech: ['Flutter', 'Dart', 'Firebase', 'Cloud Firestore', 'Stripe', 'WhatsApp API'],
    images: ['/projects/NIlminiApp1.png', '/projects/NIlminiApp2.png', '/projects/NIlminiApp3.png', '/projects/NIlminiApp4.png', '/projects/NIlminiApp5.png'],
    repo: 'https://github.com/your-org/tripmate',
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const GLIDE = 'cubic-bezier(0.37,0,0.63,1)';
const LID_EASE = 'cubic-bezier(0.65,0,0.35,1)';
const BAR_EASE = 'cubic-bezier(0.45,0.05,0.25,1)';
const SLIDE_MS = 800;

const LID_START = 400;
const LID_MS = 2400;
const BOOT_AT = LID_START + LID_MS + 300;
const BOOT_MS = 2400;
const ON_AT = BOOT_AT + BOOT_MS;

const TRAFFIC = ['#FF5F57', '#FEBC2E', '#28C840'];

type Phase = 'off' | 'boot' | 'on';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hasFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches;

/**
 * True only on devices that can really hover (mouse / trackpad).
 * Phones, tablets and device-emulation mode return false, so the
 * hint says "Click to scroll" there.
 */
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

function useCanHover() {
  const [canHover, setCanHover] = useState<boolean>(() =>
    typeof window === 'undefined'
      ? true
      : window.matchMedia(HOVER_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(HOVER_QUERY);
    const update = () => setCanHover(mq.matches);

    update();
    mq.addEventListener('change', update);

    return () => mq.removeEventListener('change', update);
  }, []);

  return canHover;
}

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

const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
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

const pad = (n: number) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const PROJECTS_CSS = `
  @keyframes pmBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }

  .pm-blink {
    animation: pmBlink 1.4s steps(2, start) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .pm-blink { animation: none; }
  }
`;

/* ------------------------------------------------------------------ */
/* Backdrop                                                            */
/* ------------------------------------------------------------------ */

const ProjectsBackdrop: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 55% 16% at 50% 6%, rgba(187,227,81,0.12), transparent 70%)',
      }}
    />

    <div
      className="absolute -left-40 top-1/3 w-[620px] h-[620px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(35,67,12,0.55), transparent 68%)',
      }}
    />

    <div
      className="absolute -right-40 top-2/3 w-[680px] h-[680px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(35,67,12,0.5), transparent 68%)',
      }}
    />

    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage:
          'linear-gradient(#BBE351 1px, transparent 1px), linear-gradient(90deg, #BBE351 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage:
          'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        WebkitMaskImage:
          'radial-gradient(ellipse at center, black 30%, transparent 75%)',
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Boot logo                                                           */
/* ------------------------------------------------------------------ */

const BootLogo: React.FC = () => (
  <div className="scale-75 sm:scale-100">
    <DoomLogo variant="lockup" size="sm" />
  </div>
);

/* ------------------------------------------------------------------ */
/* Dock                                                                */
/* ------------------------------------------------------------------ */

type DockTone = 'dark' | 'lime' | 'light';

interface DockIcon {
  icon: LucideIcon;
  tone: DockTone;
}

const DOCK_ITEMS: (DockIcon | 'divider')[] = [
  { icon: Compass, tone: 'lime' },
  { icon: Mail, tone: 'dark' },
  { icon: MessageCircle, tone: 'lime' },
  { icon: Camera, tone: 'light' },
  { icon: Music, tone: 'dark' },
  { icon: Calendar, tone: 'light' },
  { icon: Terminal, tone: 'dark' },
  { icon: Settings, tone: 'dark' },
  'divider',
  { icon: FolderOpen, tone: 'dark' },
  { icon: Trash2, tone: 'dark' },
];

const TONE_STYLE: Record<DockTone, { bg: string; color: string }> = {
  dark: {
    bg: 'linear-gradient(145deg, #23430C, #050607)',
    color: '#BBE351',
  },
  lime: {
    bg: '#BBE351',
    color: '#050607',
  },
  light: {
    bg: 'rgba(255,255,255,0.92)',
    color: '#050607',
  },
};

const DockBar: React.FC<{ show: boolean }> = ({ show }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute bottom-[3%] left-1/2 z-10"
    style={{
      opacity: show ? 1 : 0,
      transform: `translate(-50%, ${show ? '0' : '140%'})`,
      transition: `opacity 600ms ease 500ms, transform 800ms ${EASE} 500ms`,
    }}
  >
    <div className="flex items-end gap-[3px] sm:gap-1.5 px-1 py-1 sm:px-1.5 sm:py-1.5 rounded-[9px] sm:rounded-2xl bg-[#050607]/55 backdrop-blur-md border border-white/20">
      {DOCK_ITEMS.map((item, i) => {
        if (item === 'divider') {
          return (
            <span
              key={i}
              className="self-stretch w-px mx-0.5 bg-white/25"
            />
          );
        }

        const Icon = item.icon;
        const t = TONE_STYLE[item.tone];

        return (
          <span
            key={i}
            className="w-[17px] h-[17px] sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-[5px] sm:rounded-lg flex items-center justify-center border border-white/15"
            style={{ background: t.bg, color: t.color }}
          >
            <Icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </span>
        );
      })}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* MacBook                                                             */
/* ------------------------------------------------------------------ */

const MENU_H = 'h-[14px] sm:h-[18px] md:h-[22px]';
const TILT_BASE = 'perspective(1600px) rotateX(0deg) rotateY(0deg)';

const ProjectMonitor: React.FC<{
  project: Project;
  active: boolean;
}> = ({ project, active }) => {
  const [opened, setOpened] = useState(false);
  const [phase, setPhase] = useState<Phase>('off');
  const [hovered, setHovered] = useState(false);
  const [offset, setOffset] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const canHover = useCanHover();

  const viewRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);

  const on = phase === 'on';

  useEffect(() => {
    if (prefersReducedMotion()) {
      setOpened(active);
      setPhase(active ? 'on' : 'off');
      return;
    }

    if (active) {
      const t1 = window.setTimeout(() => setOpened(true), LID_START);
      const t2 = window.setTimeout(() => setPhase('boot'), BOOT_AT);
      const t3 = window.setTimeout(() => setPhase('on'), ON_AT);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    }

    const t = window.setTimeout(() => {
      setOpened(false);
      setPhase('off');
      setHovered(false);
    }, SLIDE_MS + 100);

    return () => window.clearTimeout(t);
  }, [active]);

  const measure = () => {
    const view = viewRef.current;
    const content = contentRef.current;

    if (!view || !content) return;

    setOffset(Math.max(0, content.offsetHeight - view.clientHeight));
  };

  const start = () => {
    if (!on) return;
    measure();
    setHovered(true);
  };

  const stop = () => setHovered(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!on || prefersReducedMotion() || !hasFinePointer()) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    if (tiltRef.current) {
      tiltRef.current.style.transform =
        `perspective(1600px) rotateY(${(px - 0.5) * 9}deg) rotateX(${(0.5 - py) * 6}deg)`;
    }
  };

  const handleLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = TILT_BASE;
  };

  const duration = Math.min(14, Math.max(3, offset / 80));

  return (
    <div>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-[96%] h-10 rounded-full blur-xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(187,227,81,0.22), rgba(0,0,0,0.6) 60%, transparent 75%)',
            opacity: phase === 'off' ? 0.35 : 1,
            transition: 'opacity 1200ms ease',
          }}
        />

        <div
          ref={tiltRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative"
          style={{
            transform: TILT_BASE,
            transition: 'transform 220ms ease-out',
            willChange: 'transform',
          }}
        >
          <div className="w-[88%] mx-auto">
            <div
              className="relative rounded-t-[14px] sm:rounded-t-[20px] rounded-b-[3px] border border-white/20 bg-[#050607] p-[5px] sm:p-[8px] shadow-[0_0_60px_rgba(187,227,81,0.08),inset_0_1px_0_rgba(255,255,255,0.18)]"
              style={{
                transform: `perspective(1800px) rotateX(${opened ? 0 : -89}deg)`,
                transformOrigin: '50% 100%',
                transition: `transform ${LID_MS}ms ${LID_EASE}`,
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] sm:rounded-[8px] bg-[#050607]">
                <div
                  className="absolute inset-0 flex flex-col"
                  style={{
                    opacity: on ? 1 : 0,
                    filter: `brightness(${on ? 1 : 1.6})`,
                    transition: 'opacity 900ms ease, filter 1200ms ease',
                  }}
                >
                  <div
                    className={`relative z-10 ${MENU_H} shrink-0 flex items-center justify-between px-2 sm:px-3 bg-[#050607]/70 backdrop-blur-md border-b border-white/10 text-[6px] sm:text-[8px] md:text-[10px] font-sans text-white/85`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                      <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-[#BBE351] shrink-0" />
                      <span className="font-bold text-white truncate max-w-[60px] sm:max-w-none">
                        {project.title}
                      </span>
                      <span className="hidden sm:inline text-white/60">File</span>
                      <span className="hidden sm:inline text-white/60">Edit</span>
                      <span className="hidden md:inline text-white/60">View</span>
                      <span className="hidden md:inline text-white/60">Window</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 text-white/80">
                      <Wifi className="w-2 h-2 sm:w-3 sm:h-3" />
                      <BatteryFull className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                      <span className="tabular-nums">9:41</span>
                    </div>
                  </div>

                  <div
                    ref={viewRef}
                    onMouseEnter={start}
                    onMouseLeave={stop}
                    onClick={() => (hovered ? stop() : start())}
                    className="relative flex-1 min-h-0 overflow-hidden cursor-pointer bg-[#050607]"
                  >
                    <div
                      ref={contentRef}
                      className="absolute inset-x-0 top-0 flex flex-col gap-2 sm:gap-3"
                      style={{
                        transform: `translateY(${hovered ? -offset : 0}px)`,
                        transition: hovered
                          ? `transform ${duration}s ${GLIDE}`
                          : `transform 900ms ${EASE}`,
                        willChange: 'transform',
                      }}
                    >
                      {project.images.map((src, i) =>
                        failed[i] ? (
                          <div
                            key={src}
                            className="w-full aspect-[16/10] flex flex-col items-center justify-center gap-2 bg-[#23430C]/30"
                          >
                            <Layers className="w-8 h-8 text-[#BBE351]" />
                            <span className="font-display font-black text-white text-lg">
                              {project.title}
                            </span>
                            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                              Add screenshot
                            </span>
                          </div>
                        ) : (
                          <img
                            key={src}
                            src={src}
                            alt={`${project.title} screenshot ${i + 1}`}
                            draggable={false}
                            onLoad={measure}
                            onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                            className="block w-full h-auto select-none"
                          />
                        ),
                      )}

                      <div className="h-8 sm:h-12" />
                    </div>

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3.5 sm:h-5 md:h-6 flex items-center gap-[3px] sm:gap-1.5 px-1.5 sm:px-2.5 bg-gradient-to-b from-[#050607]/85 to-[#050607]/0"
                    >
                      {TRAFFIC.map((c) => (
                        <span
                          key={c}
                          className="w-[5px] h-[5px] sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full"
                          style={{
                            background: c,
                            boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.25)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <DockBar show={on} />
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 bg-[#050607] flex flex-col items-center justify-center"
                  style={{
                    opacity: on ? 0 : 1,
                    transition: 'opacity 800ms ease',
                  }}
                >
                  <div
                    className="flex flex-col items-center"
                    style={{
                      opacity: phase === 'boot' ? 1 : 0,
                      transition: 'opacity 900ms ease',
                    }}
                  >
                    <BootLogo />
                    <div className="mt-5 sm:mt-8 w-[34%] min-w-[70px] max-w-[150px] h-[3px] sm:h-1 rounded-full bg-white/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{
                          width: phase === 'off' ? '0%' : '100%',
                          transition:
                            phase === 'boot'
                              ? `width ${BOOT_MS - 300}ms ${BAR_EASE}`
                              : 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-30 w-[13%] ${MENU_H} rounded-b-[6px] sm:rounded-b-[9px] bg-[#050607] flex items-center justify-center`}
                >
                  <span className="w-[3px] h-[3px] sm:w-1 sm:h-1 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative left-1/2 -translate-x-1/2 -mt-px w-full h-[9px] sm:h-[14px] rounded-t-[2px] rounded-b-[14px] sm:rounded-b-[20px] border border-white/15 border-t-white/30"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.38), rgba(255,255,255,0.14) 55%, rgba(255,255,255,0.05))',
              boxShadow: '0 14px 30px rgba(0,0,0,0.6)',
            }}
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-[18%] h-[3px] sm:h-1 rounded-b-full bg-[#050607]/70" />
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center min-h-[20px]">
        <div
          className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#BBE351]"
          style={{
            opacity: on && !hovered ? 1 : 0,
            transition: 'opacity 400ms ease',
          }}
        >
          <MousePointer2 className="w-3 h-3" />
          <span>{canHover ? 'Hover to scroll' : 'Click to scroll'}</span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Mobile phone showcase                                               */
/* ------------------------------------------------------------------ */

const MobileProjectMonitor: React.FC<{
  project: Project;
  active: boolean;
}> = ({ project, active }) => {
  const [opened, setOpened] = useState(false);
  const [phase, setPhase] = useState<Phase>('off');
  const [hovered, setHovered] = useState(false);
  const [offset, setOffset] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const canHover = useCanHover();

  const viewRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);

  const on = phase === 'on';

  useEffect(() => {
    if (prefersReducedMotion()) {
      setOpened(active);
      setPhase(active ? 'on' : 'off');
      return;
    }

    if (active) {
      const t1 = window.setTimeout(() => setOpened(true), LID_START);
      const t2 = window.setTimeout(() => setPhase('boot'), BOOT_AT);
      const t3 = window.setTimeout(() => setPhase('on'), ON_AT);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    }

    const t = window.setTimeout(() => {
      setOpened(false);
      setPhase('off');
      setHovered(false);
    }, SLIDE_MS + 100);

    return () => window.clearTimeout(t);
  }, [active]);

  const measure = () => {
    const view = viewRef.current;
    const content = contentRef.current;

    if (!view || !content) return;

    setOffset(Math.max(0, content.offsetHeight - view.clientHeight));
  };

  const start = () => {
    if (!on) return;
    measure();
    setHovered(true);
  };

  const stop = () => setHovered(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!on || prefersReducedMotion() || !hasFinePointer()) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    if (tiltRef.current) {
      tiltRef.current.style.transform =
        `perspective(1200px) rotateY(${(px - 0.5) * 7}deg) rotateX(${(0.5 - py) * 5}deg)`;
    }
  };

  const handleLeave = () => {
    if (tiltRef.current) {
      tiltRef.current.style.transform =
        'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const duration = Math.min(14, Math.max(3, offset / 80));

  return (
    <div>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-[72%] h-10 rounded-full blur-xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(187,227,81,0.22), rgba(0,0,0,0.6) 60%, transparent 75%)',
            opacity: phase === 'off' ? 0.35 : 1,
            transition: 'opacity 1200ms ease',
          }}
        />

        <div
          ref={tiltRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative"
          style={{
            transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
            transition: 'transform 220ms ease-out',
            willChange: 'transform',
          }}
        >
          <div
            className="relative mx-auto w-[58%] max-w-[290px] min-w-[190px] rounded-[2.5rem] sm:rounded-[3rem] border-[3px] sm:border-4 border-[#343638] bg-[#08090A] p-[7px] sm:p-[9px] shadow-[0_0_60px_rgba(187,227,81,0.08),inset_0_1px_0_rgba(255,255,255,0.2)]"
            style={{
              transform: `perspective(1400px) rotateY(0deg) rotateX(${opened ? 0 : 12}deg) scale(${opened ? 1 : 0.96})`,
              transformOrigin: '50% 50%',
              transition: `transform ${LID_MS}ms ${LID_EASE}`,
            }}
          >
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2rem] sm:rounded-[2.4rem] bg-[#050607] border border-white/10">
              <div className="absolute inset-x-0 top-0 z-20 h-7 sm:h-8 flex items-center justify-between px-3 sm:px-4 bg-[#050607]/90 text-white">
                <span className="text-[8px] sm:text-[9px] font-semibold tabular-nums">
                  9:41
                </span>

                <div className="flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <BatteryFull className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>

              <div
                className="absolute inset-0 flex flex-col"
                style={{
                  opacity: on ? 1 : 0,
                  filter: `brightness(${on ? 1 : 1.5})`,
                  transition: 'opacity 900ms ease, filter 1200ms ease',
                }}
              >
                <div
                  ref={viewRef}
                  onMouseEnter={start}
                  onMouseLeave={stop}
                  onClick={() => (hovered ? stop() : start())}
                  className="relative flex-1 min-h-0 overflow-hidden cursor-pointer bg-[#050607]"
                >
                  <div
                    ref={contentRef}
                    className="absolute inset-x-0 top-0 flex flex-col gap-2"
                    style={{
                      transform: `translateY(${hovered ? -offset : 0}px)`,
                      transition: hovered
                        ? `transform ${duration}s ${GLIDE}`
                        : `transform 900ms ${EASE}`,
                      willChange: 'transform',
                    }}
                  >
                    {project.images.map((src, i) =>
                      failed[i] ? (
                        <div
                          key={src}
                          className="w-full aspect-[9/16] flex flex-col items-center justify-center gap-2 bg-[#23430C]/30 px-3 text-center"
                        >
                          <Layers className="w-7 h-7 text-[#BBE351]" />
                          <span className="font-display font-black text-white text-base">
                            {project.title}
                          </span>
                          <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">
                            Add screenshot
                          </span>
                        </div>
                      ) : (
                        <img
                          key={src}
                          src={src}
                          alt={`${project.title} mobile screenshot ${i + 1}`}
                          draggable={false}
                          onLoad={measure}
                          onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                          className="block w-full h-auto select-none"
                        />
                      ),
                    )}

                    <div className="h-8" />
                  </div>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30 bg-[#050607] flex flex-col items-center justify-center"
                style={{
                  opacity: on ? 0 : 1,
                  transition: 'opacity 800ms ease',
                }}
              >
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: phase === 'boot' ? 1 : 0,
                    transition: 'opacity 900ms ease',
                  }}
                >
                  <div className="scale-75">
                    <DoomLogo variant="lockup" size="sm" />
                  </div>

                  <div className="mt-4 w-[34%] min-w-[60px] max-w-[110px] h-[3px] rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{
                        width: phase === 'off' ? '0%' : '100%',
                        transition:
                          phase === 'boot'
                            ? `width ${BOOT_MS - 300}ms ${BAR_EASE}`
                            : 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[7px] left-1/2 -translate-x-1/2 z-40 w-[30%] h-[17px] rounded-full bg-[#050607] border border-white/5"
              />

              <div className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 w-[28%] h-[3px] rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center min-h-[20px]">
        <div
          className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#BBE351]"
          style={{
            opacity: on && !hovered ? 1 : 0,
            transition: 'opacity 400ms ease',
          }}
        >
          <MousePointer2 className="w-3 h-3" />
          <span>{canHover ? 'Hover to scroll' : 'Click to scroll'}</span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Slide: device + description                                         */
/* ------------------------------------------------------------------ */

const ProjectSlide: React.FC<{
  project: Project;
  active: boolean;
}> = ({ project, active }) => {
  const text = (d: number): React.CSSProperties => ({
    opacity: active ? 1 : 0,
    transform: active ? 'translateX(0)' : 'translateX(28px)',
    transition: `opacity 700ms ${EASE} ${active ? d : 0}ms, transform 700ms ${EASE} ${active ? d : 0}ms`,
  });

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center px-1 sm:px-4">
      <div className="lg:col-span-7">
        {project.category === 'Mobile' ? (
          <MobileProjectMonitor project={project} active={active} />
        ) : (
          <ProjectMonitor project={project} active={active} />
        )}
      </div>

      <div className="lg:col-span-5 text-left">
        <div
          style={text(300)}
          className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em]"
        >
          <span className="text-[#BBE351] font-bold">{project.category}</span>
          <span className="text-white/40">{project.index}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-[#BBE351]/70 to-transparent" />
        </div>

        <h3
          style={text(380)}
          className="mt-3 font-display font-black uppercase tracking-tight leading-[0.95] text-white text-4xl sm:text-5xl"
        >
          {project.title}
        </h3>

        <p
          style={text(440)}
          className="mt-2 text-xs font-mono font-semibold text-[#BBE351]"
        >
          {project.tagline}
        </p>

        <p
          style={text(500)}
          className="mt-4 text-sm text-white/70 font-sans leading-relaxed"
        >
          {project.description}
        </p>

        <ul style={text(560)} className="mt-4 space-y-2">
          {project.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2.5 text-xs text-white/85 font-sans leading-snug"
            >
              <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[#BBE351]/15 border border-[#BBE351]/40 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-[#BBE351]" />
              </span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div style={text(620)} className="mt-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Tech stack
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1.5 rounded-md bg-[#050607] border border-[#23430C] hover:border-[#BBE351] text-[11px] font-mono text-white/85 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {project.repo && (
          <div style={text(680)} className="mt-6">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              tabIndex={active ? 0 : -1}
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-[#23430C] hover:border-[#BBE351] hover:text-[#BBE351] text-white/80 text-[11px] font-mono uppercase tracking-wider transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View Source</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Projects section                                                    */
/* ------------------------------------------------------------------ */

export const ProjectsShowcase: React.FC = () => {
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [index, setIndex] = useState(0);
  const [sliderRef, sliderInView] = useInView<HTMLDivElement>(0.2);
  const touchX = useRef<number | null>(null);
  const reduced = prefersReducedMotion();

  const visible = PROJECTS.filter(
    (p) => filter === 'All' || p.category === filter,
  );

  const total = visible.length;

  const go = (i: number) => {
    if (total === 0) return;
    sound.playClick();
    setIndex(((i % total) + total) % total);
  };

  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;

    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;

    if (Math.abs(dx) > 60) {
      (dx < 0 ? next : prev)();
    }
  };

  return (
    <section
      id="projects"
      className="py-20 bg-[#050607] border-t border-[#23430C] relative overflow-hidden"
    >
      <style>{PROJECTS_CSS}</style>
      <ProjectsBackdrop />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#BBE351]/40 bg-[#050607]/70 backdrop-blur-sm text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.04em] text-[#BBE351]">
            <span className="relative flex w-2.5 h-2.5 shrink-0">
              <span className="absolute inset-0 rounded-full bg-[#BBE351] opacity-60 animate-ping" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-[#BBE351]" />
            </span>
            <span>Selected Work // Case Files</span>
            <span className="pm-blink">_</span>
          </div>

          <h2 className="mt-4 font-display font-black uppercase tracking-tight leading-[0.95] text-white text-5xl sm:text-6xl lg:text-7xl">
            Where Ideas
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BBE351] to-white">
              Get Compiled.
            </span>
          </h2>

          <p className="mt-5 font-display font-bold uppercase tracking-wide text-[#BBE351] text-sm sm:text-lg">
            Pixels. Pipelines. Products.
          </p>

          <p className="mt-3 text-sm sm:text-base text-white/70 max-w-3xl font-sans leading-relaxed">
            A closer look at the products we have designed and built. Slide through the projects, and
            hover over any screen to glide through the full page.
          </p>
        </Reveal>

        {/* ---------- filters ---------- */}
        {/* <Reveal delay={100} className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                sound.playClick();
                setFilter(f);
                setIndex(0);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`px-4 h-9 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider transition-colors ${filter === f
                  ? 'bg-[#BBE351] text-[#050607] border-[#BBE351]'
                  : 'border-[#23430C] text-white/70 hover:border-[#BBE351] hover:text-[#BBE351]'
                }`}
            >
              {f}
            </button>
          ))}
        </Reveal> */}

        {/* ---------- slider ---------- */}
        <div
          ref={sliderRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-roledescription="carousel"
          aria-label="Projects"
          className="outline-none focus-visible:ring-1 focus-visible:ring-[#BBE351]/50 rounded-2xl"
        >
          {/* Viewport and side navigation arrows */}
          <div className="relative">
            <button
              type="button"
              onClick={prev}
              onMouseEnter={() => sound.playHover()}
              aria-label="Previous project"
              className="cursor-pointer absolute left-0 sm:left-2 lg:left-4 top-1/2 z-20 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/50 bg-[#050607]/80 backdrop-blur-sm hover:border-[#BBE351] hover:bg-[#BBE351] hover:text-[#050607] text-white flex items-center justify-center transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="overflow-hidden py-8 px-8 sm:px-16 lg:px-20">
              <div
                className="flex"
                style={{
                  transform: `translateX(-${index * 100}%)`,
                  transition: reduced
                    ? 'none'
                    : `transform ${SLIDE_MS}ms ${EASE}`,
                }}
              >
                {visible.map((p, i) => {
                  const isActive = i === index;

                  return (
                    <div
                      key={p.id}
                      className="basis-full shrink-0 grow-0 flex items-center"
                      aria-hidden={!isActive}
                      style={{
                        visibility: isActive ? 'visible' : 'hidden',
                        transition: isActive
                          ? 'visibility 0s'
                          : `visibility 0s linear ${
                              reduced ? 0 : SLIDE_MS
                            }ms`,
                      }}
                    >
                      <ProjectSlide
                        project={p}
                        active={isActive && sliderInView}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={next}
              onMouseEnter={() => sound.playHover()}
              aria-label="Next project"
              className="cursor-pointer absolute right-0 sm:right-2 lg:right-4 top-1/2 z-20 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/50 bg-[#050607]/80 backdrop-blur-sm hover:border-[#BBE351] hover:bg-[#BBE351] hover:text-[#050607] text-white flex items-center justify-center transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Standard slider pagination dots */}
          <div
            className="mt-4 flex items-center justify-center gap-2.5"
            aria-label="Choose a project"
          >
            {visible.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => go(i)}
                onMouseEnter={() => sound.playHover()}
                aria-label={`Go to project ${i + 1}: ${p.title}`}
                aria-current={i === index ? 'true' : undefined}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? 'w-8 bg-[#BBE351] shadow-[0_0_12px_rgba(187,227,81,0.55)]'
                    : 'w-2.5 bg-white/30 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Current project indicator */}
          <div className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] text-white/45 tabular-nums">
            <span className="text-[#BBE351]">
              {pad(index + 1)}
            </span>{' '}
            / {pad(total)}
          </div>
        </div>

        {/* ---------- bottom call to action ---------- */}
        <Reveal className="mt-24">
          <div className="relative rounded-2xl border border-[#23430C] bg-[#050607]/80 overflow-hidden p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-[0_0_50px_rgba(187,227,81,0.07)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-0 w-[420px] h-[240px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(187,227,81,0.14), transparent 70%)',
              }}
            />

            <div className="relative">
              <h4 className="font-display font-black uppercase tracking-tight text-white text-2xl sm:text-3xl leading-tight">
                Your project could be
                <span className="text-[#BBE351]"> next on this wall.</span>
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-white/70 font-sans">
                Tell us what you want to build. We will take it from idea to launch.
              </p>
            </div>

            <a
              href="#contact"
              onClick={() => sound.playConfirm()}
              className="relative shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BBE351] hover:bg-white text-[#050607] font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(187,227,81,0.5)] active:scale-95"
            >
              <span>Start A Project</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};