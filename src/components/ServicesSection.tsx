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

  const selectService = (index: number, playAudio: boolean = true) => {
    if (index === activeIdx) return;
    if (playAudio) sound.playClick();
    setActiveIdx(index);
    prevIdxRef.current = index;
  };

  // Scroll synchronization: Pinned stage drives active service
  useEffect(() => {
    const handleScroll = () => {
      if (!runwayRef.current) return;
      const rect = runwayRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Map progress directly to active service index (0 to 4)
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
      {/* 
        STICKY VIEWPORT CONTAINER:
        Pinned in center of viewport, compact and proportional.
      */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-4 sm:px-6 z-20">
        
        {/* Main Outer Console Card Frame (Compact & Balanced Proportion) */}
        <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-[#23430C]/90 bg-[#050607] p-5 sm:p-7 lg:p-9 shadow-[0_0_35px_rgba(35,67,12,0.3)] overflow-hidden flex flex-col justify-between">
          <RobotAnchor x="115%" y="50%" scale={0.5} />
          
          {/* Subtle Abstract 3D Fluid / Metallic Background Wave */}
          <div 
            aria-hidden="true" 
            className="absolute inset-0 pointer-events-none opacity-30 select-none overflow-hidden"
          >
            <svg
              className="absolute right-0 top-0 w-[420px] h-[420px] sm:w-[550px] sm:h-[550px] -translate-y-12 translate-x-16"
              viewBox="0 0 900 900"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cyberWaveGradRef2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B8E351" stopOpacity="0.25" />
                  <stop offset="40%" stopColor="#23430C" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#050607" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M 240,120 C 500,40 780,180 720,480 C 660,760 380,820 200,680 C 40,520 80,280 240,120 Z"
                stroke="url(#cyberWaveGradRef2)"
                strokeWidth="2"
              />
              <path
                d="M 310,190 C 560,110 790,260 740,540 C 690,780 430,810 270,690 C 130,550 160,330 310,190 Z"
                stroke="#23430C"
                strokeWidth="1.2"
                opacity="0.6"
              />
            </svg>
            <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-[#B8E351]/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Catalog Link in Top Right Corner */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-7 z-20">
            <button
              type="button"
              onClick={() => {
                sound.playConfirm();
                onOpenExtendedServices(SERVICES[activeIdx].id);
              }}
              className="px-2.5 py-1 rounded-md bg-[#070d04]/90 hover:bg-[#0f1d08] border border-[#23430C] hover:border-[#B8E351] text-[11px] font-mono text-[#B8E351] transition-all flex items-center gap-1 cursor-pointer shadow-sm group"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Catalog</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 
            MAIN VERTICAL STEPPER LIST:
            Compact, sleek, highly readable.
          */}
          <div className="relative z-10 flex-1 flex flex-col justify-center my-auto py-1">
            
            {/* Continuous Vertical Connecting Line */}
            <div 
              aria-hidden="true" 
              className="absolute left-[20px] sm:left-[24px] top-5 bottom-5 w-[1.5px] bg-[#23430C] pointer-events-none" 
            />

            <div className="space-y-3 sm:space-y-3.5">
              {SERVICES.map((service, idx) => {
                const isActive = activeIdx === idx;

                return (
                  <div 
                    key={service.id}
                    onClick={() => selectService(idx)}
                    className={`relative flex items-start gap-3.5 sm:gap-5 cursor-pointer transition-all duration-300 ${
                      isActive ? 'py-1' : 'py-0.5 opacity-65 hover:opacity-100'
                    }`}
                  >
                    {/* LEFT CIRCLE NUMBER BADGE (Scaled Down & Elegant) */}
                    <div className="relative shrink-0 flex items-center justify-center z-10">
                      {isActive ? (
                        /* Active Glowing Circle (42px mobile, 48px desktop) */
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#B8E351] bg-[#050607] flex items-center justify-center shadow-[0_0_22px_rgba(184,227,81,0.65),inset_0_0_10px_rgba(184,227,81,0.2)] transition-all duration-300">
                          <span className="font-orbitron font-extrabold text-sm sm:text-base text-[#B8E351] tracking-tight">
                            {service.number}
                          </span>
                        </div>
                      ) : (
                        /* Inactive Circle */
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#23430C] bg-[#050607] hover:border-[#B8E351]/50 flex items-center justify-center transition-all duration-300 group">
                          <span className="font-orbitron font-bold text-xs sm:text-sm text-[#B8E351]/80 group-hover:text-white transition-colors">
                            {service.number}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="flex-1 pt-1 sm:pt-1.5 text-left">
                      {isActive ? (
                        /* ACTIVE EXPANDED OFFERING */
                        <div className="animate-in fade-in duration-200">
                          {/* Headline (Scaled Down: text-lg to text-2xl) */}
                          <h3 className="font-orbitron font-extrabold text-lg sm:text-xl lg:text-2xl text-white tracking-wide uppercase leading-tight mb-2 max-w-2xl">
                            {service.title}
                          </h3>

                          {/* Description Paragraph */}
                          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed max-w-2xl mb-3 sm:mb-4">
                            {service.description}
                          </p>

                          {/* CTA Button & Tech Stack Tags Row */}
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            {/* Primary Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playConfirm();
                                onSelectServiceAndContact(service.title);
                              }}
                              className="px-4 py-2 rounded-lg bg-[#B8E351] hover:bg-[#d0f671] text-[#050607] font-orbitron font-bold text-[11px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(184,227,81,0.45)] active:scale-95 cursor-pointer"
                            >
                              <span>{service.buttonLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>

                            {/* Tech Stack Pills */}
                            {service.techTags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded bg-[#070d04] border border-[#23430C] text-[11px] font-mono text-zinc-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* INACTIVE SINGLE-LINE TITLE */
                        <div className="flex items-center h-8 sm:h-9">
                          <span className="font-orbitron font-bold text-xs sm:text-sm lg:text-base text-zinc-400 hover:text-white tracking-wider uppercase transition-colors truncate max-w-xl">
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

          {/* 
            BOTTOM STATUS BAR:
            Left: Green dot + SCROLL DOWN TO ADVANCE OFFERINGS
            Right: Number indicator pills [01] [02] [03] [04] [05]
          */}
          <div className="relative z-10 pt-3 mt-2 border-t border-[#23430C]/60 flex flex-wrap items-center justify-between gap-3">
            
            {/* Left Status Indicator */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-ping" />
              <span>SCROLL DOWN TO ADVANCE OFFERINGS</span>
            </div>

            {/* Right Quick-Jump Number Pills */}
            <div className="flex items-center gap-1">
              {SERVICES.map((s, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectService(idx)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center border ${
                      isActive
                        ? 'bg-[#B8E351] text-[#050607] border-[#B8E351] shadow-[0_0_10px_#B8E351]'
                        : 'bg-[#050803] text-zinc-400 border-[#23430C] hover:border-[#B8E351]/60 hover:text-white'
                    }`}
                    title={s.title}
                  >
                    {s.number}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
