import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowDown, CheckCircle2, Sparkles, Terminal, Code2, ShieldCheck, Zap, Play, Pause, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface JourneyStep {
  number: number;
  id: string;
  phase: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  metrics: { label: string; value: string };
  visualType: 'architecture' | 'code' | 'ai' | 'handover';
}

const STEPS: JourneyStep[] = [
  {
    number: 1,
    id: 'spec',
    phase: 'PHASE 01 // ARCHITECTURAL DISCOVERY',
    title: 'Zero-Bloat System Architecture & Spec Lock',
    tagline: 'We unpack your product vision into battle-tested schemas within 48 hours.',
    description:
      'Instead of spending 6 weeks in bureaucratic agency meetings, our 2 Software Engineers and 2 Computer Scientists meet directly with you. We draft database ER diagrams, API contracts, latency targets, and component trees.',
    deliverables: [
      'PostgreSQL schema & indexing strategy',
      'REST & WebSocket real-time API specifications',
      'Strict TypeScript interfaces & system contracts',
      'Production AWS / Docker deployment topology',
    ],
    techStack: ['PostgreSQL', 'TypeScript', 'Docker', 'DrawSQL'],
    metrics: { label: 'Spec Lock Turnaround', value: '48 Hours' },
    visualType: 'architecture',
  },
  {
    number: 2,
    id: 'sprint',
    phase: 'PHASE 02 // RAPID MVP SPRINT',
    title: 'High-Tempo Full-Stack Implementation',
    tagline: 'Working interactive staging branch delivered by day 3 of the sprint.',
    description:
      'We write clean, high-performance code on Next.js 15, React 19, and Go/Node backends. No mockups or hand-waving: you test real builds with live authentication, payments, and data mutations on staging.',
    deliverables: [
      'Next.js 15 full-stack frontend & reactive state',
      'Sub-50ms API endpoints with Redis caching',
      'Stripe payments & webhooks with idempotent safety',
      'Async Loom progress videos & daily git commit logs',
    ],
    techStack: ['Next.js 15', 'React 19', 'Go / Node', 'Redis', 'Tailwind'],
    metrics: { label: 'Working Staging Build', value: 'Day 3' },
    visualType: 'code',
  },
  {
    number: 3,
    id: 'ai-3d',
    phase: 'PHASE 03 // INTELLIGENCE & 3D POLISH',
    title: 'AI Workflows, Three.js Shaders & Micro-Interactions',
    tagline: 'Elevating digital builds from standard SaaS into unforgettable experiences.',
    description:
      'Our Computer Science leads integrate tailored Gemini/PyTorch vector pipelines, autonomous agent tool calling, and high-framerate Three.js / WebGL spatial graphics that lock at 60 FPS on all devices.',
    deliverables: [
      'Custom LLM tool-calling agents & Qdrant vector search',
      '60 FPS GLSL shaders & 3D particle fields',
      'Sub-200ms tactile haptic micro-interactions',
      'Lighthouse 95+ performance & Web Vitals tuning',
    ],
    techStack: ['Python FastAPI', 'Three.js', 'GLSL', 'Gemini API', 'Qdrant'],
    metrics: { label: 'Frame Rate Guarantee', value: 'Locked 60 FPS' },
    visualType: 'ai',
  },
  {
    number: 4,
    id: 'deploy',
    phase: 'PHASE 04 // AUDIT & CLEAN HANDOVER',
    title: 'Production Handover & 30-Day Escrow Warranty',
    tagline: '100% private GitHub repo ownership with zero strings attached.',
    description:
      'We release through Upwork or Fiverr escrow only when you sign off on working code. You receive clean repositories, automated CI/CD pipelines, complete environment documentation, and a 30-day bug warranty.',
    deliverables: [
      'Full private GitHub organization repository handover',
      'Automated GitHub Actions CI/CD deployment pipelines',
      'Thorough README setup & API documentation',
      '30-Day post-launch warranty with zero-cost bug fixes',
    ],
    techStack: ['GitHub Actions', 'AWS / Vercel', 'Docker', 'Linux'],
    metrics: { label: 'Post-Launch Warranty', value: '30 Days Included' },
    visualType: 'handover',
  },
];

