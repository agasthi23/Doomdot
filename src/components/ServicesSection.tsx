import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { RobotAnchor } from './RobotCompanion.tsx';

interface ServiceOffering {
  number: string;
  index: number;
  id: string;
  title: string;
  buttonLabel: string;
  description: string;
  techTags: string[];
}

const SERVICES: ServiceOffering[] = [
  {
    number: '01',
    index: 0,
    id: 'front-end',
    title: 'FRONT-END DEVELOPMENT & UI/UX',
    buttonLabel: 'INQUIRE ABOUT FRONT-END',
    description:
      'We engineer immersive, pixel-perfect, and high-performance user interfaces optimized for speed, accessibility, and fluid user experiences across all devices.',
    techTags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    number: '02',
    index: 1,
    id: 'back-end',
    title: 'BACK-END ENGINEERING & SCALABLE APIS',
    buttonLabel: 'INQUIRE ABOUT BACK-END',
    description:
      'We build robust, secure server-side architectures and high-concurrency APIs designed to handle complex business logic reliably.',
    techTags: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Express', 'Docker'],
  },
  {
    number: '03',
    index: 2,
    id: 'full-stack',
    title: 'FULL-STACK WEB APPLICATIONS',
    buttonLabel: 'INQUIRE ABOUT FULL-STACK',
    description:
      'Turnkey end-to-end software development from database modeling to live cloud deployment, complete with secure authentication and third-party integrations.',
    techTags: ['MERN Stack', 'PostgreSQL', 'Stripe', 'Docker', 'Tailwind CSS', 'Next.js', 'AI Integration'],
  },
  {
    number: '04',
    index: 1,
    id: 'custom-software',
    title: 'CUSTOM SOFTWARE APPLICATIONS',
    buttonLabel: 'INQUIRE ABOUT CUSTOM SOFTWARE',
    description:
      'Purpose-built software solutions engineered around your business needs, combining intelligent automation, tailored application architecture, and seamless system integrations to streamline operations and solve complex challenges.',
    techTags: ['Python', 'C# / .NET', 'Flutter', 'Dart', 'PostgreSQL', 'AI Integration'],
  },
  {
    number: '05',
    index: 3,
    id: 'mobile-web',
    title: 'MOBILE APPLICATIONS',
    buttonLabel: 'INQUIRE ABOUT MOBILE & WEB',
    description:
      'Cross-platform mobile applications, we craft touch-optimized digital experiences with zero layout shifts.',
    techTags: ['React Native', 'Expo','Firebase'],
  },

  // {
  //   number: '05',
  //   index: 4,
  //   id: 'ai-integrations',
  //   title: 'AI & INTELLIGENT SYSTEM INTEGRATIONS',
  //   buttonLabel: 'INQUIRE ABOUT AI INTEGRATIONS',
  //   description:
  //     'We design and integrate intelligent systems—incorporating modern machine learning pipelines, LLMs, and automated workflow tools.',
  //   techTags: ['Python', 'PyTorch', 'OpenAI API', 'LangChain', 'FastAPI'],
  // },
];

// Floating particles for the animated background (fixed values so they never jump on re-render)
const PARTICLES = [
  { left: '4%', size: 3, duration: 14, delay: -2 },
  { left: '9%', size: 2, duration: 18, delay: -9 },
  { left: '15%', size: 4, duration: 12, delay: -5 },
  { left: '22%', size: 2, duration: 16, delay: -12 },
  { left: '29%', size: 3, duration: 20, delay: -7 },
  { left: '36%', size: 2, duration: 13, delay: -1 },
  { left: '43%', size: 4, duration: 17, delay: -10 },
  { left: '50%', size: 2, duration: 15, delay: -4 },
  { left: '57%', size: 3, duration: 19, delay: -14 },
  { left: '64%', size: 2, duration: 12, delay: -6 },
  { left: '71%', size: 4, duration: 16, delay: -11 },
  { left: '78%', size: 2, duration: 14, delay: -3 },
  { left: '84%', size: 3, duration: 18, delay: -8 },
  { left: '90%', size: 2, duration: 13, delay: -13 },
  { left: '95%', size: 4, duration: 17, delay: -5 },
  { left: '33%', size: 3, duration: 21, delay: -16 },
];

