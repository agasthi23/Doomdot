import React from 'react';
import { ArrowRight, Terminal, CheckCircle2, Zap } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import DotSphere from './DotSphere.tsx';
import { KineticTicker } from './KineticTicker.tsx';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  return (
    <section 
      id="about" 
      className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-8 md:pt-28 md:pb-12 overflow-hidden bg-[#080808] cyber-grid dot-matrix"
    >
      {/* 
        =======================================================================
        1. KINETIC BACKGROUND TYPOGRAPHY
        Position: absolute, z-index: 0, centered/right-aligned,
        color: rgba(255, 255, 255, 0.035) with font-weight: 900
        Stays 100% visible behind the transparent Quantum Core canvas!
        =======================================================================
      */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-4 sm:pr-12 select-none overflow-hidden z-0"
      >
        <span 
          className="font-orbitron font-black text-[18vw] sm:text-[20vw] lg:text-[22vw] tracking-tighter leading-none uppercase text-white/[0.035] select-none"
        >
          DOOMDOT
        </span>
      </div>

      {/* Atmospheric Ambient Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#A8FF00]/8 blur-[160px] rounded-full z-[1]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#00f3ff]/5 blur-[140px] rounded-full z-[1]" 
      />

      {/* 
        =======================================================================
        2. MAIN HERO CONTAINER
        =======================================================================
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: HERO CONTENT                                 */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6 text-left py-4 z-20">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#101b08]/85 border border-[#A8FF00]/30 backdrop-blur-md shadow-[0_0_15px_rgba(168,255,0,0.15)] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#A8FF00] shadow-[0_0_8px_#A8FF00] animate-pulse" />
              <span className="text-[#A8FF00] font-bold tracking-wider">DOOMDOT // ONLINE</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 font-medium">4/4 FOUNDING ARCHITECTS ACTIVE</span>
            </div>

            {/* Main Title (with Neon Green #A8FF00 Highlight) */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
              Building tomorrow, <br />
              with <span className="text-[#A8FF00] drop-shadow-[0_0_35px_rgba(168,255,0,0.65)]">technology<span className="pulse-dot">.</span></span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-sans leading-relaxed">
              We turn bold ideas into high-performance digital products, combining creativity, engineering and the power of emerging technology.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono text-zinc-300 pt-1 max-w-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A8FF00] shrink-0" />
                <span>2 Software Engineers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A8FF00] shrink-0" />
                <span>2 Computer Scientists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A8FF00] shrink-0" />
                <span>14-Day Production MVPs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A8FF00] shrink-0" />
                <span>100% Code & IP Handover</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#services"
                onClick={() => sound.playConfirm()}
                className="px-7 py-3.5 rounded-xl bg-[#A8FF00] hover:bg-[#bcf93f] text-[#080808] font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(168,255,0,0.6)] hover:shadow-[0_0_35px_rgba(168,255,0,0.85)] active:scale-95 cursor-pointer group"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </a>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenTerminal();
                }}
                className="px-6 py-3.5 rounded-xl bg-[#0c1308]/90 hover:bg-[#15250a] border border-[#A8FF00]/40 hover:border-[#A8FF00] text-xs sm:text-sm font-mono text-[#A8FF00] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,255,0,0.15)] active:scale-95"
              >
                <Terminal className="w-4 h-4" />
                <span>&gt;_ Launch CLI</span>
              </button>
            </div>

            {/* Micro Details */}
            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Zap className="w-3.5 h-3.5 text-[#A8FF00]" />
                <span>Zero Agency Middlemen</span>
              </span>
              <span>•</span>
              <span>Direct Slack/Discord Standups</span>
              <span>•</span>
              <span className="text-[#A8FF00] font-semibold">30-Day Post-Launch SLA</span>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: ANIMATED DOT-MATRIX SPHERE                  */}
          {/* ========================================================= */}
          <div
            className="lg:col-span-6 relative w-full h-[500px] sm:h-[580px] lg:h-[640px] flex items-center justify-center bg-transparent z-10 overflow-visible"
            title="Animated lime dot-matrix sphere with a traveling signal wave"
          >
            <DotSphere className="z-10" />

            {/* 
              =================================================================
              3. FLOATING GLASSMORPHISM HUD LABELS
              =================================================================
            */}
            
            {/* Label 1: Top-Left ("01 // ACTIVE ARCHITECT") */}
            <div className="absolute top-8 left-2 sm:left-4 z-20 pointer-events-none transition-transform duration-300">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#091205]/85 backdrop-blur-md border border-[#A8FF00]/40 shadow-[0_0_18px_rgba(168,255,0,0.25)] flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#A8FF00] font-bold">01 // ACTIVE ARCHITECT</span>
                <span className="text-zinc-600">/</span>
                <span className="text-[11px] font-mono font-semibold text-white">4/4 ONLINE</span>
              </div>
            </div>

            {/* Label 2: Top-Right ("60 FPS GPU ACCELERATED") */}
            <div className="absolute top-8 right-2 sm:right-4 z-20 pointer-events-none transition-transform duration-300">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#091205]/85 backdrop-blur-md border border-[#A8FF00]/40 shadow-[0_0_18px_rgba(168,255,0,0.25)] flex items-center gap-2 animate-pulse" style={{ animationDuration: '4s' }}>
                <span className="w-2 h-2 rounded-full bg-[#A8FF00] shadow-[0_0_8px_#A8FF00]" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  SIGNAL WAVE ACTIVE
                </span>
              </div>
            </div>

            {/* Label 3: Bottom-Left ("100% CODE HANDOVER") */}
            <div className="absolute bottom-10 left-2 sm:left-4 z-20 pointer-events-none transition-transform duration-300">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#091205]/85 backdrop-blur-md border border-[#00f3ff]/40 shadow-[0_0_18px_rgba(0,243,255,0.2)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]" />
                <span className="text-[11px] font-mono text-zinc-200">100% CODE HANDOVER</span>
              </div>
            </div>

            {/* Label 4: Bottom-Right ("SUB-15MS LATENCY") */}
            <div className="absolute bottom-10 right-2 sm:right-4 z-20 pointer-events-none transition-transform duration-300">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#091205]/85 backdrop-blur-md border border-[#A8FF00]/40 shadow-[0_0_18px_rgba(168,255,0,0.25)] flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#A8FF00]">&lt; 15MS</span>
                <span className="text-xs font-mono text-zinc-300">LATENCY BENCHMARK</span>
              </div>
            </div>

            {/* Interactive Hint Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-[#A8FF00]/25 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A8FF00] animate-pulse" />
              <span>DOT MATRIX ROTATING • SIGNAL WAVE ACTIVE</span>
            </div>

          </div>

        </div>

      </div>

      {/* Kinetic Ticker for Brand Momentum */}
      <div className="relative z-20 mt-6">
        <KineticTicker />
      </div>
    </section>
  );
};