export const ScrollStepperJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prevStepRef = useRef(1);

  // Dynamic Scroll Tracking: as person scrolls down, steps 1 -> 2 -> 3 -> 4 switch dynamically
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScrollable = rect.height - windowH;

      if (totalScrollable <= 0) return;

      // Calculate progress between 0 and 1 while scrolling through section
      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
      setScrollProgress(progress);

      // Determine step: 0-25% -> 1, 25-50% -> 2, 50-75% -> 3, 75-100% -> 4
      let targetStep = 1;
      if (progress >= 0.72) {
        targetStep = 4;
      } else if (progress >= 0.48) {
        targetStep = 3;
      } else if (progress >= 0.22) {
        targetStep = 2;
      } else {
        targetStep = 1;
      }

      if (targetStep !== prevStepRef.current) {
        prevStepRef.current = targetStep;
        setActiveStep(targetStep);
        sound.playHover();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optional Auto-Play Cycle Timer (auto moves through steps every 3.5s if toggled)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev % STEPS.length) + 1;
        sound.playClick();
        return next;
      });
    }, 3800);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const step = STEPS.find((s) => s.number === activeStep) || STEPS[0];

  const handleSelectStep = (num: number) => {
    sound.playClick();
    setActiveStep(num);

    // Scroll to the corresponding position in the track
    const el = sectionRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const totalScrollable = el.offsetHeight - window.innerHeight;
      const targetPercent = (num - 1) / (STEPS.length - 1);
      const targetY = scrollTop + rect.top + targetPercent * totalScrollable;

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative bg-[#050607] border-t border-[#23430C] dot-matrix h-[320vh]"
    >
      {/* Background ambient glow halo */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#23430C]/20 blur-[150px] rounded-full z-0" 
      />

      {/* Pinned Sticky Container that remains locked in viewport during scroll */}
      <div className="sticky top-16 md:top-20 h-[calc(100vh-4.5rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 select-none">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-4 border-b border-[#23430C]/80 gap-3 text-left">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
              <span className="text-[#B8E351] font-bold">02</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span className="text-white font-semibold">SCROLL-DRIVEN PRODUCTION PIPELINE</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span className="text-[#B8E351]">DYNAMIC AUTO-STEP SWITCH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              The 4-Step Engineering Journey
            </h2>
          </div>

          {/* Auto-cycle toggle & scroll status badge */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isAutoPlaying
                  ? 'bg-[#1b2f0a] text-[#B8E351] border-[#B8E351]'
                  : 'bg-[#080d05] text-zinc-400 border-[#23430C] hover:text-white'
              }`}
              title="Toggle automatic step rotation"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Auto-Cycle ON' : 'Auto-Cycle Demo'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#091006] rounded border border-[#23430C] text-xs font-mono text-[#B8E351]">
              <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-ping" />
              <span>SCROLL TO ADVANCE</span>
            </div>
          </div>
        </div>

        {/* The 3-Column Interactive Layout: 3D Visual | Numbered Spine | Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 max-h-[68vh]">
          
          {/* Left Column: Dynamic 3D & Technical Viewport corresponding to active step */}
          <div className="lg:col-span-5 order-2 lg:order-1 h-full flex flex-col justify-center">
            <div className="relative rounded-2xl border border-[#23430C] bg-[#070b04]/95 p-5 sm:p-6 shadow-2xl lime-glow flex flex-col justify-between overflow-hidden transition-all duration-300">
              {/* Scanlines overlay */}
              <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

              {/* Viewport Top Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-[#23430C] pb-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-pulse" />
                  <span className="text-white font-bold text-[11px]">{step.id.toUpperCase()}_STAGE_RENDER.GLSL</span>
                </div>
                <span className="text-[#B8E351] font-bold">NODE 0{step.number} / 04</span>
              </div>

              {/* Visual Render Based on Active Step */}
              <div className="relative py-6 z-10 text-left min-h-[160px] flex items-center">
                {step.visualType === 'architecture' && (
                  <div className="w-full space-y-3 font-mono text-xs">
                    <div className="p-3 bg-[#030502] rounded border border-[#23430C] text-[#B8E351]">
                      <div className="flex justify-between text-[10px] text-zinc-400 pb-1 border-b border-[#23430C]">
                        <span>SCHEMA ARCHITECTURE</span>
                        <span>POSTGRESQL + REDIS</span>
                      </div>
                      <div className="pt-2 text-white font-semibold">TABLE users (id UUID PRIMARY KEY, role ENUM);</div>
                      <div className="text-zinc-400">TABLE sprints (id UUID, latency INT, status VARCHAR);</div>
                      <div className="text-emerald-400">CREATE INDEX idx_sprint_perf ON sprints(latency);</div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#091206] rounded border border-[#23430C] text-[11px]">
                      <span className="text-zinc-300">Target System Latency:</span>
                      <span className="text-[#B8E351] font-bold">&lt; 40ms Median</span>
                    </div>
                  </div>
                )}

                {step.visualType === 'code' && (
                  <div className="w-full space-y-2.5 font-mono text-xs">
                    <div className="p-3 bg-black/95 rounded border border-[#23430C] text-zinc-300 space-y-1">
                      <div className="text-[#B8E351]">export default async function Page() {'{'}</div>
                      <div className="pl-3 text-zinc-400">const state = await fetchSprintStaging();</div>
                      <div className="pl-3 text-emerald-400">return &lt;InteractiveHUD state=&#123;state&#125; /&gt;;</div>
                      <div>{'}'}</div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#091206] rounded border border-[#23430C] text-[11px]">
                      <span className="text-zinc-300">Live PR Staging Build:</span>
                      <span className="text-emerald-400 font-bold">100% PASSING</span>
                    </div>
                  </div>
                )}

                {step.visualType === 'ai' && (
                  <div className="w-full space-y-3 font-mono text-xs">
                    <div className="p-3 bg-[#030502] rounded border border-[#23430C] text-zinc-300">
                      <div className="text-[#B8E351] text-[10px] pb-1 border-b border-[#23430C] flex justify-between">
                        <span>NEURAL AGENT &amp; SHADER PIPELINE</span>
                        <span className="text-white">60 FPS</span>
                      </div>
                      <div className="pt-2 text-white">agent = AutonomousRouter(model=&quot;gemini-2.5&quot;)</div>
                      <div className="text-zinc-400">vectors = qdrant.similarity_search(query)</div>
                      <div className="text-emerald-400">glsl.compileShader(THREE.AdditiveBlending)</div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#091206] rounded border border-[#23430C] text-[11px]">
                      <span className="text-zinc-300">Vector Search Retrieval:</span>
                      <span className="text-[#B8E351] font-bold">18ms median</span>
                    </div>
                  </div>
                )}

                {step.visualType === 'handover' && (
                  <div className="w-full space-y-3 font-mono text-xs">
                    <div className="p-4 bg-[#030502] rounded border border-[#23430C] text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#17270b] border border-[#B8E351] text-[#B8E351] mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(184,227,81,0.5)]">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div className="text-white font-bold text-sm font-display">
                        100% Ownership Transferred
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        Private GitHub Repo Handed Over + 30-Day Escrow Warranty Active
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Viewport Bottom Spec Bar */}
              <div className="pt-2 border-t border-[#23430C] flex justify-between items-center text-[10px] font-mono text-zinc-400 z-10">
                <span>METRIC: {step.metrics.label}</span>
                <span className="text-[#B8E351] font-bold">{step.metrics.value}</span>
              </div>
            </div>
          </div>

          {/* Center Column: The Vertical Glowing Spine with Numbered Circles (1, 2, 3, 4) */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex lg:flex-col items-center justify-center gap-4 lg:gap-8 relative py-4">
            {/* The Vertical Glowing Trail Line (Desktop) */}
            <div className="hidden lg:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-[3px] bg-[#1a2d0d] z-0">
              <div
                className="w-full bg-gradient-to-b from-[#B8E351] via-emerald-400 to-[#B8E351] shadow-[0_0_12px_#B8E351] transition-all duration-300"
                style={{
                  height: `${scrollProgress * 100}%`,
                }}
              />
            </div>

            {/* Horizontal Line for Mobile */}
            <div className="lg:hidden absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[3px] bg-[#1a2d0d] z-0">
              <div
                className="h-full bg-gradient-to-r from-[#B8E351] to-emerald-400 shadow-[0_0_12px_#B8E351] transition-all duration-300"
                style={{
                  width: `${scrollProgress * 100}%`,
                }}
              />
            </div>

            {/* Numbered Circles 1, 2, 3, 4 */}
            {STEPS.map((s) => {
              const isCurrent = s.number === activeStep;
              const isPast = s.number < activeStep;

              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => handleSelectStep(s.number)}
                  className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-display font-black text-base sm:text-lg transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#B8E351] text-black shadow-[0_0_25px_rgba(184,227,81,0.95)] scale-110 ring-4 ring-[#23430C]'
                      : isPast
                      ? 'bg-[#1b2f0a] text-[#B8E351] border-2 border-[#B8E351] hover:scale-105'
                      : 'bg-[#080d05] text-zinc-500 border border-[#23430C] hover:text-white hover:border-[#B8E351]'
                  }`}
                  aria-label={`Jump to stage ${s.number}: ${s.title}`}
                >
                  <span>{s.number}</span>
                  {/* Subtle outer ripple if current */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full border border-[#B8E351] animate-ping opacity-45 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Phase Content & Specifications */}
          <div className="lg:col-span-5 order-3 text-left space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8E351] mb-1 font-bold">
                <span>{step.phase}</span>
                <span aria-hidden="true" className="text-[#23430C]">///</span>
                <span className="text-zinc-400">ACTIVE STAGE</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#B8E351] mt-1 font-mono">
                {step.tagline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
              {step.description}
            </p>

            {/* Concrete Deliverables List */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
                Deliverables in Stage 0{step.number}:
              </div>
              <div className="space-y-1 font-mono text-xs">
                {step.deliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-zinc-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8E351] shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {step.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded bg-[#0b1307] text-[#B8E351] border border-[#23430C] text-[10px] sm:text-[11px] font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Next / Previous Quick Navigators */}
            <div className="pt-3 border-t border-[#23430C] flex items-center justify-between text-xs font-mono">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => handleSelectStep(activeStep - 1)}
                className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                ← Stage 0{activeStep - 1}
              </button>

              <button
                type="button"
                disabled={activeStep === STEPS.length}
                onClick={() => handleSelectStep(activeStep + 1)}
                className="text-[#B8E351] hover:text-[#d0f671] disabled:opacity-30 disabled:pointer-events-none transition-colors font-bold cursor-pointer flex items-center gap-1"
              >
                <span>Stage 0{activeStep + 1}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Floating Scroll Indicator bar at bottom of sticky viewport */}
        <div className="mt-4 pt-3 border-t border-[#23430C]/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <ArrowDown className="w-3.5 h-3.5 text-[#B8E351] animate-bounce" />
            <span>CONTINUE SCROLLING DOWN TO ADVANCE STAGES</span>
          </div>

          <div className="flex items-center gap-2">
            <span>PIPELINE PROGRESS:</span>
            <div className="w-24 bg-[#11190a] h-1.5 rounded overflow-hidden">
              <div
                className="bg-[#B8E351] h-full shadow-[0_0_6px_#B8E351] transition-all duration-150"
                style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[#B8E351] font-bold tabular-nums">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
