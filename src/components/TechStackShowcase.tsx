/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Tech = {
  id: string;
  name: string;
  kind: string; // first chip on the card
  tagline: string;
  description: string;
  tags: string[]; // tags[0] is the second chip on the card
  image: string; // file in public/tech/
  url: string; // official site
};

const TECHS: Tech[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    kind: 'Framework',
    tagline: 'The React framework for production',
    description:
      'Next.js gives us fast server-rendered React apps with the App Router and Server Components. Pages load quickly and rank well in search.',
    tags: ['Frontend', 'Full-Stack'],
    image: '/tech/nextjs.svg',
    url: 'https://nextjs.org',
  },
  {
    id: 'react',
    name: 'React',
    kind: 'Library',
    tagline: 'Build UIs from simple components',
    description:
      'React lets us build interactive interfaces from small reusable parts. It is the base of our web apps and shares ideas with React Native for mobile.',
    tags: ['Frontend', 'Web Apps'],
    image: '/tech/react.svg',
    url: 'https://react.dev',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    kind: 'Language',
    tagline: 'JavaScript with safety nets',
    description:
      'TypeScript adds types on top of JavaScript. It catches bugs while we write code and keeps large projects easy to grow and maintain.',
    tags: ['Type Safety', 'Frontend'],
    image: '/tech/typescript.svg',
    url: 'https://www.typescriptlang.org',
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    kind: 'Styling',
    tagline: 'Utility-first styling',
    description:
      'Tailwind CSS lets us style fast without heavy component libraries. We turn Figma design tokens into clean theme settings.',
    tags: ['Design Tokens'],
    image: '/tech/tailwindcss.svg',
    url: 'https://tailwindcss.com',
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    kind: 'Animation',
    tagline: 'Smooth animation for React',
    description:
      'Framer Motion powers our spring-based micro-interactions and page transitions, so interfaces feel natural and responsive.',
    tags: ['Frontend'],
    image: '/tech/framer-motion.svg',
    url: 'https://www.framer.com/motion/',
  },
  {
    id: 'vite',
    name: 'Vite',
    kind: 'Build Tool',
    tagline: 'Instant dev server, fast builds',
    description:
      'Vite starts in milliseconds and builds optimized bundles. We use it for quick front-end projects and tools.',
    tags: ['Frontend'],
    image: '/tech/vite.svg',
    url: 'https://vite.dev',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    kind: 'Runtime',
    tagline: 'JavaScript on the server',
    description:
      'Node.js lets us run JavaScript on the back end, so one language can power the whole product. Great for fast APIs and real-time features.',
    tags: ['Backend', 'APIs'],
    image: '/tech/nodejs.svg',
    url: 'https://nodejs.org',
  },
  {
    id: 'python',
    name: 'Python',
    kind: 'Language',
    tagline: 'Readable, powerful, versatile',
    description:
      'Python is simple to read and quick to write. We use it for back-end services, data pipelines and AI / machine learning features.',
    tags: ['AI / ML', 'Backend'],
    image: '/tech/python.svg',
    url: 'https://www.python.org',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    kind: 'Database',
    tagline: 'The reliable relational database',
    description:
      'PostgreSQL stores your data safely with strong consistency. We design clean schemas, add indexes and run automated migrations.',
    tags: ['SQL'],
    image: '/tech/postgresql.svg',
    url: 'https://www.postgresql.org',
  },
  {
    id: 'express',
    name: 'Express',
    kind: 'Framework',
    tagline: 'Minimal web framework for Node.js',
    description:
      'Express is a small, flexible framework for building REST APIs. We add validation, rate-limiting and error handling on top.',
    tags: ['Backend', 'REST APIs'],
    image: '/tech/express.svg',
    url: 'https://expressjs.com',
  },
  {
    id: 'docker',
    name: 'Docker',
    kind: 'DevOps',
    tagline: 'Same setup everywhere',
    description:
      'Docker packages your app and its settings into containers, so it runs the same on a laptop, a server or the cloud.',
    tags: ['Deployment'],
    image: '/tech/docker.svg',
    url: 'https://www.docker.com',
  },
  {
    id: 'redis',
    name: 'Redis',
    kind: 'Cache',
    tagline: 'In-memory speed for your data',
    description:
      'Redis is a very fast in-memory store. We use it for caching, sessions and queues to keep apps quick under heavy load.',
    tags: ['Database'],
    image: '/tech/redis.svg',
    url: 'https://redis.io',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    kind: 'Payments',
    tagline: 'Payments made simple',
    description:
      'Stripe handles online payments and billing. We connect checkout, subscriptions and webhooks safely into your product.',
    tags: ['Billing'],
    image: '/tech/stripe.svg',
    url: 'https://stripe.com',
  },
  {
    id: 'git',
    name: 'Git',
    kind: 'Version Control',
    tagline: 'Version control for every change',
    description:
      'Git tracks every change in the code. We hand over a clean, modular codebase in a private GitHub repository.',
    tags: ['GitHub'],
    image: '/tech/git.svg',
    url: 'https://git-scm.com',
  },
  {
    id: 'react-native',
    name: 'React Native',
    kind: 'Mobile',
    tagline: 'Real mobile apps with React',
    description:
      'React Native builds iOS and Android apps from one codebase, with native gestures, smooth frame rates and device features.',
    tags: ['Cross-Platform'],
    image: '/tech/react-native.svg',
    url: 'https://reactnative.dev',
  },
  {
    id: 'expo',
    name: 'Expo',
    kind: 'Mobile',
    tagline: 'Faster React Native development',
    description:
      'Expo makes mobile development easier with ready tools for testing, building and shipping apps to the app stores.',
    tags: ['Tooling'],
    image: '/tech/expo.svg',
    url: 'https://expo.dev',
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    kind: 'ML',
    tagline: 'Deep learning framework',
    description:
      'PyTorch is a flexible framework for building and training machine learning models and custom data processing pipelines.',
    tags: ['Python'],
    image: '/tech/pytorch.svg',
    url: 'https://pytorch.org',
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    kind: 'AI / LLM',
    tagline: 'LLMs inside your product',
    description:
      'We connect large language models to your software for chat, summaries, search and automation, with fallback handling and usage monitoring.',
    tags: ['API'],
    image: '/tech/openai.svg',
    url: 'https://platform.openai.com/docs',
  },
  {
    id: 'langchain',
    name: 'LangChain',
    kind: 'AI / LLM',
    tagline: 'Framework for LLM workflows',
    description:
      'LangChain helps us build agent-style workflows and prompt pipelines that connect LLMs to your data and tools.',
    tags: ['Agents'],
    image: '/tech/langchain.svg',
    url: 'https://www.langchain.com',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    kind: 'Framework',
    tagline: 'Fast Python APIs',
    description:
      'FastAPI is a high-performance Python framework. We use it for AI microservices and for background tasks that take a long time.',
    tags: ['Python'],
    image: '/tech/fastapi.svg',
    url: 'https://fastapi.tiangolo.com',
  },
  {
    id: 'vector-db',
    name: 'Vector DBs',
    kind: 'AI / ML',
    tagline: 'Semantic search for AI',
    description:
      'Vector databases like Pinecone and Chroma store meaning, not just words. We use them for semantic search and smarter AI answers.',
    tags: ['Search'],
    image: '/tech/vector-db.svg',
    url: 'https://www.pinecone.io',
  },
];

