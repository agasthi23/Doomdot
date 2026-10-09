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
  year: number;
  kind: string;
  tagline: string;
  description: string;
  tags: string[];
  image: string; // file in public/tech/
  url: string; // official site
};

/* ================================================================== */
/*  IMAGES — put the language logo files in: public/tech/             */
/* ================================================================== */

const TECHS: Tech[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    year: 1995,
    kind: 'Scripting',
    tagline: 'The language of the web',
    description:
      'JavaScript runs in every browser and, with Node.js, on the server too. One language for the whole product means faster teams and simpler hiring.',
    tags: ['Frontend', 'Node.js', 'Full-Stack'],
    image: '/tech/javascript.svg',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    year: 2012,
    kind: 'Typed JS',
    tagline: 'JavaScript with safety nets',
    description:
      'TypeScript adds static types on top of JavaScript. It catches bugs while we write code and keeps big React and Node projects easy to grow and maintain.',
    tags: ['React', 'Node.js', 'Large Apps'],
    image: '/tech/typescript.svg',
    url: 'https://www.typescriptlang.org',
  },
  {
    id: 'python',
    name: 'Python',
    year: 1991,
    kind: 'General',
    tagline: 'Readable, powerful, versatile',
    description:
      'Python is simple to read and quick to write. We use it for APIs, automation, data processing and AI / machine learning features.',
    tags: ['Backend', 'AI / ML', 'Automation'],
    image: '/tech/python.svg',
    url: 'https://www.python.org',
  },
  {
    id: 'java',
    name: 'Java',
    year: 1995,
    kind: 'Compiled',
    tagline: 'Write once, run anywhere',
    description:
      'Java is a mature, fast and very reliable language that runs on the JVM. It is a strong choice for large enterprise back ends and long-living systems.',
    tags: ['Enterprise', 'Backend', 'Spring'],
    image: '/tech/java.svg',
    url: 'https://dev.java',
  },
  {
    id: 'csharp',
    name: 'C#',
    year: 2000,
    kind: 'Compiled',
    tagline: 'Modern language for .NET',
    description:
      "C# is Microsoft's modern, type-safe language for .NET. We use it for secure back-end services, desktop apps and games built with Unity.",
    tags: ['.NET', 'Desktop', 'Games'],
    image: '/tech/csharp.svg',
    url: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
  },
  {
    id: 'go',
    name: 'Go',
    year: 2009,
    kind: 'Compiled',
    tagline: 'Simple, fast, built for the cloud',
    description:
      'Created at Google, Go compiles fast and handles thousands of requests at once with ease. It is ideal for cloud services, APIs and DevOps tools.',
    tags: ['Cloud', 'Microservices', 'APIs'],
    image: '/tech/go.svg',
    url: 'https://go.dev',
  },
  {
    id: 'rust',
    name: 'Rust',
    year: 2015,
    kind: 'Systems',
    tagline: 'Fast and memory-safe',
    description:
      'Rust gives C++-level speed with strong memory safety and no garbage collector. We pick it when performance and safety both matter, including WebAssembly.',
    tags: ['Memory-Safe', 'WebAssembly', 'Performance'],
    image: '/tech/rust.svg',
    url: 'https://www.rust-lang.org',
  },
  {
    id: 'php',
    name: 'PHP',
    year: 1995,
    kind: 'Scripting',
    tagline: 'Server-side web workhorse',
    description:
      'PHP powers a huge part of the internet, including WordPress. With modern frameworks like Laravel it is a quick way to ship solid web back ends.',
    tags: ['Laravel', 'WordPress', 'Backend'],
    image: '/tech/php.svg',
    url: 'https://www.php.net',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    year: 2011,
    kind: 'Compiled',
    tagline: 'Concise and safe',
    description:
      'Kotlin, from JetBrains, is short, safe and fully compatible with Java. It is the preferred language for Android apps and works well on the server too.',
    tags: ['Android', 'Mobile', 'Backend'],
    image: '/tech/kotlin.svg',
    url: 'https://kotlinlang.org',
  },
  {
    id: 'cpp',
    name: 'C++',
    year: 1985,
    kind: 'Systems',
    tagline: 'Raw performance and control',
    description:
      'C++ gives direct control over hardware and memory. It is used for game engines, embedded software and any system where every millisecond counts.',
    tags: ['Games', 'Embedded', 'Performance'],
    image: '/tech/cpp.svg',
    url: 'https://isocpp.org',
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

const AUTO_SLIDE_MS = 5000;
const ASPECT = 1.12;

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

type Phase = 'stack' | 'row' | 'carousel';

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
    <path
      d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
    />
  </svg>
);

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export function TechStackShowcase() {
  const n = TECHS.length;

  const reduced = useRef(prefersReducedMotion()).current;

  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>(
    reduced ? 'carousel' : 'stack',
  );
  const [started, setStarted] = useState(reduced);
  const [inView, setInView] = useState(false);
  const [kbFocus, setKbFocus] = useState(false);
  const [holding, setHolding] = useState(false);
  const [cw, setCw] = useState(1200);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  /* ---------------------------------------------------------------- */
  /* Start intro when section enters viewport                          */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const el = sectionRef.current;

    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);

        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      {
        threshold: 0.35,
      },
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  /* ---------------------------------------------------------------- */
  /* Track carousel width                                             */
  /* ---------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------- */
  /* Intro timeline: stack -> row -> carousel                         */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!started) return;

    if (phase === 'stack') {
      const t = setTimeout(() => {
        setPhase('row');
      }, 700);

      return () => clearTimeout(t);
    }

    if (phase === 'row') {
      const t = setTimeout(() => {
        setPhase('carousel');
      }, 2000);

      return () => clearTimeout(t);
    }
  }, [phase, started]);

  /* ---------------------------------------------------------------- */
  /* Release mouse/finger hold                                        */
  /* ---------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------- */
  /* Auto slide                                                       */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (
      phase !== 'carousel' ||
      holding ||
      kbFocus ||
      !inView ||
      reduced
    ) {
      return;
    }

    const t = setTimeout(() => {
      setActive((a) => (a + 1) % n);
    }, AUTO_SLIDE_MS);

    return () => clearTimeout(t);
  }, [
    phase,
    holding,
    kbFocus,
    inView,
    reduced,
    n,
    active,
  ]);

  /* ---------------------------------------------------------------- */
  /* Navigation                                                       */
  /* ---------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------- */
  /* Geometry                                                         */
  /* ---------------------------------------------------------------- */

  /*
   * Mobile:
   * Slightly smaller cards give the carousel more breathing room.
   *
   * Desktop:
   * Original 20% sizing is preserved.
   */
  const W = Math.round(
    Math.min(
      240,
      Math.max(
        135,
        cw < 640 ? cw * 0.19 : cw * 0.2,
      ),
    ),
  );

  const H = Math.round(W * ASPECT);

  /*
   * Every card is built at the largest size and scaled down using
   * transform. This keeps text sharp and prevents layout reflow.
   */
  const CARD_W = even(W * SCALE[0]);
  const CARD_H = even(CARD_W * ASPECT);

  const rowGap = Math.min(
    W * 0.66,
    (cw * 0.94) / n,
  );

  const rowScale = (rowGap * 0.86) / W;

  /* ---------------------------------------------------------------- */
  /* Determine relative position                                      */
  /* ---------------------------------------------------------------- */

  const offsetOf = (i: number) => {
    let d = (((i - active) % n) + n) % n;

    if (d > n / 2) {
      d -= n;
    }

    return d;
  };

  /* ---------------------------------------------------------------- */
  /* Card layout                                                       */
  /* ---------------------------------------------------------------- */

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

    return {
      a,
      tx,
      sc,
      op,
      z,
      bright,
      delay,
    };
  };

  /* ---------------------------------------------------------------- */
  /* Card styles                                                       */
  /* ---------------------------------------------------------------- */

  const cardStyle = (
    i: number,
  ): React.CSSProperties => {
    const {
      a,
      tx,
      sc,
      op,
      z,
      delay,
    } = layoutOf(i);

    return {
      width: CARD_W,
      height: CARD_H,

      /*
       * All text inside the card scales together.
       */
      fontSize: CARD_W,

      marginLeft: -CARD_W / 2,
      marginTop: -CARD_H / 2,

      transform: `translateX(${Math.round(
        tx,
      )}px) scale(${sc / SCALE[0]})`,

      opacity: op,
      zIndex: z,

      transitionDelay: `${delay}ms`,
      transitionDuration:
        phase === 'carousel'
          ? '800ms'
          : '1100ms',

      pointerEvents:
        phase === 'carousel' && op > 0
          ? 'auto'
          : 'none',

      boxShadow:
        phase === 'carousel' && a === 0
          ? `0 30px 80px -25px ${PRIMARY}66`
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
      className="relative overflow-hidden py-24"
      style={{
        background: BG,
        color: TEXT,
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
          animation:
            techInfoIn
            .55s
            cubic-bezier(.22,1,.36,1)
            both;
        }

        .tech-card {
          transition-property:
            transform,
            opacity,
            box-shadow;

          transition-timing-function:
            cubic-bezier(.22,1,.36,1);

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

      {/* ============================================================ */}
      {/* Heading                                                       */}
      {/* ============================================================ */}

      <div
        className={`
          mx-auto
          w-full
          max-w-[1200px]
          px-6
          transition-all
          duration-1000
          ${
            started
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          }
        `}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[#BBE351]">
            // Our Tech Stack
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Languages we build with
          </h2>

          <p className="mt-4 text-base text-white/60 sm:text-lg">
            We pick the right tool for every product. Here
            are the core languages behind the software we
            ship.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Carousel Stage                                                */}
      {/* ============================================================ */}

      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Programming languages"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={(e) =>
          setKbFocus(
            e.target.matches(':focus-visible'),
          )
        }
        onBlur={() => setKbFocus(false)}
        onPointerDown={(e) => {
          setHolding(true);

          /*
           * Starting a press on text allows normal text
           * selection instead of triggering swipe behavior.
           */
          const onText = (
            e.target as HTMLElement
          ).closest('[data-text]');

          dragStart.current = onText
            ? null
            : e.clientX;
        }}
        onPointerUp={(e) => {
          if (
            dragStart.current === null ||
            phase !== 'carousel'
          ) {
            return;
          }

          const dx =
            e.clientX - dragStart.current;

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
          ${
            started
              ? 'opacity-100'
              : 'opacity-0'
          }
        `}
        style={{
          height: H * 1.35,
          touchAction: 'pan-y',
        }}
      >
        {/* ========================================================== */}
        {/* Glow                                                         */}
        {/* ========================================================== */}

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
            width: Math.min(
              cw * 1.1,
              W * 5.6,
            ),

            height: H * 1.25,

            transform:
              'translate(-50%, -50%)',

            background: `
              radial-gradient(
                closest-side,
                ${PRIMARY}80 0%,
                ${SECONDARY}99 55%,
                transparent 100%
              )
            `,

            filter: 'blur(28px)',

            opacity:
              phase === 'carousel'
                ? 1
                : 0,
          }}
        />

        {/* ========================================================== */}
        {/* Cards                                                        */}
        {/* ========================================================== */}

        {TECHS.map((t, i) => {
          const isActive =
            i === active &&
            phase === 'carousel';

          return (
            <div
              key={t.id}
              role="button"
              tabIndex={
                isActive ? 0 : -1
              }
              onClick={() =>
                phase === 'carousel' &&
                setActive(i)
              }
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' ||
                  e.key === ' '
                ) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              aria-label={`
                ${t.name}${
                  isActive
                    ? ' (selected)'
                    : ''
                }
              `}
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

                background: `
                  linear-gradient(
                    165deg,
                    ${SECONDARY} 0%,
                    ${BG} 100%
                  )
                `,

                borderColor: isActive
                  ? `${PRIMARY}99`
                  : 'rgba(255,255,255,0.1)',
              }}
            >
              {/* ---------------------------------------------------- */}
              {/* Dot grid texture                                      */}
              {/* ---------------------------------------------------- */}

              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(
                      ${PRIMARY}30 1px,
                      transparent 1.6px
                    )
                  `,

                  backgroundSize:
                    '0.06em 0.06em',

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

              {/* ---------------------------------------------------- */}
              {/* Image glow                                             */}
              {/* ---------------------------------------------------- */}

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
                      ${PRIMARY}40,
                      transparent
                    )
                  `,
                }}
              />

              {/* ---------------------------------------------------- */}
              {/* Bottom readability fade                                */}
              {/* ---------------------------------------------------- */}

              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      to bottom,
                      transparent 45%,
                      ${BG}f2 100%
                    )
                  `,
                }}
              />

              {/* ---------------------------------------------------- */}
              {/* Year                                                   */}
              {/* ---------------------------------------------------- */}

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

                    background: `${BG}b3`,
                    borderColor: `${PRIMARY}59`,
                    color: TEXT,

                    fontSize: '0.06em',
                    padding:
                      '0.2em 0.7em',
                  }}
                >
                  {t.year}
                </span>
              </div>

              {/* ---------------------------------------------------- */}
              {/* Language logo                                          */}
              {/* ---------------------------------------------------- */}

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
                    borderColor:
                      `${PRIMARY}33`,
                  }}
                />

                <div
                  className="absolute rounded-full border"
                  style={{
                    inset: '-0.14em',
                    borderColor:
                      `${PRIMARY}1a`,
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
                    borderRadius:
                      '0.13em',

                    padding:
                      '0.085em',

                    backgroundColor:
                      TEXT,

                    backgroundImage: `
                      radial-gradient(
                        circle at 15% 10%,
                        transparent 45%,
                        ${PRIMARY}59 100%
                      )
                    `,

                    border:
                      `0.008em solid ${PRIMARY}`,

                    boxShadow: `
                      0 0 0 0.02em ${PRIMARY}40,
                      0 0.07em 0.18em ${PRIMARY}55
                    `,
                  }}
                >
                  <Logo tech={t} />
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* Card information                                       */}
              {/* ---------------------------------------------------- */}

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
                  className="
                    w-fit
                    font-bold
                    leading-tight
                  "
                  style={{
                    ...textProps.style,
                    fontSize: '0.11em',
                    color: TEXT,
                  }}
                >
                  {t.name}
                </div>

                <div
                  className="
                    flex
                    items-center
                  "
                  style={{
                    marginTop:
                      '0.012em',

                    gap: '0.025em',
                  }}
                >
                  {[t.kind, t.tags[0]].map(
                    (chip, ci) => (
                      <span
                        key={chip}
                        {...textProps}
                        className="
                          rounded-full
                          border
                        "
                        style={{
                          ...textProps.style,

                          fontSize:
                            '0.05em',

                          padding:
                            '0.18em 0.65em',

                          color:
                            ci === 0
                              ? BG
                              : TEXT,

                          background:
                            ci === 0
                              ? PRIMARY
                              : 'rgba(255,255,255,0.08)',

                          borderColor:
                            ci === 0
                              ? PRIMARY
                              : 'rgba(255,255,255,0.15)',
                        }}
                      >
                        {chip}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* Side-card dimming                                     */}
              {/* ---------------------------------------------------- */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                "
                style={{
                  background: BG,

                  opacity:
                    1 -
                    layoutOf(i).bright,

                  transition:
                    'opacity 800ms cubic-bezier(.22,1,.36,1)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* Active Technology Information                                 */}
      {/* ============================================================ */}

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
          ${
            phase === 'carousel'
              ? 'opacity-100'
              : 'opacity-0'
          }
        `}
        style={{
          minHeight: 230,
        }}
      >
        <div className="mx-auto max-w-2xl">
          <p
            className="sr-only"
            aria-live="polite"
          >
            {tech.name}: {tech.tagline}
          </p>

          <div
            key={tech.id}
            className="tech-info"
          >
            {/* Tags */}

            <div
              className="
                mb-3
                flex
                flex-wrap
                justify-center
                gap-2
              "
            >
              {tech.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    border
                    border-white/15
                    px-3
                    py-1
                    text-xs
                    text-white/70
                  "
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Name */}

            <h3 className="text-2xl font-bold sm:text-3xl">
              {tech.name}
            </h3>

            {/* Tagline */}

            <p
              className="mt-1 text-sm font-medium"
              style={{
                color: PRIMARY,
              }}
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

      {/* ============================================================ */}
      {/* Controls                                                       */}
      {/* ============================================================ */}

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
          ${
            phase === 'carousel'
              ? 'opacity-100'
              : 'opacity-0'
          }
        `}
      >
        {/* Previous */}

        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous language"
          className="
            flex
            h-10
            w-10
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

        {/* Pagination */}

        <div className="flex items-center gap-2">
          {TECHS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${t.name}`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${
                  i === active
                    ? 'w-6 bg-[#BBE351]'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }
              `}
            />
          ))}
        </div>

        {/* Next */}

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next language"
          className="
            flex
            h-10
            w-10
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