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
  const runwayRef = useRef<HTMLDivElement>(null);
  const prevIdxRef = useRef<number>(0);
  const totalServices = SERVICES.length;

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

  return (
    <section
      id="services"
      ref={runwayRef}
      className="relative min-h-[260vh] bg-[#050607] py-2"
    >
      {/* STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-4 sm:px-6 z-20">

        {/* GLASS CARD */}
        <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#050607] p-5 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.65),0_0_40px_rgba(35,67,12,0.35)] overflow-hidden flex flex-col justify-between">
          <RobotAnchor x="115%" y="50%" scale={0.5} />

          {/* Glowing color orbs behind the glass (the glass layer blurs these) */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full bg-[#B8E351]/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-[#23430C]/80 blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-56 h-56 rounded-full bg-emerald-400/15 blur-3xl" />
          </div>

          {/* Frosted glass layer */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none backdrop-blur-2xl bg-gradient-to-br from-white/[0.10] via-white/[0.03] to-white/[0.07]"
          />

          {/* Soft diagonal light reflection */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-[55%] h-[200%] rotate-[20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          {/* Bright glass edge on top */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none"
          />

          {/* Catalog link, top right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-7 z-20">
            <button
              type="button"
              onClick={() => {
                sound.playConfirm();
                onOpenExtendedServices(SERVICES[activeIdx].id);
              }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-[#B8E351] text-[11px] font-mono text-[#B8E351] transition-all flex items-center gap-1 cursor-pointer shadow-sm group"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Catalog</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
                    className={`relative flex items-start gap-4 sm:gap-6 select-none ${
                      isLast ? '' : 'pb-4 sm:pb-5'
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
                            isReached ? 'text-[#B8E351]' : 'text-[#23430C]'
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
                          <h3 className="font-orbitron font-extrabold text-lg sm:text-xl lg:text-2xl text-white tracking-wide uppercase leading-tight mb-3 max-w-xl sm:mt-1">
                            {service.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-white/85 font-sans leading-relaxed max-w-md mb-4 pl-1 sm:pl-2">
                            {service.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 pl-1 sm:pl-2">
                            <button
                              type="button"
                              onClick={() => {
                                sound.playConfirm();
                                onSelectServiceAndContact(service.title);
                              }}
                              className="px-4 py-2 rounded-lg bg-[#B8E351] hover:bg-[#d0f671] text-[#050607] font-orbitron font-bold text-[11px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(184,227,81,0.45)] active:scale-95 cursor-pointer"
                            >
                              <span>{service.buttonLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>

                            {service.techTags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded bg-white/5 backdrop-blur-sm border border-white/15 text-[11px] font-mono text-white"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Inactive: heading is always visible */
                        <div className="flex items-center h-12">
                          <span className="font-orbitron font-bold text-xs sm:text-sm lg:text-base text-white/60 tracking-wider uppercase truncate max-w-xl">
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
          <div className="relative z-10 pt-3 mt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/70 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-ping" />
              <span>SCROLL DOWN TO ADVANCE OFFERINGS</span>
            </div>

            {/* Progress indicators (display only, not clickable) */}
            <div className="flex items-center gap-1">
              {SERVICES.map((s, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={s.id}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded font-mono text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center border select-none ${
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
    </section>
  );
};