/* ------------------------------------------------------------------ */
/*  Palette                                                            */
/* ------------------------------------------------------------------ */

const PRIMARY = '#BBE351';
const BG = '#050607';
const SECONDARY = '#234200';
const TEXT = '#FFFFFF';

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

const AUTO_SLIDE_MS = 4000;
const ASPECT = 1.12;

// Same space above and below the section content.
// Change this one number to change both.
const SECTION_PAD = 96;

// Background shapes
const SHAPE_OPACITY = 1; // overall strength of the paper-cut shapes, 0 to 1
const GRAIN_OPACITY = 0.05; // 0 to 1, set to 0 to remove the grain

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

type Phase = 'stack' | 'row' | 'carousel';

// Index 0 = center card, 1 = next to center, and so on.
// Left and right sides use the same values, so the slider is balanced.
const SCALE = [1.28, 0.92, 0.8, 0.7];
const SPACE = [0, 1.02, 1.82, 2.45];
const OPACITY = [1, 0.8, 0.5, 0.22];
const BRIGHT = [1, 0.62, 0.5, 0.42];

const even = (v: number) => Math.round(v / 2) * 2;

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const pad = (v: number) => String(v).padStart(2, '0');

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/*  Selectable text                                                    */
/* ------------------------------------------------------------------ */

