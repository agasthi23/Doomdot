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
    id: 'cloud',
    title: 'CLOUD ARCHITECTURE & SCALABILITY',
    buttonLabel: 'INQUIRE ABOUT CLOUD ARCHITECTURE',
    description:
      'We design and deploy distributed cloud infrastructures engineered for extreme availability, handling millions of concurrent transactions with fault-tolerant reliability and sub-15ms latency.',
    techTags: ['Go', 'Rust', 'Kafka', 'PostgreSQL', 'Docker'],
  },
  {
    number: '02',
    index: 1,
    id: 'ai-ml',
    title: 'AI & MACHINE LEARNING SYSTEMS',
    buttonLabel: 'INQUIRE ABOUT AI SYSTEMS',
    description:
      'We architect production AI agent pipelines, autonomous tool-calling workflows, and low-latency semantic search with vector databases, backed by high-throughput model latency budgets.',
    techTags: ['Gemini API', 'Python', 'FastAPI', 'Qdrant'],
  },
  {
    number: '03',
    index: 2,
    id: 'web-mobile',
    title: 'WEB & MOBILE APPLICATIONS',
    buttonLabel: 'INQUIRE ABOUT WEB & MOBILE',
    description:
      'From custom React 19 & Next.js 15 web frontends to cross-platform mobile apps, we craft pixel-perfect, 60 FPS interfaces with tactile micro-interactions and zero layout shifts.',
    techTags: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind'],
  },
  {
    number: '04',
    index: 3,
    id: 'custom-software',
    title: 'CUSTOM SOFTWARE DEVELOPMENT',
    buttonLabel: 'INQUIRE ABOUT CUSTOM SOFTWARE',
    description:
      'Turnkey end-to-end software development from day-zero database modeling to live cloud production URLs, including Stripe billing, hardened auth, and private GitHub repository handovers.',
    techTags: ['Node.js', 'Go', 'PostgreSQL', 'Stripe'],
  },
  {
    number: '05',
    index: 4,
    id: 'security-audits',
    title: 'CYBER SECURITY & CODEBASE AUDITS',
    buttonLabel: 'INQUIRE ABOUT AUDITS',
    description:
      'Forensic security penetration testing, OAuth 2.0 zero-trust audits, query optimization, memory leak resolution, and full-spectrum Google Lighthouse performance tuning.',
    techTags: ['Security', 'OAuth 2.0', 'Webhooks', 'Docker'],
  },
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
      className="relative bg-[#050607]"
    >
      {/* ================= SECTION HEADING (left aligned, matches Hero text edge) ================= */}
      <div className="relative w-full pt-30 pb-6 overflow-hidden">
        <div ref={headingRef} className="relative mx-auto w-full max-w-7xl px-6 text-left">

          {/* Soft glow behind the heading */}
          {/* <div
            aria-hidden="true"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[32rem] h-52 rounded-full bg-[#B8E351]/10 blur-3xl pointer-events-none"
          /> */}

          <div className="relative">
            {/* Main heading: one line on tablet and larger screens */}
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

            {/* Sub text */}
            <p
              className={`mt-6 max-w-3xl text-sm sm:text-base lg:text-lg text-white/70 font-sans leading-relaxed ${revealText}`}
              style={delay(700)}
            >
              We design, engineer, and deploy the digital systems that move businesses
              beyond today — from intelligent software and AI to cloud infrastructure,
              automation, and experiences built for what’s ahead.
            </p>

            {/* Gradient divider: grows from the left */}
            <div
              className={`mt-10 h-px w-full max-w-md origin-left bg-gradient-to-r from-[#B8E351]/60 to-transparent transition-transform duration-1000 ${ease} motion-reduce:transition-none ${
                headingIn ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={delay(1000)}
            />
          </div>
        </div>
      </div>

      {/* ================= PINNED SERVICES RUNWAY ================= */}
      <div
        ref={runwayRef}
        className="relative min-h-[260vh] [@media(min-height:900px)]:-mt-16"
      >
        {/* STICKY VIEWPORT CONTAINER */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-24 z-20">

          {/* GLASS CARD */}
          <div className="relative w-full max-w-6xl rounded-3xl border border-white/15 bg-[#050607] p-5 sm:p-8 lg:p-12 shadow-[0_10px_50px_rgba(0,0,0,0.65),0_0_40px_rgba(35,67,12,0.35)] overflow-hidden flex flex-col justify-between">
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
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 lg:top-8 lg:right-12 z-20">
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

            {/* VERTICAL STEPPER */}
            <div className="relative z-10 flex-1 flex flex-col justify-center my-auto py-2">
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
                      className={`relative flex items-start gap-4 sm:gap-6 lg:gap-8 select-none ${
                        isLast ? '' : 'pb-4 sm:pb-5 lg:pb-6'
                      }`}
                    >
                      {/* LINE SEGMENT: from this circle's center down to the next circle's center */}
                      {!isLast && (
                        <div
                          aria-hidden="true"
                          className={`absolute left-6 -translate-x-1/2 top-6 h-full w-[1.5px] pointer-events-none transition-colors duration-500 ${
                            isLinePassed ? 'bg-[#B8E351]' : 'bg-[#23430C]'
                          }`}
                        />
                      )}

                      {/* NUMBER CIRCLE */}
                      <div className="relative shrink-0 z-10">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
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
                            className={`font-orbitron font-extrabold text-sm sm:text-base tracking-tight transition-colors duration-500 ${
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
                            <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-wide uppercase leading-tight mb-3 lg:mb-4 max-w-4xl pr-24 sm:mt-1">
                              {service.title}
                            </h3>

                            <p className="text-sm sm:text-base text-white/85 font-sans leading-relaxed max-w-2xl mb-5 pl-1 sm:pl-2">
                              {service.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pl-1 sm:pl-2">
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playConfirm();
                                  onSelectServiceAndContact(service.title);
                                }}
                                className="px-5 py-2.5 rounded-lg bg-[#B8E351] hover:bg-[#d0f671] text-[#050607] font-orbitron font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(184,227,81,0.45)] active:scale-95 cursor-pointer"
                              >
                                <span>{service.buttonLabel}</span>
                                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                              </button>

                              {service.techTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1.5 rounded bg-white/5 backdrop-blur-sm border border-white/15 text-xs font-mono text-white"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Inactive: heading is always visible */
                          <div className="flex items-center h-12">
                            <span className="font-orbitron font-bold text-sm sm:text-base lg:text-lg text-white/60 tracking-wider uppercase truncate max-w-3xl">
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

            {/* BOTTOM STATUS BAR */}
            <div className="relative z-10 pt-4 mt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-white/70 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-ping" />
                <span>SCROLL DOWN TO ADVANCE OFFERINGS</span>
              </div>

              {/* Progress indicators (display only, not clickable) */}
              <div className="flex items-center gap-1.5">
                {SERVICES.map((s, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <div
                      key={s.id}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded font-mono text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center border select-none ${
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