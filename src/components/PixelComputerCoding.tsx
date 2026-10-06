import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, RotateCcw, Cpu, Zap, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio.ts';

const CODE_SCRIPTS = [
  '// DOOMDOT DEV ENGINE // 4 SE & CS THREADS',
  'import { SquadEngine, NextPipeline } from "@doomdot/core";',
  'const squad = new SquadEngine({ capacity: 4, speed: "10x" });',
  'await squad.loadArchitecture("postgres-redis-topology");',
  'const build = await squad.compileMVP({',
  '  stack: ["Next.js 15", "TypeScript", "Tailwind", "Go"],',
  '  latencyTarget: "sub-40ms",',
  '  ci_cd: "Automated GitHub Actions"',
  '});',
  '>> [INFO] Redis atomic lock verified: 0 race conditions',
  '>> [SUCCESS] API benchmark: 14.2ms median latency',
  '>> [PASS] 48/48 unit & integration tests passing',
  'export default async function launch() {',
  '  return build.deployToProduction({ zeroDowntime: true });',
  '}',
  '// Handover complete: 100% clean GitHub repo transferred',
  '>> PARTY STATUS: 4/4 PLAYERS READY FOR NEXT SPRINT 🚀',
];

const MATRIX_CHARS = '0123456789ABCDEF<>/*{}[]=+#@';