const textProps = {
  'data-text': true,
  style: {
    cursor: 'text',
    userSelect: 'text',
  } as React.CSSProperties,
};

/* ------------------------------------------------------------------ */
/*  Logo                                                               */
/* ------------------------------------------------------------------ */

function Logo({ tech }: { tech: Tech }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="font-bold"
        style={{
          fontSize: '0.2em',
          color: BG,
        }}
        aria-hidden="true"
      >
        {tech.name.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={tech.image}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Chevron                                                            */
/* ------------------------------------------------------------------ */

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Status pill with pulsing "active" dot                              */
/* ------------------------------------------------------------------ */

function StatusPill({ label }: { label: string }) {
  return (
    <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-[#BBE351]/30 bg-[#BBE351]/5 px-5 py-2">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {/* Pulsing ring */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#BBE351] opacity-75 motion-reduce:animate-none" />
        {/* Solid dot */}
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#BBE351] shadow-[0_0_8px_#BBE351]" />
      </span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#BBE351] sm:text-xs">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section background (decorative only, matte)                        */
/*  Flat BG (#050607) with layered "paper-cut" organic shapes in       */
/*  SECONDARY (#234200). Solid fills only: no lines, grid, fade or     */
/*  glow. The shapes sit in two opposite corners and a light grain     */
/*  gives a paper-like finish.                                         */
/* ------------------------------------------------------------------ */

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

// One corner made of three stacked flat layers (large, medium, small).
function CornerShapes() {
  return (
    <>
      <path
        d="M0 0 H560 C520 95 455 160 360 200 C265 240 150 232 78 305 C34 350 10 400 0 450 Z"
        fill={SECONDARY}
        fillOpacity="0.28"
      />
      <path
        d="M0 0 H370 C338 75 285 118 222 140 C150 165 78 182 0 262 Z"
        fill={SECONDARY}
        fillOpacity="0.5"
      />
      <path
        d="M0 0 H175 C152 45 108 78 0 112 Z"
        fill={SECONDARY}
        fillOpacity="0.85"
      />
    </>
  );
}

function SectionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ background: BG }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: SHAPE_OPACITY }}
      >
        {/* Top-left corner */}
        <CornerShapes />

        {/* Bottom-right corner (same shapes turned upside down) */}
        <g transform="rotate(180 600 400)">
          <CornerShapes />
        </g>

        {/* A few small solid dots, scattered */}
        <g fill={SECONDARY} fillOpacity="0.7">
          <circle cx="690" cy="86" r="5" />
          <circle cx="748" cy="132" r="3" />
          <circle cx="1010" cy="214" r="6" />
          <circle cx="1088" cy="150" r="3" />
          <circle cx="510" cy="714" r="5" />
          <circle cx="452" cy="668" r="3" />
          <circle cx="190" cy="586" r="6" />
          <circle cx="112" cy="650" r="3" />
        </g>
      </svg>

      {/* Light grain for a matte, paper-like finish */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          backgroundSize: '160px 160px',
          opacity: GRAIN_OPACITY,
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export function TechStackShowcase() {
  const n = TECHS.length;

  const reduced = useRef(prefersReducedMotion()).current;

  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduced ? 'carousel' : 'stack');
  const [started, setStarted] = useState(reduced);
  const [inView, setInView] = useState(false);
  const [kbFocus, setKbFocus] = useState(false);
  const [holding, setHolding] = useState(false);
  const [cw, setCw] = useState(1200);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  /* Start intro when section enters viewport */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Track carousel width */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    setCw(el.clientWidth);

    const ro = new ResizeObserver(([entry]) => {
      setCw(entry.contentRect.width);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Intro timeline: stack -> row -> carousel */
  useEffect(() => {
    if (!started) return;

    if (phase === 'stack') {
      const t = setTimeout(() => setPhase('row'), 700);
      return () => clearTimeout(t);
    }

    if (phase === 'row') {
      const t = setTimeout(() => setPhase('carousel'), 2000);
      return () => clearTimeout(t);
    }
  }, [phase, started]);

  /* Release mouse/finger hold */
  useEffect(() => {
    const release = () => setHolding(false);

    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);

    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
    };
  }, []);

  /* Auto slide */
  useEffect(() => {
    if (phase !== 'carousel' || holding || kbFocus || !inView || reduced) {
      return;
    }

    const t = setTimeout(() => {
      setActive((a) => (a + 1) % n);
    }, AUTO_SLIDE_MS);

    return () => clearTimeout(t);
  }, [phase, holding, kbFocus, inView, reduced, n, active]);

  /* Navigation */
  const step = (dir: 1 | -1) => {
    setActive((a) => (a + dir + n) % n);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  /* Geometry */
  const W = Math.round(
    Math.min(240, Math.max(135, cw < 640 ? cw * 0.19 : cw * 0.2)),
  );

  const H = Math.round(W * ASPECT);

  // Every card is built at the largest size and scaled down with
  // transform. This keeps text sharp and prevents layout reflow.
  const CARD_W = even(W * SCALE[0]);
  const CARD_H = even(CARD_W * ASPECT);

  const rowGap = Math.min(W * 0.66, (cw * 0.94) / n);
  const rowScale = (rowGap * 0.86) / W;

  /* Relative position of a card to the active one */
  const offsetOf = (i: number) => {
    let d = (((i - active) % n) + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  /* Card layout */
  const layoutOf = (i: number) => {
    const off = offsetOf(i);
    const a = Math.abs(off);

    let tx = 0;
    let sc = 1;
    let op = 1;
    let z = 1;
    let bright = 1;
    let delay = 0;

    if (phase === 'stack') {
      const k = Math.min(i, 6);

      tx = k * 9;
      sc = 1.05 - k * 0.02;
      op = i < 7 ? 1 : 0;
      z = n - i;
      bright = 1 - k * 0.09;
    } else if (phase === 'row') {
      tx = (i - (n - 1) / 2) * rowGap;
      sc = rowScale;
      z = i;
      bright = 0.9;
      delay = i * 40;
    } else if (a <= 3) {
      tx = Math.sign(off) * SPACE[a] * W;
      sc = SCALE[a];
      op = OPACITY[a];
      z = 10 - a;
      bright = BRIGHT[a];
    } else {
      tx = Math.sign(off) * SPACE[3] * W;
      sc = 0.6;
      op = 0;
      z = 0;
      bright = 0.4;
    }

    return { a, tx, sc, op, z, bright, delay };
  };

  /* Card styles */
  const cardStyle = (i: number): React.CSSProperties => {
    const { a, tx, sc, op, z, delay } = layoutOf(i);

    return {
      width: CARD_W,
      height: CARD_H,

      // All text inside the card scales together.
      fontSize: CARD_W,

      marginLeft: -CARD_W / 2,
      marginTop: -CARD_H / 2,

      transform: `translateX(${Math.round(tx)}px) scale(${sc / SCALE[0]})`,

      opacity: op,
      zIndex: z,

      transitionDelay: `${delay}ms`,
      transitionDuration: phase === 'carousel' ? '800ms' : '1100ms',

      pointerEvents: phase === 'carousel' && op > 0 ? 'auto' : 'none',

      // Active card: bright ring + green glow. Others: soft dark shadow.
      boxShadow:
        phase === 'carousel' && a === 0
          ? `
              0 0 0 1px ${PRIMARY}80,
              0 0 34px 2px ${PRIMARY}59,
              0 30px 80px -20px ${PRIMARY}80,
              inset 0 1px 0 ${PRIMARY}66
            `
          : `0 10px 30px -15px ${BG}`,
    };
  };

  const tech = TECHS[active];

  /* ================================================================= */
  /* Render                                                            */
  /* ================================================================= */

  return (
    <section
      id="tech"
      ref={sectionRef}
      className="relative isolate overflow-hidden"
      style={{
        background: BG,
        color: TEXT,
        // Equal top and bottom spacing
        paddingTop: SECTION_PAD,
        paddingBottom: SECTION_PAD,
      }}
      aria-label="Technologies we use"
    >
      <style>{`
        @keyframes techInfoIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: none;
          }
        }

        .tech-info {
          animation: techInfoIn .55s cubic-bezier(.22,1,.36,1) both;
        }

        .tech-card {
          transition-property: transform, opacity, box-shadow, border-color;
          transition-timing-function: cubic-bezier(.22,1,.36,1);
          cursor: pointer;
        }

        @media (prefers-reduced-motion: reduce) {
          .tech-card {
            transition: none !important;
          }

          .tech-info {
            animation: none;
          }
        }
      `}</style>

      {/* Background */}
      <SectionBackground />

      {/* Heading */}
      <div
        className={`
          mx-auto
          w-full
          max-w-[1200px]
          px-6
          transition-all
          duration-1000
          ${started ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5">
            <StatusPill label={`Squad Armory // Online · ${n}/${n} Tools Ready`} />
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Technologies we build with
          </h2>

          <p className="mt-4 text-base text-white/60 sm:text-lg">
            We pick the right tool for every product. Here is the full stack
            behind the software we ship.
          </p>
        </div>
      </div>

      {/* Carousel Stage */}
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Technologies"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={(e) => setKbFocus(e.target.matches(':focus-visible'))}
        onBlur={() => setKbFocus(false)}
        onPointerDown={(e) => {
          setHolding(true);

          // Starting a press on text allows normal text selection
          // instead of triggering swipe behavior.
          const onText = (e.target as HTMLElement).closest('[data-text]');

          dragStart.current = onText ? null : e.clientX;
        }}
        onPointerUp={(e) => {
          if (dragStart.current === null || phase !== 'carousel') {
            return;
          }

          const dx = e.clientX - dragStart.current;

          dragStart.current = null;

          if (Math.abs(dx) > 45) {
            step(dx < 0 ? 1 : -1);
          }
        }}
        className={`
          relative
          mx-auto
          mt-10
          w-full
          max-w-[1200px]
          px-6
          select-none
          outline-none
          transition-opacity
          duration-700
          ${started ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          height: H * 1.35,
          touchAction: 'pan-y',
        }}
      >
        {/* Glow behind the active card */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            transition-opacity
            duration-[900ms]
          "
          style={{
            width: Math.min(cw * 1.1, W * 5.6),
            height: H * 1.25,
            transform: 'translate(-50%, -50%)',
            background: `
              radial-gradient(
                closest-side,
                ${PRIMARY}99 0%,
                ${SECONDARY}cc 55%,
                transparent 100%
              )
            `,
            filter: 'blur(28px)',
            opacity: phase === 'carousel' ? 1 : 0,
          }}
        />

        {/* Cards */}
        {TECHS.map((t, i) => {
          const isActive = i === active && phase === 'carousel';

          return (
            <div
              key={t.id}
              role="button"
              tabIndex={isActive ? 0 : -1}
              onClick={() => phase === 'carousel' && setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              aria-label={`${t.name}${isActive ? ' (selected)' : ''}`}
              aria-current={isActive}
              className="
                tech-card
                absolute
                left-1/2
                top-1/2
                overflow-hidden
                rounded-2xl
                border
                text-left
                outline-none
                focus-visible:ring-2
                focus-visible:ring-[#BBE351]
              "
              style={{
                ...cardStyle(i),

                backgroundColor: BG,

                // Active card gets a brighter green top so it stands out.
                background: isActive
                  ? `
                    linear-gradient(
                      165deg,
                      ${PRIMARY}33 0%,
                      ${SECONDARY} 42%,
                      ${BG} 100%
                    )
                  `
                  : `
                    linear-gradient(
                      165deg,
                      ${SECONDARY} 0%,
                      ${BG} 100%
                    )
                  `,

                borderColor: isActive
                  ? PRIMARY
                  : 'rgba(255,255,255,0.1)',
              }}
            >
              {/* Dot grid texture */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(
                      ${PRIMARY}30 1px,
                      transparent 1.6px
                    )
                  `,
                  backgroundSize: '0.06em 0.06em',
                  WebkitMaskImage: `
                    linear-gradient(
                      to bottom,
                      #000 0%,
                      transparent 70%
                    )
                  `,
                  maskImage: `
                    linear-gradient(
                      to bottom,
                      #000 0%,
                      transparent 70%
                    )
                  `,
                }}
              />

              {/* Image glow */}
              <div
                className="absolute rounded-full"
                style={{
                  left: '0.04em',
                  top: '0.06em',
                  width: '0.92em',
                  height: '0.92em',
                  background: `
                    radial-gradient(
                      closest-side,
                      ${PRIMARY}${isActive ? '66' : '40'},
                      transparent
                    )
                  `,
                }}
              />

              {/* Bottom readability fade (lighter on the active card) */}
              <div
                className="absolute inset-0"
                style={{
                  background: isActive
                    ? `
                      linear-gradient(
                        to bottom,
                        transparent 55%,
                        ${BG}b3 100%
                      )
                    `
                    : `
                      linear-gradient(
                        to bottom,
                        transparent 45%,
                        ${BG}f2 100%
                      )
                    `,
                }}
              />

              {/* Number badge (01, 02, ...) */}
              <div
                className="absolute flex justify-end"
                style={{
                  right: '0.07em',
                  top: '0.06em',
                }}
              >
                <span
                  {...textProps}
                  className="rounded-full border font-semibold"
                  style={{
                    ...textProps.style,
                    background: isActive ? PRIMARY : `${BG}b3`,
                    borderColor: isActive ? PRIMARY : `${PRIMARY}59`,
                    color: isActive ? BG : TEXT,
                    fontSize: '0.06em',
                    padding: '0.2em 0.7em',
                  }}
                >
                  {pad(i + 1)}
                </span>
              </div>

              {/* Logo */}
              <div
                className="absolute"
                style={{
                  left: '0.25em',
                  top: '0.15em',
                  width: '0.5em',
                  height: '0.5em',
                }}
              >
                {/* Decorative rings */}
                <div
                  className="absolute rounded-full border"
                  style={{
                    inset: '-0.07em',
                    borderColor: `${PRIMARY}${isActive ? '66' : '33'}`,
                  }}
                />

                <div
                  className="absolute rounded-full border"
                  style={{
                    inset: '-0.14em',
                    borderColor: `${PRIMARY}${isActive ? '33' : '1a'}`,
                  }}
                />

                {/* Logo tile */}
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  "
                  style={{
                    borderRadius: '0.13em',
                    padding: '0.085em',
                    backgroundColor: TEXT,
                    backgroundImage: `
                      radial-gradient(
                        circle at 15% 10%,
                        transparent 45%,
                        ${PRIMARY}59 100%
                      )
                    `,
                    border: `0.008em solid ${PRIMARY}`,
                    boxShadow: `
                      0 0 0 0.02em ${PRIMARY}40,
                      0 0.07em 0.18em ${PRIMARY}55
                    `,
                  }}
                >
                  <Logo tech={t} />
                </div>
              </div>

              {/* Card information: name + chips */}
              <div
                className="absolute"
                style={{
                  left: '0.07em',
                  right: '0.07em',
                  bottom: '0.06em',
                }}
              >
                <div
                  {...textProps}
                  className="w-fit font-bold leading-tight"
                  style={{
                    ...textProps.style,
                    fontSize: '0.11em',
                    color: TEXT,
                  }}
                >
                  {t.name}
                </div>

                <div
                  className="flex items-center"
                  style={{
                    marginTop: '0.012em',
                    gap: '0.025em',
                  }}
                >
                  {[t.kind, t.tags[0]].map((chip, ci) => (
                    <span
                      key={chip}
                      {...textProps}
                      className="rounded-full border"
                      style={{
                        ...textProps.style,
                        fontSize: '0.05em',
                        padding: '0.18em 0.65em',
                        color: ci === 0 ? BG : TEXT,
                        background:
                          ci === 0 ? PRIMARY : 'rgba(255,255,255,0.08)',
                        borderColor:
                          ci === 0 ? PRIMARY : 'rgba(255,255,255,0.15)',
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Side-card dimming */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: BG,
                  opacity: 1 - layoutOf(i).bright,
                  transition: 'opacity 800ms cubic-bezier(.22,1,.36,1)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Active Technology Information (no tag pills here) */}
      <div
        className={`
          mx-auto
          mt-6
          w-full
          max-w-[1200px]
          px-6
          text-center
          transition-opacity
          duration-700
          ${phase === 'carousel' ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          minHeight: 200,
        }}
      >
        <div className="mx-auto max-w-2xl">
          <p className="sr-only" aria-live="polite">
            {tech.name}: {tech.tagline}
          </p>

          <div key={tech.id} className="tech-info">
            {/* Name */}
            <h3 className="text-2xl font-bold sm:text-3xl">{tech.name}</h3>

            {/* Tagline */}
            <p
              className="mt-1 text-sm font-medium"
              style={{ color: PRIMARY }}
            >
              {tech.tagline}
            </p>

            {/* Description */}
            <p
              className="
                mt-4
                text-sm
                leading-relaxed
                text-white/65
                sm:text-base
              "
            >
              {tech.description}
            </p>

            {/* Official site */}
            <a
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#BBE351]
                px-6
                py-3
                text-sm
                font-semibold
                text-[#050607]
                transition
                hover:brightness-110
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-white
              "
            >
              Visit official site

              <span className="font-mono text-xs opacity-70">
                {hostOf(tech.url)}
              </span>

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className={`
          mt-8
          flex
          items-center
          justify-center
          gap-4
          px-6
          transition-opacity
          duration-700
          ${phase === 'carousel' ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Previous */}
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous technology"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            text-white/80
            transition
            hover:border-[#BBE351]
            hover:text-[#BBE351]
          "
        >
          <Chevron dir="left" />
        </button>

        {/* Counter */}
        <div
          className="min-w-[72px] text-center font-mono text-sm text-white/70"
          aria-hidden="true"
        >
          <span style={{ color: PRIMARY }}>{pad(active + 1)}</span>
          <span className="text-white/30"> / {pad(n)}</span>
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next technology"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            text-white/80
            transition
            hover:border-[#BBE351]
            hover:text-[#BBE351]
          "
        >
          <Chevron dir="right" />
        </button>
      </div>
    </section>
  );
}

export { TechStackShowcase as TechStackSection };

export default TechStackShowcase;