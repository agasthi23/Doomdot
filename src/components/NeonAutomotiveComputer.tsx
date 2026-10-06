import React, { useState, useEffect, useRef } from 'react';
import { Zap, Terminal, Sparkles, Activity } from 'lucide-react';
import { sound } from '../utils/audio.ts';

const CODE_LINES = [
  '>> DOOMDOT ENGINE // 4 SE & CS CORE',
  'import { Engine, TurboPipeline } from "@doomdot/core";',
  'const cluster = new Engine({ rpm: 4800, threads: 4 });',
  'await cluster.lockSpecs("postgresql_v16");',
  'const mvp = await cluster.compileMVP({ latency: "<40ms" });',
  '>> [OK] Redis cache layer: 0 race conditions',
  '>> [OK] 60 FPS GLSL shader pipeline active',
  '>> [OK] Production escrow warranty signed',
  'export default async function deploy() {',
  '  return mvp.shipProduction({ zeroDowntime: true });',
  '}',
  '>> PARTY STATUS: 4/4 PLAYERS ONLINE 🚀',
];

export const NeonAutomotiveComputer: React.FC = () => {
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [rpm, setRpm] = useState(3800);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for dynamic 3D spatial rotation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 24, y: -y * 20 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Live typing terminal animation inside CRT screen
  useEffect(() => {
    const fullLine = CODE_LINES[currentLineIdx % CODE_LINES.length];
    const speed = isOverclocked ? 14 : 32;

    const timeout = setTimeout(() => {
      if (charIdx < fullLine.length) {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          const curr = (updated[updated.length - 1] || '') + fullLine[charIdx];
          if (updated.length === 0) return [curr];
          updated[updated.length - 1] = curr;
          return updated;
        });
        setCharIdx((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setDisplayedLines((prev) => {
            const next = [...prev, ''];
            if (next.length > 7) return next.slice(-7);
            return next;
          });
          setCurrentLineIdx((prev) => (prev + 1) % CODE_LINES.length);
          setCharIdx(0);
        }, isOverclocked ? 90 : 250);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIdx, currentLineIdx, isOverclocked]);

  // Dynamic RPM simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const base = isOverclocked ? 6800 : 3800;
      setRpm(base + Math.floor((Math.random() - 0.5) * 160));
    }, 350);
    return () => clearInterval(interval);
  }, [isOverclocked]);

  const toggleTurbo = () => {
    sound.playConfirm();
    setIsOverclocked((prev) => !prev);
  };

  return (
    <div
      ref={frameRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-6 select-none flex flex-col items-center justify-center cursor-pointer"
      style={{ perspective: '1200px' }}
      title="Hover to rotate 3D external workstation · Click Turbo to overclock"
    >
      {/* Dynamic 3D Floating External Computer Object (Keyboard Removed for Clean Automotive Look) */}
      <div
        className="relative transition-transform duration-200 ease-out flex flex-col items-center"
        style={{
          transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg) translateY(${
            isHovered ? '-8px' : '0px'
          })`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floating Ambient Holographic Glow Aura behind computer in 3D space */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-10 bg-[#B8E351]/18 blur-[70px] rounded-full -z-10 animate-pulse"
        />

        {/* Floating Spatial Coordinates HUD chips */}
        <div className="absolute -top-7 left-0 right-0 flex items-center justify-between text-[10px] font-mono text-zinc-400 px-2 pointer-events-none">
          <div className="flex items-center gap-1.5 text-[#B8E351]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-ping" />
            <span className="font-bold tracking-widest">EXTERNAL 3D WORKSTATION</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <span>ROT_X: {Math.round(mousePos.y)}°</span>
            <span>ROT_Y: {Math.round(mousePos.x)}°</span>
            <span className="text-[#B8E351] font-bold">{rpm} RPM</span>
          </div>
        </div>

        {/* Floating Official DoomDot D. Logo Emblem (Replaces the gear wheel) */}
        <div
          className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 z-30 pointer-events-auto"
          style={{ transform: 'translateZ(45px)' }}
          onClick={(e) => {
            e.stopPropagation();
            toggleTurbo();
          }}
          title="Click official D. emblem to toggle Turbo Overclock"
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group cursor-pointer">
            {/* Pulsing neon halo */}
            <div className="absolute inset-0 bg-[#B8E351]/30 blur-xl rounded-full group-hover:scale-110 transition-transform" />

            {/* Orbiting cyber ring */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-[#B8E351]/60"
              style={{
                animation: `spin ${isOverclocked ? '3s' : '9s'} linear infinite`,
              }}
            />

            {/* Dark glass badge container with glowing border */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#060b03]/90 border-2 border-[#B8E351] shadow-[0_0_20px_rgba(184,227,81,0.65)] flex items-center justify-center p-2 group-hover:scale-105 transition-all">
              {/* Official Chiseled "D." Emblem */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-[0_0_10px_rgba(184,227,81,0.9)]"
              >
                <defs>
                  <linearGradient id="comp-d-grad" x1="18%" y1="24%" x2="74%" y2="76%">
                    <stop offset="0%" stopColor="#C9F94A" />
                    <stop offset="50%" stopColor="#B4E834" />
                    <stop offset="100%" stopColor="#96D01E" />
                  </linearGradient>
                </defs>

                {/* Main Chiseled Monogram "D" */}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M 18 24 L 58 24 L 74 40 L 74 60 L 58 76 L 18 76 L 18 62 L 34 50 L 18 38 L 18 24 Z M 36 38 L 50 38 L 62 50 L 50 62 L 36 62 L 46 50 L 36 38 Z"
                  fill="url(#comp-d-grad)"
                />

                {/* Facet Seam Lines */}
                <path d="M 34 50 L 46 50" stroke="#050a02" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
                <path d="M 50 38 L 58 24" stroke="#050a02" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
                <path d="M 50 62 L 58 76" stroke="#050a02" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
                <path d="M 62 50 L 74 50" stroke="#050a02" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />

                {/* The White Dot */}
                <circle
                  cx="84"
                  cy="68"
                  r="8.5"
                  fill="#FFFFFF"
                  filter="drop-shadow(0 0 4px rgba(255,255,255,0.8))"
                />
              </svg>
            </div>

            {/* Micro Badge under emblem */}
            <span className="absolute -bottom-2.5 bg-black/95 px-2 py-0.5 rounded text-[8px] font-mono text-[#B8E351] border border-[#B8E351]/80 shadow-[0_0_8px_#B8E351] tracking-wider font-bold">
              {isOverclocked ? 'TURBO 2X' : 'DOOMDOT // D.'}
            </span>
          </div>
        </div>

        {/* 1. CRT MONITOR CASING (Frameless floating 3D entity) */}
        <div
          className="relative w-[340px] sm:w-[420px] rounded-2xl border-2 border-[#B8E351] bg-[#050903]/95 p-3.5 shadow-[0_0_30px_rgba(184,227,81,0.55),inset_0_0_20px_rgba(35,67,12,0.4)] backdrop-blur-sm"
          style={{ transform: 'translateZ(25px)' }}
        >
          {/* Dual Wireframe Bezel Corner Accents */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white shadow-[0_0_6px_#fff]" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white shadow-[0_0_6px_#fff]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#B8E351]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#B8E351]" />

          {/* Curved CRT Screen Glass Container */}
          <div className="relative rounded-xl border border-[#23430C] bg-[#020401] p-3.5 shadow-[inset_0_0_35px_rgba(0,0,0,0.95)] overflow-hidden">
            {/* Animated CRT Scanlines Overlay */}
            <div className="absolute inset-0 scanlines opacity-40 pointer-events-none z-20" />
            
            {/* CRT Screen Phosphor Green Glow */}
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(184,227,81,0.2)] pointer-events-none z-10" />

            {/* Live Typing Code Stream inside CRT */}
            <div className="relative z-10 min-h-[145px] sm:min-h-[165px] font-mono text-left text-[11px] sm:text-xs leading-relaxed space-y-1">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-[#23430C]/80 pb-1 mb-1.5">
                <span className="text-[#B8E351] font-bold">CRT://DOOMDOT_CORE.TS</span>
                <span className="text-emerald-400">ENGINE_ACTIVE</span>
              </div>

              {displayedLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.startsWith('>>')
                      ? 'text-[#B8E351] font-bold'
                      : line.includes('import') || line.includes('export')
                      ? 'text-white font-semibold'
                      : 'text-emerald-400'
                  }`}
                >
                  <span>{line}</span>
                  {idx === displayedLines.length - 1 && (
                    <span className="inline-block w-2 h-3.5 bg-[#B8E351] ml-0.5 animate-pulse align-middle shadow-[0_0_8px_#B8E351]" />
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Screen Diagnostics */}
            <div className="relative z-10 pt-2 mt-1 border-t border-[#23430C]/60 flex items-center justify-between text-[9px] font-mono text-zinc-400">
              <span className="text-[#B8E351]">LATENCY: &lt; 14ms</span>
              <span className="text-white">SPRINT: READY</span>
            </div>
          </div>

          {/* Monitor Front Bezel Push Buttons */}
          <div className="flex items-center justify-between pt-2 px-2 text-[9px] font-mono text-[#B8E351]">
            <div className="flex gap-1.5 items-center">
              <button
                type="button"
                onClick={toggleTurbo}
                className="w-3 h-2 rounded-[2px] border border-[#B8E351] bg-[#14260a] hover:bg-[#B8E351] hover:text-black transition-colors"
                title="Overclock Button"
              />
              <span className="w-2 h-2 rounded-[2px] border border-[#B8E351] bg-[#0c1606]" />
              <span className="w-2 h-2 rounded-[2px] border border-[#B8E351] bg-[#0c1606]" />
              <span className="w-2 h-2 rounded-[2px] border border-[#B8E351] bg-[#0c1606]" />
              <span className="w-3.5 h-2 rounded-[2px] border border-[#B8E351] bg-[#1e3c0e]" />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] animate-ping" />
              <span className="text-[10px] font-bold text-white tracking-widest">
                DOOMDOT-14P
              </span>
            </div>
          </div>
        </div>

        {/* 2. Sleek Automotive Monitor Stand Neck */}
        <div
          className="w-16 sm:w-20 h-4 border-x-2 border-[#B8E351] bg-[#0a1506] shadow-[0_0_12px_rgba(184,227,81,0.3)]"
          style={{ transform: 'translateZ(15px)' }}
        />

        {/* 3. Clean Aerodynamic Pedestal Floating Base (Replaces the Attached Keyboard!) */}
        <div
          className="relative w-[280px] sm:w-[340px] rounded-full border-2 border-[#B8E351] bg-[#060c04]/95 py-2 px-6 shadow-[0_0_24px_rgba(184,227,81,0.5)] backdrop-blur-sm flex items-center justify-between"
          style={{ transform: 'translateZ(5px)' }}
        >
          {/* Subtle concentric aerodynamic ring */}
          <div className="flex items-center gap-2 text-[9px] font-mono text-[#B8E351]">
            <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-pulse" />
            <span className="font-bold tracking-wider">AERODYNAMIC CORE</span>
          </div>

          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-400">
            <span>60 FPS GLSL</span>
            <span className="text-[#B8E351]">///</span>
            <span className="text-white font-bold">{rpm} RPM</span>
          </div>
        </div>

        {/* 4. Glowing Anti-Gravity Ground Levitation Ring (Floating under pedestal) */}
        <div
          className="w-[240px] sm:w-[300px] h-3 mt-1.5 rounded-full border border-[#B8E351]/50 bg-[#B8E351]/10 blur-[2px] shadow-[0_0_18px_#B8E351]"
          style={{ transform: 'perspective(400px) rotateX(60deg)' }}
        />
      </div>

      {/* Floating Spatial Action Indicator at Bottom */}
      <div className="mt-4 flex items-center gap-3 text-xs font-mono">
        <button
          type="button"
          onClick={toggleTurbo}
          className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            isOverclocked
              ? 'bg-[#B8E351] text-black border-[#B8E351] shadow-[0_0_15px_#B8E351]'
              : 'bg-[#080d04] text-[#B8E351] border-[#23430C] hover:border-[#B8E351]'
          }`}
        >
          <Zap className="w-3 h-3" />
          <span>{isOverclocked ? 'OVERCLOCK ACTIVE: 6,800 RPM' : 'TURBO BOOST'}</span>
        </button>

        <span className="text-zinc-500 text-[11px] hidden sm:inline">
          MOVE CURSOR TO ROTATE IN 3D SPACE
        </span>
      </div>
    </div>
  );
};
