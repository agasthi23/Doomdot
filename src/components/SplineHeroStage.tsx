import React, { useState, Suspense, lazy } from 'react';
import { Sparkles, Eye, Settings2, Check, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio.ts';

// Lazy-load Spline to prevent SSR / heavy initial bundle overhead
const Spline = lazy(() => import('@splinetool/react-spline'));

// Curated high-tech community Spline scenes ready out of the box
const PRESET_SPLINE_SCENES = [
  {
    id: 'cyber-core',
    name: 'Interactive Cyber Core (Spline)',
    url: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  },
  {
    id: 'quantum-mesh',
    name: 'Quantum Particle Mesh (Spline)',
    url: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
  },
];

interface SplineHeroStageProps {
  className?: string;
}

export const SplineHeroStage: React.FC<SplineHeroStageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'spline' | 'cinematic'>('spline');
  const [splineSceneUrl, setSplineSceneUrl] = useState<string>(PRESET_SPLINE_SCENES[0].url);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [splineLoaded, setSplineLoaded] = useState<boolean>(false);
  const [splineError, setSplineError] = useState<boolean>(false);

  // Mouse parallax for cinematic fallback / video layer
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const applyCustomUrl = () => {
    if (!customInputUrl.trim()) return;
    sound.playConfirm();
    setSplineError(false);
    setSplineLoaded(false);
    setSplineSceneUrl(customInputUrl.trim());
    setShowConfig(false);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`relative w-full h-[500px] sm:h-[580px] lg:h-[660px] flex items-center justify-center select-none ${className}`}
    >
      {/* Background Ambient Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute w-[480px] h-[480px] bg-[#A8FF00]/12 blur-[130px] rounded-full z-0" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute w-[320px] h-[320px] bg-[#00f3ff]/8 blur-[110px] rounded-full z-0" 
      />

      {/* 
        =======================================================================
        1. ACTIVE BORDERLESS 3D VIEWPORT (Spline 3D or Cinematic Loop)
        =======================================================================
      */}
      <div className="relative w-full h-full z-10 flex items-center justify-center overflow-hidden">
        
        {activeTab === 'spline' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Loading state indicator */}
            {!splineLoaded && !splineError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <div className="w-12 h-12 rounded-full border-2 border-[#A8FF00]/20 border-t-[#A8FF00] animate-spin mb-3 shadow-[0_0_15px_#A8FF00]" />
                <span className="text-xs font-mono text-[#A8FF00] tracking-widest uppercase">
                  INITIALIZING SPLINE 3D ENGINE...
                </span>
                <span className="text-[10px] font-mono text-zinc-500 mt-1">
                  STUDIO-GRADE SHADERS &amp; REAL-TIME LIGHTING
                </span>
              </div>
            )}

            {/* Error fallback state */}
            {splineError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center">
                <div className="px-4 py-3 rounded-xl bg-[#140808]/90 border border-red-500/30 text-xs font-mono text-zinc-300 max-w-sm mb-4">
                  <p className="text-red-400 font-bold mb-1">Spline Scene Connection Note</p>
                  <p className="text-[11px] text-zinc-400">
                    Network sandbox restricted external Spline CDN or invalid URL. Switched to Studio Cinematic Mode.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('cinematic');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#A8FF00] text-black font-bold text-xs font-mono uppercase tracking-wider"
                >
                  View AAA Cinematic Mode
                </button>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-[#A8FF00]/20 border-t-[#A8FF00] animate-spin" />
                  </div>
                }
              >
                <div className="w-full h-full [&>canvas]:!w-full [&>canvas]:!h-full [&>canvas]:!outline-none [&>canvas]:pointer-events-auto">
                  <Spline
                    scene={splineSceneUrl}
                    onLoad={() => setSplineLoaded(true)}
                    onError={() => {
                      setSplineError(true);
                    }}
                  />
                </div>
              </Suspense>
            )}
          </div>
        ) : (
          /* 
            ===================================================================
            2. AAA CINEMATIC INTERACTIVE LOOP (Solution #3 from User Brief)
            Zero WebGL overhead, photorealistic robot astronaut with glowing 
            green eyes & cosmic nebula, with smooth 3D mouse parallax tilt.
            ===================================================================
          */
          <div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 7}deg) rotateX(${mousePos.y * 7}deg)`,
            }}
          >
            {/* Photorealistic Chibi Robot Mascot with Seamless Dark Alpha Mask */}
            <div className="relative w-full max-w-[560px] aspect-[16/11] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,255,0,0.25)]">
              <img
                src="/src/assets/images/hero_robot_mascot_1791125340446.jpg"
                alt="DoomDot Studio Grade 3D Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-105"
              />
              
              {/* Cinematic Vignette blending into #080808 */}
              <div 
                aria-hidden="true" 
                className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 pointer-events-none" 
              />
              <div 
                aria-hidden="true" 
                className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-[#080808]/60 pointer-events-none" 
              />

              {/* Glowing Neon Green Rim Highlight */}
              <div 
                aria-hidden="true" 
                className="absolute -inset-1 rounded-3xl border border-[#A8FF00]/40 pointer-events-none shadow-[0_0_30px_rgba(168,255,0,0.35)]" 
              />
            </div>
          </div>
        )}

      </div>

      {/* 
        =======================================================================
        3. FLOATING GLASSMORPHISM HUD OVERLAYS (Borderless, floating over 3D)
        =======================================================================
      */}

      {/* HUD 1: Top-Right Badge (60 FPS GPU ACCELERATED) */}
      <div className="absolute top-4 right-1 sm:right-4 z-30 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-[#A8FF00]/40 shadow-[0_0_20px_rgba(168,255,0,0.25)] flex items-center gap-2 animate-pulse" style={{ animationDuration: '4s' }}>
          <span className="w-2 h-2 rounded-full bg-[#A8FF00] shadow-[0_0_8px_#A8FF00]" />
          <span className="text-xs font-mono font-bold text-white tracking-wider">
            60 FPS GPU ACCELERATED
          </span>
          <span className="text-[#00f3ff] text-[10px] font-mono">[SPLINE_READY]</span>
        </div>
      </div>

      {/* HUD 2: Top-Left Badge (DOOM-01 // AUTONOMOUS MESH) */}
      <div className="absolute top-6 left-1 sm:left-4 z-30 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-[#00f3ff]/40 shadow-[0_0_20px_rgba(0,243,255,0.2)] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00f3ff]" />
          <span className="text-[11px] font-mono text-[#A8FF00] font-bold">DOOM-01</span>
          <span className="text-zinc-500">/</span>
          <span className="text-[11px] font-mono text-zinc-200">STUDIO 3D MASCOT</span>
        </div>
      </div>

      {/* HUD 3: Bottom-Right Badge (< 15MS LATENCY BENCHMARK) */}
      <div className="absolute bottom-6 right-1 sm:right-6 z-30 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-[#A8FF00]/40 shadow-[0_0_18px_rgba(168,255,0,0.2)] flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#A8FF00]">
            &lt; 15MS
          </span>
          <span className="text-xs font-mono text-zinc-300">
            LATENCY BENCHMARK
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]" />
        </div>
      </div>

      {/* HUD 4: Bottom-Left Switcher & Custom Spline URL Slot */}
      <div className="absolute bottom-4 left-1 sm:left-4 z-30 flex items-center gap-2">
        {/* Toggle Mode: Spline vs Cinematic */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 backdrop-blur-md border border-[#A8FF00]/30 shadow-lg">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('spline');
              setSplineError(false);
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'spline'
                ? 'bg-[#A8FF00] text-black shadow-[0_0_10px_#A8FF00]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            SPLINE 3D
          </button>
          
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('cinematic');
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'cinematic'
                ? 'bg-[#A8FF00] text-black shadow-[0_0_10px_#A8FF00]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AAA CINEMATIC
          </button>

          {/* Spline URL Configurator Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowConfig(!showConfig);
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-[#A8FF00] transition-colors cursor-pointer"
            title="Configure Spline 3D Scene URL"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 
        =======================================================================
        4. SPLINE SCENE URL MODAL / DROPDOWN (For instant user/client customization)
        =======================================================================
      */}
      {showConfig && (
        <div className="absolute bottom-16 left-4 z-40 w-80 p-4 rounded-2xl bg-[#091006]/95 backdrop-blur-xl border border-[#A8FF00]/50 shadow-[0_0_30px_rgba(168,255,0,0.3)] text-left">
          <div className="flex items-center justify-between mb-3 border-b border-[#23430C] pb-2">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-[#A8FF00]" />
              <span>SPLINE SCENE URL</span>
            </span>
            <button
              type="button"
              onClick={() => setShowConfig(false)}
              className="text-zinc-500 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-zinc-300 font-sans leading-relaxed mb-3">
            Paste your exported scene URL from <strong className="text-[#A8FF00]">Spline.design</strong> (e.g. <code className="text-zinc-400 text-[10px]">https://prod.spline.design/.../scene.splinecode</code>):
          </p>

          <div className="space-y-2 mb-3">
            <input
              type="text"
              value={customInputUrl}
              onChange={(e) => setCustomInputUrl(e.target.value)}
              placeholder="https://prod.spline.design/..."
              className="w-full px-3 py-1.5 rounded-lg bg-[#040802] border border-[#23430C] focus:border-[#A8FF00] text-xs font-mono text-zinc-200 outline-none"
            />
            <button
              type="button"
              onClick={applyCustomUrl}
              className="w-full py-1.5 rounded-lg bg-[#A8FF00] hover:bg-[#bcf93f] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Custom Scene</span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-zinc-400">
            <span className="text-zinc-500">PRESETS:</span>
            <div className="mt-1 space-y-1">
              {PRESET_SPLINE_SCENES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSplineSceneUrl(preset.url);
                    setShowConfig(false);
                  }}
                  className="block text-left text-zinc-300 hover:text-[#A8FF00] truncate w-full hover:underline"
                >
                  • {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
