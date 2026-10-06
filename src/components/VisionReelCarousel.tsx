import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, ExternalLink, Activity, Sparkles, Terminal, Code2 } from 'lucide-react';
import { CAPSTONE_PROJECTS } from '../data/doomdotData.ts';
import { ProjectCaseStudy } from '../types.ts';
import { sound } from '../utils/audio.ts';

interface VisionReelCarouselProps {
  onSelectProject?: (project: ProjectCaseStudy) => void;
}

export const VisionReelCarousel: React.FC<VisionReelCarouselProps> = ({ onSelectProject }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const activeProject = CAPSTONE_PROJECTS[currentIndex];

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const duration = 4500; // 4.5 seconds per slide
    const tick = 50;
    const step = (tick / duration) * 100;

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % CAPSTONE_PROJECTS.length);
          return 0;
        }
        return prev + step;
      });
    }, tick);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    sound.playClick();
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % CAPSTONE_PROJECTS.length);
  };

  const handlePrev = () => {
    sound.playClick();
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + CAPSTONE_PROJECTS.length) % CAPSTONE_PROJECTS.length);
  };

  const handleSelect = (idx: number) => {
    sound.playClick();
    setProgress(0);
    setCurrentIndex(idx);
  };

  return (
    <div className="w-full mt-12 pt-8 border-t border-[#23430C]/60 relative">
      {/* Top Carousel Bar: Header + Status + Slide Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8E351] shadow-[0_0_10px_#B8E351] animate-pulse" />
            <span className="text-white font-bold tracking-wider">CAP-STONE &amp; PRODUCTION SHOWCASE</span>
          </span>
          <span aria-hidden="true" className="text-[#23430C]">///</span>
          <span className="text-[#B8E351]">OPERATION {currentIndex + 1} / {CAPSTONE_PROJECTS.length}</span>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsPlaying(!isPlaying);
            }}
            title={isPlaying ? 'Pause Vision Stream' : 'Resume Vision Stream'}
            className="p-1.5 text-zinc-400 hover:text-[#B8E351] bg-[#090e06] hover:bg-[#121c0b] border border-[#23430C] rounded transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#B8E351]" />}
          </button>

          {/* Prev / Next Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            title="Previous project"
            className="p-1.5 text-zinc-400 hover:text-white bg-[#090e06] hover:bg-[#121c0b] border border-[#23430C] rounded transition-colors"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            title="Next project"
            className="p-1.5 text-zinc-400 hover:text-white bg-[#090e06] hover:bg-[#121c0b] border border-[#23430C] rounded transition-colors"
            aria-label="Next slide"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Vision Slider Card with Glassmorphism and Neon Border */}
      <div 
        className="relative bg-gradient-to-b from-[#0b1007]/90 to-[#050804] border border-[#23430C] rounded-xl p-5 sm:p-6 overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#B8E351] group hover:shadow-[0_0_30px_rgba(184,227,81,0.2)]"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B8E351] to-transparent opacity-80" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left info column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1b2d0d] text-[#B8E351] border border-[#23430C] uppercase tracking-wide font-semibold">
                {activeProject.category.replace('-', ' ')}
              </span>
              <span className="text-[#23430C]">///</span>
              <span className="text-zinc-300">{activeProject.clientType}</span>
              <span className="text-[#23430C]">///</span>
              <span className="text-[#B8E351] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351]" />
                CAP-STONE VERIFIED
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight group-hover:text-[#B8E351] transition-colors">
                {activeProject.title}
              </h3>
              <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                {activeProject.tagline}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 py-3 px-4 bg-black/70 border border-[#23430C] rounded-lg font-mono text-xs">
              {activeProject.metrics.map((m, i) => (
                <div key={i}>
                  <div className="text-[10px] text-zinc-400 truncate">{m.label}</div>
                  <div className="text-sm sm:text-base font-bold text-[#B8E351] tabular-nums mt-0.5">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech badges + Squad Leads */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1">
              <div className="flex flex-wrap gap-1.5">
                {activeProject.stack.slice(0, 4).map((tech) => (
                  <span key={tech} className="px-2.5 py-0.5 bg-[#090f05] text-zinc-300 border border-[#23430C] rounded-md text-[11px]">
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href="#work"
                onClick={() => sound.playClick()}
                className="text-xs font-mono text-[#B8E351] hover:text-white flex items-center gap-1.5 transition-colors underline-offset-4 hover:underline"
              >
                <span>Inspect Architecture</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right interactive video / looping preview screen */}
          <div className="lg:col-span-5 bg-black/90 rounded-lg border border-[#23430C] p-4 font-mono text-xs space-y-3 relative overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-2 border-b border-[#23430C] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B8E351]" />
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="w-2 h-2 rounded-full bg-zinc-600" />
                <span className="text-[11px] text-zinc-300 ml-1.5">{activeProject.id}.sim_preview.mp4</span>
              </div>
              <span className="text-[10px] text-[#B8E351]">60 FPS LOCKED</span>
            </div>

            {/* Video playback placeholder simulation */}
            <div className="relative aspect-video rounded bg-[#060a04] border border-[#23430C] flex flex-col justify-between p-3 overflow-hidden">
              {/* Scanlines overlay */}
              <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />

              <div className="flex justify-between items-center z-10 text-[10px] text-zinc-400">
                <span className="flex items-center gap-1 text-[#B8E351]">
                  <Play className="w-3 h-3 fill-[#B8E351]" />
                  LOOPING PREVIEW
                </span>
                <span>CODE STREAM #0{currentIndex + 1}</span>
              </div>

              <div className="z-10 text-center py-2">
                <div className="text-white font-bold text-sm font-display tracking-wide">
                  {activeProject.title.split('—')[0]}
                </div>
                <div className="text-[#B8E351] text-[10px] mt-0.5">
                  STACK: {activeProject.stack.slice(0, 3).join(' · ')}
                </div>
              </div>

              <div className="z-10 flex justify-between items-center text-[10px] text-zinc-500 border-t border-[#23430C]/60 pt-1">
                <span>BUFFER: 100%</span>
                <span className="text-emerald-400">STATUS: PRODUCTION ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slide Progress Bar */}
        <div className="w-full bg-[#0a1005] h-1.5 mt-5 rounded overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B8E351] to-emerald-400 transition-all duration-75 shadow-[0_0_8px_#B8E351]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Carousel Slide Indicators */}
        <div className="flex items-center justify-center gap-2 mt-3 pt-1">
          {CAPSTONE_PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-6 bg-[#B8E351] shadow-[0_0_8px_#B8E351]'
                  : 'w-2 bg-[#1b2b0d] hover:bg-[#2e4714]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