export const PixelComputerCoding: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'matrix' | 'system'>('code');
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [buildPercent, setBuildPercent] = useState(74);
  const [ledBlink, setLedBlink] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

  // Blinking floppy / power LED
  useEffect(() => {
    const ledInterval = setInterval(() => {
      setLedBlink((prev) => !prev);
    }, 450);
    return () => clearInterval(ledInterval);
  }, []);

  // Live typing code effect
  useEffect(() => {
    if (activeTab !== 'code') return;

    const currentFullLine = CODE_SCRIPTS[currentLineIndex % CODE_SCRIPTS.length];

    const typeTimeout = setTimeout(() => {
      if (charIndex < currentFullLine.length) {
        // Typing characters
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          const curr = (newLines[newLines.length - 1] || '') + currentFullLine[charIndex];
          if (newLines.length === 0) return [curr];
          newLines[newLines.length - 1] = curr;
          return newLines;
        });
        setCharIndex((prev) => prev + 1);
      } else {
        // Finished current line, advance to next
        setTimeout(() => {
          setDisplayedLines((prev) => {
            const next = [...prev, ''];
            // Keep at most 9 lines in view to prevent overflow
            if (next.length > 9) return next.slice(-9);
            return next;
          });
          setCurrentLineIndex((prev) => (prev + 1) % CODE_SCRIPTS.length);
          setCharIndex(0);
          setBuildPercent((prev) => (prev >= 100 ? 12 : prev + 14));
        }, 120 / speedMultiplier);
      }
    }, (18 + Math.random() * 20) / speedMultiplier);

    return () => clearTimeout(typeTimeout);
  }, [charIndex, currentLineIndex, activeTab, speedMultiplier]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLines]);

  // Matrix Rain Canvas Effect for Matrix Tab
  useEffect(() => {
    if (activeTab !== 'matrix') return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 220);

    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(5, 8, 4, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#B8E351';
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.85 ? '#ffffff' : '#B8E351';
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(drawMatrix);
    };

    drawMatrix();

    return () => cancelAnimationFrame(animId);
  }, [activeTab]);

  const handleTurboCompile = () => {
    sound.playConfirm();
    setSpeedMultiplier(3);
    setTimeout(() => setSpeedMultiplier(1), 3000);
  };

  const handleClearCode = () => {
    sound.playClick();
    setDisplayedLines(['']);
    setCharIndex(0);
  };

  return (
    <div className="relative rounded-2xl border border-[#23430C] bg-[#070b04]/95 p-4 shadow-2xl lime-glow overflow-hidden select-none">
      {/* Top Retro Workstation Title Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#23430C] text-xs font-mono">
        <div className="flex items-center gap-2">
          {/* Animated Retro Blinking LED */}
          <span
            className={`w-2.5 h-2.5 rounded-full transition-opacity duration-150 ${
              ledBlink
                ? 'bg-[#B8E351] shadow-[0_0_10px_#B8E351] opacity-100'
                : 'bg-[#23430C] opacity-40'
            }`}
          />
          <span className="text-white font-bold tracking-wider text-[11px] font-mono">
            DOOMDOT // PIXEL CRT WORKSTATION
          </span>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center bg-black/80 rounded p-0.5 border border-[#23430C]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('code');
            }}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              activeTab === 'code'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Live Code
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('matrix');
            }}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              activeTab === 'matrix'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Matrix
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('system');
            }}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              activeTab === 'system'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* Retro Pixel Computer Chassis Frame */}
      <div className="relative rounded-xl border-2 border-[#1a2f0c] bg-[#0c1308] p-3 shadow-inner">
        {/* Computer Monitor Bezel Screws / Vents */}
        <div className="flex justify-between items-center mb-1.5 px-1">
          <div className="flex gap-1.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1b2a11] border border-[#23430C]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#1b2a11] border border-[#23430C]" />
            <span className="text-[9px] font-mono text-zinc-500 tracking-widest pl-1">
              CRT-COLOR-14P
            </span>
          </div>
          <div className="flex gap-1 text-[8px] font-mono text-[#B8E351] bg-[#060a03] px-2 py-0.5 rounded border border-[#23430C]">
            <span>60HZ</span>
            <span className="text-zinc-600">|</span>
            <span>4 THREADS</span>
          </div>
        </div>

        {/* The CRT Curved Glass Screen with Glow & Scanlines */}
        <div className="relative aspect-[16/10] sm:aspect-video rounded-lg overflow-hidden border border-[#23430C] bg-[#040603] p-3 font-mono shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex flex-col justify-between">
          {/* CRT Scanlines Overlay */}
          <div className="absolute inset-0 scanlines opacity-35 pointer-events-none z-20" />
          
          {/* CRT Screen Corner Vignette / Glow */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(35,67,12,0.35)] z-10" />

          {/* TAB 1: Live Animated Pixel Code Stream */}
          {activeTab === 'code' && (
            <div className="relative z-10 flex-1 overflow-y-auto pr-1 text-left text-[11px] leading-relaxed space-y-1 scrollbar-none font-mono">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-[#23430C]/60 pb-1 mb-1">
                <span className="text-[#B8E351]">doomdot_orchestrator.ts</span>
                <span className="text-emerald-400">STATUS: RUNNING</span>
              </div>

              {displayedLines.map((line, idx) => {
                const isComment = line.startsWith('//');
                const isSuccess = line.includes('SUCCESS') || line.includes('READY') || line.includes('PASS');
                const isInfo = line.includes('INFO') || line.includes('>>');
                const isKeyword = line.includes('import') || line.includes('export') || line.includes('const') || line.includes('await');

                return (
                  <div
                    key={idx}
                    className={`${
                      isComment
                        ? 'text-zinc-500 italic'
                        : isSuccess
                        ? 'text-emerald-400 font-bold'
                        : isInfo
                        ? 'text-[#B8E351]'
                        : isKeyword
                        ? 'text-white'
                        : 'text-zinc-300'
                    }`}
                  >
                    <span>{line}</span>
                    {idx === displayedLines.length - 1 && (
                      <span className="inline-block w-2 h-3.5 bg-[#B8E351] ml-0.5 animate-pulse align-middle" />
                    )}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          )}

          {/* TAB 2: Matrix Cyber Rain Canvas */}
          {activeTab === 'matrix' && (
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              <canvas ref={matrixCanvasRef} className="w-full h-full block" />
            </div>
          )}

          {/* TAB 3: System Performance Monitor */}
          {activeTab === 'system' && (
            <div className="relative z-10 w-full h-full p-2 text-left font-mono text-xs space-y-2 text-zinc-300 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-zinc-500 border-b border-[#23430C] pb-1 flex justify-between">
                  <span className="text-[#B8E351]">SYSTEM TOPOLOGY DIAGNOSTICS</span>
                  <span className="text-emerald-400">NORMAL</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div className="p-2 bg-[#080e05] rounded border border-[#23430C]">
                    <div className="text-zinc-500 text-[9px]">ENGINE LOAD</div>
                    <div className="text-[#B8E351] font-bold text-sm">18.4%</div>
                  </div>
                  <div className="p-2 bg-[#080e05] rounded border border-[#23430C]">
                    <div className="text-zinc-500 text-[9px]">MEMORY HEAP</div>
                    <div className="text-white font-bold text-sm">24.2 MB</div>
                  </div>
                  <div className="p-2 bg-[#080e05] rounded border border-[#23430C]">
                    <div className="text-zinc-500 text-[9px]">API LATENCY</div>
                    <div className="text-emerald-400 font-bold text-sm">14ms</div>
                  </div>
                  <div className="p-2 bg-[#080e05] rounded border border-[#23430C]">
                    <div className="text-zinc-500 text-[9px]">ACTIVE GUILD</div>
                    <div className="text-[#B8E351] font-bold text-sm">4 / 4</div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 border-t border-[#23430C] pt-1">
                Zero legacy bloat · Direct engineering access
              </div>
            </div>
          )}

          {/* Bottom CRT Screen Live Build Ticker Bar */}
          <div className="relative z-10 pt-2 border-t border-[#23430C]/80 flex items-center justify-between text-[10px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="text-[#B8E351] font-bold">SPRINT BUILD:</span>
              <span className="font-mono text-white">{buildPercent}%</span>
              <div className="w-16 bg-[#0c1408] h-1.5 rounded overflow-hidden border border-[#23430C]">
                <div
                  className="bg-[#B8E351] h-full shadow-[0_0_6px_#B8E351] transition-all duration-300"
                  style={{ width: `${buildPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTurboCompile}
                className="px-2 py-0.5 rounded bg-[#17270b] hover:bg-[#22390f] text-[#B8E351] text-[9px] font-bold border border-[#23430C] transition-colors cursor-pointer flex items-center gap-1"
                title="Trigger turbo compilation burst"
              >
                <Zap className="w-2.5 h-2.5" />
                <span>Turbo</span>
              </button>
              <button
                type="button"
                onClick={handleClearCode}
                className="px-1.5 py-0.5 rounded bg-black/60 hover:bg-[#121c0b] text-zinc-500 hover:text-zinc-300 text-[9px] border border-[#23430C] transition-colors cursor-pointer"
                title="Restart code typewriter"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chassis Stand / Keyboard Silhouette with Pixel Coffee & Floppy Disk */}
        <div className="mt-2 pt-2 border-t border-[#1a2f0c] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            {/* Floppy Slot */}
            <div className="w-14 h-2 bg-[#050803] rounded border border-[#23430C] flex items-center px-1">
              <span className="w-1 h-1 rounded-full bg-[#B8E351] animate-pulse" />
            </div>
            <span className="text-[9px] text-zinc-500">3.5&quot; FLOPPY DRIVE</span>
          </div>

          <div className="flex items-center gap-2 text-[9px] text-[#B8E351]">
            <span className="text-zinc-600">☕ DEV SPRINT ACTIVE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351]" />
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker / Live Speed Indicators */}
      <div className="mt-3 pt-3 border-t border-[#23430C] grid grid-cols-3 gap-2 text-left font-mono text-[11px]">
        <div className="bg-[#050804] p-2 rounded border border-[#23430C]">
          <span className="text-zinc-500 text-[9px] block uppercase">Runtime Ops</span>
          <span className="text-white font-bold tabular-nums">140k / sec</span>
        </div>
        <div className="bg-[#050804] p-2 rounded border border-[#23430C]">
          <span className="text-zinc-500 text-[9px] block uppercase">Compile Rate</span>
          <span className="text-[#B8E351] font-bold tabular-nums">
            {speedMultiplier > 1 ? '3x TURBO' : '1.4s (Clean)'}
          </span>
        </div>
        <div className="bg-[#050804] p-2 rounded border border-[#23430C]">
          <span className="text-zinc-500 text-[9px] block uppercase">Squad Co-Op</span>
          <span className="text-emerald-400 font-bold">4/4 Online</span>
        </div>
      </div>
    </div>
  );
};