interface ServicesSectionProps {
  onOpenExtendedServices: (serviceId?: string) => void;
  onSelectServiceAndContact: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenExtendedServices,
  onSelectServiceAndContact,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [headingIn, setHeadingIn] = useState<boolean>(false);
  const runwayRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const prevIdxRef = useRef<number>(0);
  const totalServices = SERVICES.length;

  // Heading entrance animation: plays once when the heading scrolls into view
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHeadingIn(true);
      return;
    }
    const el = headingRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll synchronization: the pinned stage drives the active service.
  // Services change ONLY by scrolling (no click switching).
  useEffect(() => {
    const handleScroll = () => {
      if (!runwayRef.current) return;
      const rect = runwayRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      const targetIndex = Math.min(totalServices - 1, Math.floor(progress * totalServices));

      if (targetIndex !== prevIdxRef.current && targetIndex >= 0 && targetIndex < totalServices) {
        prevIdxRef.current = targetIndex;
        sound.playClick();
        setActiveIdx(targetIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalServices]);

  // Heading words (the accent words get the lime gradient)
  const HEADING_WORDS = [
    { text: 'Services', accent: false },
    { text: 'for', accent: false },
    { text: 'the', accent: true },
    { text: 'next', accent: true },
    { text: 'era.', accent: true },
  ];

  // Animation helpers: slide up + blur-to-sharp, staggered with a delay
  const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
  const revealWord = `inline-block transition-all duration-[900ms] ${ease} motion-reduce:transition-none ${
    headingIn ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-md'
  }`;
  const revealText = `transition-all duration-[900ms] ${ease} motion-reduce:transition-none ${
    headingIn ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-6 blur-sm'
  }`;
  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate bg-[#07090a] pb-30"
    >
      {/* Keyframes for the animated background and the live status dot */}
      <style>{`
        @keyframes svc-drift-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(8vw, 6vh, 0) scale(1.15); }
        }
        @keyframes svc-drift-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-7vw, -8vh, 0) scale(1.1); }
        }
        @keyframes svc-drift-c {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.9); }
          50% { transform: translate3d(5vw, -6vh, 0) scale(1.1); }
        }
        @keyframes svc-grid-move {
          from { background-position: 0 0; }
          to { background-position: 0 56px; }
        }
        @keyframes svc-scan {
          0% { transform: translateY(-20vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes svc-rise {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 0.9; }
          100% { transform: translateY(-105vh); opacity: 0; }
        }
        @keyframes svc-spark {
          0%, 100% { box-shadow: 0 0 4px 1px rgba(184,227,81,0.6); opacity: 1; transform: scale(1); }
          40% { box-shadow: 0 0 14px 4px rgba(184,227,81,0.95); opacity: 1; transform: scale(1.18); }
          50% { opacity: 0.55; }
          60% { opacity: 1; }
        }
        .svc-drift-a { animation: svc-drift-a 18s ease-in-out infinite; }
        .svc-drift-b { animation: svc-drift-b 22s ease-in-out infinite; }
        .svc-drift-c { animation: svc-drift-c 26s ease-in-out infinite; }
        .svc-grid { animation: svc-grid-move 3s linear infinite; }
        .svc-scan { animation: svc-scan 9s linear infinite; }
        .svc-particle { animation-name: svc-rise; animation-timing-function: linear; animation-iteration-count: infinite; }
        .svc-spark { animation: svc-spark 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .svc-drift-a, .svc-drift-b, .svc-drift-c, .svc-grid, .svc-scan, .svc-particle, .svc-spark {
            animation: none !important;
          }
        }
      `}</style>

      {/* Top and bottom glowing edge lines mark the section boundary */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B8E351]/50 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#23430C]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B8E351]/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#23430C]/30 to-transparent" />
      </div>

      {/* ================= SECTION HEADING (left aligned, matches Hero text edge) ================= */}
      <div className="relative w-full pt-30 pb-6 overflow-hidden">
        <div ref={headingRef} className="relative mx-auto w-full max-w-7xl px-6 text-left">
          <div className="relative">
            {/* Status pill with a sparking "active" dot */}
            <div
              className={`inline-flex items-center gap-3 rounded-full border border-[#B8E351]/30 bg-[#B8E351]/[0.06] backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 mb-4 sm:mb-5 shadow-[0_0_24px_rgba(184,227,81,0.12)] ${revealText}`}
              style={delay(0)}
            >
              <span className="relative flex w-2.5 h-2.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-[#B8E351] opacity-70 animate-ping" />
                <span className="svc-spark relative w-2.5 h-2.5 rounded-full bg-[#B8E351]" />
              </span>
              <span className="font-mono font-bold uppercase text-[10px] sm:text-xs lg:text-sm tracking-[0.12em] text-[#B8E351]">
                Services // Online · {totalServices}/{totalServices} Capabilities Active
              </span>
            </div>

            {/* Main heading */}
            <h2
              id="services-heading"
              className="font-orbitron font-black uppercase text-[24px] sm:text-[30px] md:text-[34px] lg:text-[42px] xl:text-[48px] text-white leading-[1.15] tracking-tight md:whitespace-nowrap"
            >
              {HEADING_WORDS.map((word, i) => (
                <React.Fragment key={word.text}>
                  <span
                    className={`${revealWord} ${
                      word.accent
                        ? 'bg-gradient-to-r from-[#B8E351] via-[#d9f98a] to-[#B8E351] bg-clip-text text-transparent'
                        : ''
                    }`}
                    style={delay(i * 120)}
                  >
                    {word.text}
                  </span>
                  {i < HEADING_WORDS.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </h2>

            {/* Gradient divider */}
            <div
              className={`mt-4 h-px w-full max-w-md origin-left bg-gradient-to-r from-[#B8E351]/60 to-transparent transition-transform duration-1000 ${ease} motion-reduce:transition-none ${
                headingIn ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={delay(1000)}
            />

            {/* Sub text */}
            <p
              className={`mt-6 max-w-3xl text-sm sm:text-base lg:text-lg text-white font-sans leading-relaxed ${revealText}`}
              style={delay(700)}
            >
              We design, engineer, and deploy complete digital products — from pixel-perfect
              interfaces and scalable APIs to full-stack platforms, mobile apps, and intelligent
              AI integrations built for what's ahead.
            </p>
          </div>
        </div>
      </div>

      {/* ================= PINNED SERVICES RUNWAY =================
          Height = one screen + 28vh of scrolling per service (about 240vh for 5).
          Raise 28 if the switching feels too quick, lower it to shorten the section. */}
      <div
        ref={runwayRef}
        className="relative"
        style={{ minHeight: `calc(100svh + ${totalServices * 28}vh)` }}
      >
        {/* ===== ANIMATED BACKGROUND (stays pinned on screen while you scroll) ===== */}
        <div
          aria-hidden="true"
          className="sticky top-0 h-[100svh] w-full -mb-[100svh] overflow-hidden pointer-events-none select-none z-0"
        >
          {/* Drifting aurora glows (the first two also follow the active service) */}
          <div
            className="absolute transition-all duration-[1200ms] ease-out"
            style={{ top: `${5 + activeIdx * 8}%`, left: activeIdx % 2 === 0 ? '-8%' : '4%' }}
          >
            <div className="svc-drift-a w-[38rem] h-[38rem] rounded-full bg-[#B8E351]/12 blur-[120px]" />
          </div>
          <div
            className="absolute transition-all duration-[1200ms] ease-out"
            style={{ bottom: `${0 + activeIdx * 6}%`, right: activeIdx % 2 === 0 ? '-8%' : '2%' }}
          >
            <div className="svc-drift-b w-[34rem] h-[34rem] rounded-full bg-[#23430C]/70 blur-[120px]" />
          </div>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
            <div className="svc-drift-c w-[26rem] h-[26rem] rounded-full bg-emerald-400/10 blur-[110px]" />
          </div>

          {/* Perspective grid floor that moves toward the viewer */}
          <div
            className="absolute inset-x-[-50%] bottom-[-12%] h-[62%]"
            style={{
              transform: 'perspective(700px) rotateX(65deg)',
              transformOrigin: 'center bottom',
              WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
              maskImage: 'linear-gradient(to top, black 10%, transparent 90%)',
            }}
          >
            <div
              className="svc-grid absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(184,227,81,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(184,227,81,0.28) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
          </div>

          {/* Slow scan beam sweeping top to bottom */}
          <div className="svc-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[#B8E351]/[0.07] to-transparent" />

          {/* Rising particles */}
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="svc-particle absolute bottom-0 rounded-full bg-[#B8E351] shadow-[0_0_8px_2px_rgba(184,227,81,0.7)]"
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

          {/* Soft vignette to focus attention on the center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,6,7,0.85)_100%)]" />
        </div>

        {/*
          STICKY VIEWPORT CONTAINER
          Exactly one screen tall. pt-20 / sm:pt-24 keeps the card clear of the fixed header,
          pb-4 / sm:pb-6 leaves a gap at the bottom, so at the end of the runway the card
          sits above the next section's divider and never crosses it.
        */}
        <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-24 pt-20 pb-4 sm:pt-24 sm:pb-6 z-20">

          {/*
            GLASS CARD
            Width: from lg up, the max width is the smaller of 72rem and
            (screen width - 11rem) / 1.3, so on small desktops the card shrinks just enough
            for the robot at x="115%" to stay in view. On big screens it stays at 72rem.
            Raise 11rem to 13rem if the robot still touches the edge, lower it to 9rem
            if the card looks too narrow.
            Height: h-full + max-h, so the card can never be taller than the pinned box.
          */}
          <div className="relative w-full max-w-6xl lg:max-w-[min(72rem,calc((100vw_-_11rem)_/_1.3))] h-full max-h-[48rem] rounded-3xl border border-white/15 bg-[#050607] p-4 sm:p-[clamp(1.25rem,3.5vh,3rem)] lg:px-12 shadow-[0_10px_50px_rgba(0,0,0,0.65),0_0_40px_rgba(35,67,12,0.35)] overflow-hidden flex flex-col">
            <RobotAnchor x="115%" y="50%" scale={0.5} />

            {/* Glowing color orbs behind the glass (the glass layer blurs these) */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
              <div className="absolute -top-20 -right-10 w-96 h-96 rounded-full bg-[#B8E351]/25 blur-3xl" />
              <div className="absolute -bottom-24 -left-10 w-[28rem] h-[28rem] rounded-full bg-[#23430C]/80 blur-3xl" />
              <div className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl" />
            </div>

            {/* Frosted glass layer */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none backdrop-blur-2xl bg-gradient-to-br from-white/[0.10] via-white/[0.03] to-white/[0.07]"
            />

            {/* Soft diagonal light reflection */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-1/2 -left-1/4 w-[45%] h-[200%] rotate-[20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            {/* Bright glass edge on top */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
            />

            {/* Catalog link, top right */}
            <div className="absolute top-3 right-3 sm:top-6 sm:right-8 lg:top-8 lg:right-12 z-20">
              <button
                type="button"
                onClick={() => {
                  sound.playConfirm();
                  onOpenExtendedServices(SERVICES[activeIdx].id);
                }}
                className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#B8E351] text-xs font-mono text-[#B8E351] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* VERTICAL STEPPER (fills the card's free space, content is centered inside it) */}
            <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center">
              <div className="flex flex-col">
                {SERVICES.map((service, idx) => {
                  const isActive = activeIdx === idx;
                  const isReached = idx <= activeIdx; // already scrolled to (or current)
                  const isLast = idx === totalServices - 1;
                  // The line below this circle is lime only once the next step has been reached
                  const isLinePassed = idx < activeIdx;

                  return (
                    <div
                      key={service.id}
                      className={`relative flex items-start gap-3 sm:gap-6 lg:gap-8 select-none ${
                        isLast ? '' : 'pb-3 sm:pb-[clamp(0.75rem,2.4vh,1.5rem)]'
                      }`}
                    >
                      {/* LINE SEGMENT: from this circle's center down to the next circle's center */}
                      {!isLast && (
                        <div
                          aria-hidden="true"
                          className={`absolute left-5 sm:left-6 -translate-x-1/2 top-5 sm:top-6 h-full w-[1.5px] pointer-events-none transition-colors duration-500 ${
                            isLinePassed ? 'bg-[#B8E351]' : 'bg-[#23430C]'
                          }`}
                        />
                      )}

                      {/* NUMBER CIRCLE (smaller on phones) */}
                      <div className="relative shrink-0 z-10">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isReached
                              ? 'bg-[#23430C] border border-[#23430C]'
                              : 'bg-[#050607] border border-[#23430C]'
                          } ${
                            isActive
                              ? 'shadow-[0_0_24px_rgba(184,227,81,0.55)] ring-1 ring-[#B8E351]/70 scale-105'
                              : ''
                          }`}
                        >
                          <span
                            className={`font-orbitron font-extrabold text-xs sm:text-base tracking-tight transition-colors duration-500 ${
                              isReached ? 'text-[#B8E351]' : 'text-[#FFFFFF]'
                            }`}
                          >
                            {service.number}
                          </span>
                        </div>
                      </div>

                      {/* RIGHT CONTENT */}
                      <div className="flex-1 text-left min-w-0">
                        {isActive ? (
                          <div className="animate-in fade-in duration-200">
                            <h3 className="font-orbitron font-extrabold text-base sm:text-[clamp(1.125rem,3.4vh,1.875rem)] text-white tracking-wide uppercase leading-tight mb-2 sm:mb-[clamp(0.5rem,1.6vh,1rem)] max-w-4xl pr-12 sm:pr-24 sm:mt-1">
                              {service.title}
                            </h3>

                            <p className="text-[13px] sm:text-[clamp(0.875rem,2vh,1rem)] text-white/85 font-sans leading-snug sm:leading-relaxed max-w-2xl mb-3 sm:mb-[clamp(0.75rem,2vh,1.25rem)] pl-1 sm:pl-2">
                              {service.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pl-1 sm:pl-2">
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playConfirm();
                                  onSelectServiceAndContact(service.title);
                                }}
                                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#B8E351] hover:bg-[#d0f671] text-[#050607] font-orbitron font-bold text-[11px] sm:text-sm tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(184,227,81,0.45)] active:scale-95 cursor-pointer"
                              >
                                <span>{service.buttonLabel}</span>
                                <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
                              </button>

                              {/* Tags are hidden only on very short phones (e.g. iPhone SE) */}
                              {service.techTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="max-sm:[@media(max-height:720px)]:hidden px-3 py-1.5 rounded bg-white/5 backdrop-blur-sm border border-white/15 text-xs font-mono text-white"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Inactive: heading is always visible */
                          <div className="flex items-center h-10 sm:h-12">
                            <span className="font-orbitron font-bold text-xs sm:text-base lg:text-lg text-white/60 tracking-wider uppercase truncate max-w-3xl">
                              {service.title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM STATUS BAR (never shrinks, always stays inside the card) */}
            <div className="relative z-10 shrink-0 pt-3 sm:pt-4 mt-2 sm:mt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-white/70 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-ping" />
                <span className="hidden sm:inline">SCROLL DOWN TO ADVANCE OFFERINGS</span>
                <span className="sm:hidden">SCROLL TO ADVANCE</span>
              </div>

              {/* Progress indicators (display only, not clickable) */}
              <div className="flex items-center gap-1.5">
                {SERVICES.map((s, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <div
                      key={s.id}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded font-mono text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center border select-none ${
                        isActive
                          ? 'bg-[#B8E351] text-[#050607] border-[#B8E351] shadow-[0_0_10px_#B8E351]'
                          : 'bg-white/5 text-white/70 border-white/15'
                      }`}
                      title={s.title}
                    >
                      {s.number}
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